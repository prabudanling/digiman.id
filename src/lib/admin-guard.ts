import { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE, type SessionPayload } from "@/lib/auth";

/** Guard tambahan di level route handler (defense-in-depth di balik middleware). */
export async function requireAdmin(req: NextRequest): Promise<SessionPayload | null> {
  return verifySession(req.cookies.get(SESSION_COOKIE)?.value);
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
