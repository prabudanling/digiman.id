import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Rate limit in-memory: maks 5 pesan / 10 menit per IP */
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  e.count += 1;
  return e.count > 5;
}
function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

/** Endpoint publik: kirim pesan konsultasi dari formulir beranda → kotak masuk admin */
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json(
        { error: "Terlalu banyak pesan terkirim. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const phone = typeof body.phone === "string" ? body.phone.replace(/[^0-9+\- ]/g, "").trim().slice(0, 25) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";
    const service = typeof body.service === "string" ? body.service.trim().slice(0, 120) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Nama wajib diisi (minimal 2 karakter)." }, { status: 400 });
    }
    const digits = phone.replace(/[^0-9]/g, "");
    if (digits.length < 8 || digits.length > 15) {
      return NextResponse.json({ error: "Nomor WhatsApp tidak valid (8–15 digit)." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }
    if (message.length < 5) {
      return NextResponse.json({ error: "Pesan wajib diisi (minimal 5 karakter)." }, { status: 400 });
    }

    const created = await db.contactMessage.create({
      data: { name, phone, email, service, message },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    console.error("POST /api/contact error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
