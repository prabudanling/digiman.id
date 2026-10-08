import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE, type SessionPayload } from "@/lib/auth";
import { db } from "@/lib/db";

/** Guard tambahan di level route handler (defense-in-depth di balik middleware).
 * Selalu cek DB: akun yang sudah dihapus langsung kehilangan akses (revoke instan),
 * dan peran yang dibaca selalu FRESH dari database (perubahan role langsung berlaku). */
export async function requireAdmin(req: NextRequest): Promise<SessionPayload | null> {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  try {
    const user = await db.adminUser.findUnique({
      where: { id: session.sub },
      select: { username: true, name: true, role: true },
    });
    if (!user) return null; // akun dihapus → token mati
    return { sub: session.sub, username: user.username, name: user.name, role: user.role };
  } catch {
    return null;
  }
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

/**
 * === Kontrol akses berbasis peran (RBAC) ===
 * SUPERADMIN : akses penuh (pengaturan, pengguna, backup, tampilan, SEO, konten)
 * EDITOR     : kelola konten (hero, struktur, layanan, testimoni, faq, kantor, media, pesan)
 * VIEWER     : hanya lihat (semua request penulisan ditolak)
 */
export const ROLES = ["SUPERADMIN", "EDITOR", "VIEWER"] as const;
export type Role = (typeof ROLES)[number];

const WRITE_CAPS: Record<Role, string[]> = {
  SUPERADMIN: ["*"],
  EDITOR: [
    "hero", "team", "services", "testimonials", "faqs", "offices",
    "media", "messages",
  ],
  VIEWER: [],
};

export function canWrite(session: SessionPayload | null, capability: string): boolean {
  if (!session) return false;
  const role = (session.role as Role) in WRITE_CAPS ? (session.role as Role) : "VIEWER";
  const caps = WRITE_CAPS[role];
  return caps.includes("*") || caps.includes(capability);
}

/** Guard untuk route yang menulis data: balik null jika diizinkan, atau NextResponse 401/403. */
export async function requireWrite(
  req: NextRequest,
  capability: string
): Promise<SessionPayload | null | NextResponse> {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }
  if (!canWrite(session, capability)) {
    return NextResponse.json(
      { error: "Peran Anda (" + session.role + ") tidak memiliki izin untuk aksi ini." },
      { status: 403 }
    );
  }
  return session;
}
