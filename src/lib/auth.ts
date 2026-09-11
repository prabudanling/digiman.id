/**
 * Autentikasi lengkap untuk lingkungan Node.js (route handler & server component).
 * - Password: scrypt (node:crypto) format "salt:hash"
 * - Session: JWT HS256 via jose, cookie httpOnly
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Re-export fungsi edge-safe dari auth-edge
export {
  signSession,
  verifySession,
  sessionCookieOptions,
  SESSION_COOKIE,
  type SessionPayload,
} from "./auth-edge";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64);
    const original = Buffer.from(hash, "hex");
    if (candidate.length !== original.length) return false;
    return timingSafeEqual(candidate, original);
  } catch {
    return false;
  }
}
