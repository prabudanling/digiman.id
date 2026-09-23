import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Rate limit ringan: maks 30 track / menit per IP */
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  e.count += 1;
  return e.count > 30;
}
function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

/** Endpoint publik: pencatatan kunjungan halaman (pageview) tanpa cookie pihak ketiga */
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = await req.json().catch(() => ({}));
    let path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    if (!path.startsWith("/") || path.startsWith("//")) path = "/";
    // Jangan catat halaman internal admin
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 300) : "";
    const device = body.device === "mobile" ? "mobile" : "desktop";

    await db.pageView.create({ data: { path, referrer, device } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/track error:", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
