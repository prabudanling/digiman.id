import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWrite, cleanStr, ROLES, type Role } from "@/lib/admin-guard";
import { hashPassword } from "@/lib/auth";

function isRole(v: string): v is Role {
  return (ROLES as readonly string[]).includes(v);
}

/** PUT /api/admin/users/[id] — ubah nama / role / password */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "users");
  if (session instanceof NextResponse) return session;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const target = await db.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });

  const data: { name?: string; role?: string; passwordHash?: string } = {};

  if (typeof body.name === "string" && body.name.trim()) {
    data.name = cleanStr(body.name, 80);
  }
  if (typeof body.role === "string" && isRole(cleanStr(body.role, 20))) {
    // Cegah menurunkan diri sendiri & cegah tanpa SUPERADMIN tersisa
    if (target.id === session.sub && target.role === "SUPERADMIN" && body.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Anda tidak dapat menurunkan peran akun sendiri." }, { status: 400 });
    }
    if (target.role === "SUPERADMIN" && body.role !== "SUPERADMIN") {
      const supers = await db.adminUser.count({ where: { role: "SUPERADMIN" } });
      if (supers <= 1) {
        return NextResponse.json(
          { error: "Harus tersisa minimal 1 Super Admin." },
          { status: 400 }
        );
      }
    }
    data.role = body.role;
  }
  if (typeof body.password === "string" && body.password.length > 0) {
    if (body.password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
    }
    data.passwordHash = hashPassword(body.password);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan." }, { status: 400 });
  }

  const user = await db.adminUser.update({
    where: { id },
    data,
    select: { id: true, username: true, name: true, role: true },
  });
  await db.activityLog.create({
    data: {
      username: session.username,
      action: "UPDATE",
      detail: `Memperbarui akun admin "${target.username}"${data.role ? ` → ${data.role}` : ""}${data.passwordHash ? " (password diganti)" : ""}`,
    },
  }).catch(() => {});
  return NextResponse.json({ ok: true, user });
}

/** DELETE /api/admin/users/[id] */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "users");
  if (session instanceof NextResponse) return session;

  const { id } = await ctx.params;
  const target = await db.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });

  if (target.id === session.sub) {
    return NextResponse.json({ error: "Anda tidak dapat menghapus akun sendiri." }, { status: 400 });
  }
  if (target.role === "SUPERADMIN") {
    const supers = await db.adminUser.count({ where: { role: "SUPERADMIN" } });
    if (supers <= 1) {
      return NextResponse.json({ error: "Harus tersisa minimal 1 Super Admin." }, { status: 400 });
    }
  }

  await db.adminUser.delete({ where: { id } });
  await db.activityLog.create({
    data: { username: session.username, action: "DELETE", detail: `Menghapus akun admin "${target.username}"` },
  }).catch(() => {});
  return NextResponse.json({ ok: true });
}
