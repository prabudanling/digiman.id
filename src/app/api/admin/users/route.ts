import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireWrite, cleanStr, ROLES, type Role } from "@/lib/admin-guard";
import { hashPassword } from "@/lib/auth";

function isRole(v: string): v is Role {
  return (ROLES as readonly string[]).includes(v);
}

/** GET /api/admin/users — daftar akun admin (SUPERADMIN saja) */
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  if (session.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Hanya Super Admin dapat mengelola pengguna." }, { status: 403 });
  }

  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true, username: true, name: true, role: true,
      lastLoginAt: true, createdAt: true,
    },
  });
  return NextResponse.json({ users });
}

/** POST /api/admin/users — buat akun baru */
export async function POST(req: NextRequest) {
  const session = await requireWrite(req, "users");
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const username = cleanStr(body.username, 40).toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const name = cleanStr(body.name, 80) || username;
    const password = typeof body.password === "string" ? body.password : "";
    const role = isRole(cleanStr(body.role, 20)) ? cleanStr(body.role, 20) : "EDITOR";

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username minimal 3 karakter (huruf kecil, angka, titik, garis)." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
    }

    const exists = await db.adminUser.findUnique({ where: { username } });
    if (exists) {
      return NextResponse.json({ error: `Username "${username}" sudah dipakai.` }, { status: 409 });
    }

    const user = await db.adminUser.create({
      data: { username, name, role, passwordHash: hashPassword(password) },
      select: { id: true, username: true, name: true, role: true, createdAt: true },
    });
    await db.activityLog.create({
      data: { username: session.username, action: "CREATE", detail: `Membuat akun admin "${username}" (${role})` },
    }).catch(() => {});
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error("POST /api/admin/users error:", e);
    return NextResponse.json({ error: "Gagal membuat akun." }, { status: 500 });
  }
}
