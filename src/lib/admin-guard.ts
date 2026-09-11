import { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE, type SessionPayload } from "@/lib/auth";
import { db } from "@/lib/db";

/** Guard tambahan di level route handler (defense-in-depth di balik middleware). */
export async function requireAdmin(req: NextRequest): Promise<SessionPayload | null> {
  return verifySession(req.cookies.get(SESSION_COOKIE)?.value);
}

/** Catat aktivitas admin ke audit trail (ala WordPress action log). Gagal logging tidak boleh menggagalkan request. */
export async function logActivity(username: string, action: string, detail: string): Promise<void> {
  try {
    await db.activityLog.create({
      data: { username, action, detail: detail.slice(0, 300) },
    });
    // jaga tabel tetap ramping: simpan maksimal 500 entri terbaru
    const count = await db.activityLog.count();
    if (count > 500) {
      const olds = await db.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: 500,
        take: count - 500,
        select: { id: true },
      });
      if (olds.length > 0) {
        await db.activityLog.deleteMany({ where: { id: { in: olds.map((o) => o.id) } } });
      }
    }
  } catch (e) {
    console.error("logActivity gagal (diabaikan):", e);
  }
}

export function cleanStr(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function isValidDataUrl(v: unknown, maxLen = 2_100_000): boolean {
  return typeof v === "string" && v.startsWith("data:image/") && v.length <= maxLen;
}

export function toInt(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isFinite(n) ? n : fallback;
}
