import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { requireAdmin, cleanStr } from "@/lib/admin-guard";

/** Ganti profil & password akun admin yang sedang login. */
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newUsername = cleanStr(body.newUsername, 40).toLowerCase();
    const newName = cleanStr(body.newName, 80);
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    const user = await db.adminUser.findUnique({ where: { id: session.sub } });
    if (!user) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });

    if (!currentPassword || !verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: "Password saat ini salah." }, { status: 403 });
    }

    if (newPassword && newPassword.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
    }

    if (newUsername && newUsername !== user.username) {
      const exists = await db.adminUser.findUnique({ where: { username: newUsername } });
      if (exists) {
        return NextResponse.json({ error: "Username sudah dipakai." }, { status: 409 });
      }
    }

    const updated = await db.adminUser.update({
      where: { id: user.id },
      data: {
        ...(newUsername ? { username: newUsername } : {}),
        ...(newName ? { name: newName } : {}),
        ...(newPassword ? { passwordHash: hashPassword(newPassword) } : {}),
      },
    });

    return NextResponse.json({ ok: true, user: { username: updated.username, name: updated.name } });
  } catch (e) {
    console.error("POST /api/admin/account error:", e);
    return NextResponse.json({ error: "Gagal memperbarui akun." }, { status: 500 });
  }
}
