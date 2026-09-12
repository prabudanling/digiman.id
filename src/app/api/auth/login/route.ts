import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { logActivity } from "@/lib/admin-guard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
    }

    const user = await db.adminUser.findUnique({ where: { username } });

    // Jeda kecil untuk memperlambat brute force
    if (!user || !verifyPassword(password, user.passwordHash)) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    const token = await signSession({ sub: user.id, username: user.username, name: user.name });
    const res = NextResponse.json({
      ok: true,
      user: { username: user.username, name: user.name },
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    await logActivity(user.username, "LOGIN", "Masuk ke panel admin");
    return res;
  } catch (e) {
    console.error("POST /api/auth/login error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}

// force rebuild: prisma client freshness
