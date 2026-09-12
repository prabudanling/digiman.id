import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, logActivity } from "@/lib/admin-guard";

/** Editor Hero (beranda) — endpoint terpisah agar update parsial tidak mengganggu pengaturan lain. */

const MAX_WORDS = 12;

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  let settings = await db.siteSetting.findUnique({ where: { id: 1 } });
  if (!settings) settings = await db.siteSetting.create({ data: { id: 1 } });

  let words: string[] = [];
  try {
    const parsed = JSON.parse(settings.heroWords);
    if (Array.isArray(parsed)) words = parsed.map((w) => String(w)).slice(0, MAX_WORDS);
  } catch {
    words = [];
  }

  return NextResponse.json({
    hero: {
      heroHeadline: settings.heroHeadline,
      heroSub: settings.heroSub,
      words,
    },
  });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const headline = cleanStr(body.heroHeadline, 160);
    const sub = cleanStr(body.heroSub, 600);

    const words: string[] = Array.isArray(body.heroWords)
      ? body.heroWords
          .map((w: unknown) => String(w).trim().slice(0, 40))
          .filter(Boolean)
          .slice(0, MAX_WORDS)
      : [];

    if (!headline) {
      return NextResponse.json({ error: "Judul hero wajib diisi." }, { status: 400 });
    }
    if (words.length < 2) {
      return NextResponse.json(
        { error: "Minimal 2 kata berputar agar animasi berjalan." },
        { status: 400 }
      );
    }

    await db.siteSetting.upsert({
      where: { id: 1 },
      update: { heroHeadline: headline, heroSub: sub, heroWords: JSON.stringify(words) },
      create: { id: 1, heroHeadline: headline, heroSub: sub, heroWords: JSON.stringify(words) },
    });

    await logActivity(session.username, "UPDATE", "Memperbarui tampilan Beranda (judul hero & kata berputar)");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/hero error:", e);
    return NextResponse.json({ error: "Gagal menyimpan hero." }, { status: 500 });
  }
}
