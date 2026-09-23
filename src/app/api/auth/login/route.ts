import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { logActivity } from "@/lib/admin-guard";

/** Rate limit login sederhana in-memory: maks 8 percobaan / 5 menit per kombinasi ip+username */
const attempts = new Map<string, { count: number; resetAt: number }>();
function loginBlocked(key: string): { blocked: boolean; retryIn: number } {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 0, resetAt: now + 5 * 60 * 1000 });
    return { blocked: false, retryIn: 0 };
  }
  return { blocked: entry.count >= 8, retryIn: Math.ceil((entry.resetAt - now) / 1000) };
}
function recordAttempt(key: string) {
  const entry = attempts.get(key);
  if (entry) entry.count += 1;
}
function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rateKey = `${clientIp(req)}:${username}`;

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
    }

    const { blocked, retryIn } = loginBlocked(rateKey);
    if (blocked) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${retryIn} detik.` },
        { status: 429 }
      );
    }

    const user = await db.adminUser.findUnique({ where: { username } });

    // Jeda kecil untuk memperlambat brute force
    if (!user || !verifyPassword(password, user.passwordHash)) {
      recordAttempt(rateKey);
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    attempts.delete(rateKey);
    const token = await signSession({
      sub: user.id,
      username: user.username,
      name: user.name,
      role: user.role || "SUPERADMIN",
    });
    const res = NextResponse.json({
      ok: true,
      user: { username: user.username, name: user.name, role: user.role || "SUPERADMIN" },
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {});
    await logActivity(user.username, "LOGIN", "Masuk ke panel admin");
    return res;
  } catch (e) {
    console.error("POST /api/auth/login error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}

// force rebuild: prisma client freshness
