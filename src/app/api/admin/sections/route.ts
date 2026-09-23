import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireWrite } from "@/lib/admin-guard";

/** Definisi section beranda yang bisa dikelola (urutan default dari atas ke bawah) */
export const SECTION_DEFS: { key: string; label: string; desc: string }[] = [
  { key: "hero", label: "Hero / Beranda", desc: "Judul utama, subjudul, kata berputar" },
  { key: "marquee", label: "Marquee Layanan", desc: "Pita berjalan nama layanan" },
  { key: "stats", label: "Statistik", desc: "4 angka pencapaian perusahaan" },
  { key: "seven-heavens", label: "7 Lapis Langit", desc: "Perjalanan layanan unggulan" },
  { key: "services", label: "Layanan", desc: "Katalog 29 layanan + tab kategori" },
  { key: "why-us", label: "Mengapa Kami", desc: "Keunggulan dibanding kompetitor" },
  { key: "team", label: "Struktur Perusahaan", desc: "Direksi & komisaris" },
  { key: "offices", label: "Kantor & Cabang", desc: "4 lokasi kantor" },
  { key: "process", label: "Proses Kerja", desc: "Timeline langkah kerja" },
  { key: "testimonials", label: "Testimoni", desc: "Marquee 2 baris ulasan klien" },
  { key: "faq", label: "FAQ", desc: "Pertanyaan yang sering diajukan" },
  { key: "cta", label: "Ajakan Konsultasi", desc: "CTA besar + tombol WA" },
  { key: "contact-form", label: "Formulir Konsultasi", desc: "Form leads masuk ke kotak pesan admin" },
];

/** GET /api/admin/sections — konfigurasi tampilan beranda */
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const saved = await db.sectionConfig.findMany({ orderBy: { order: "asc" } });
  const byKey = new Map(saved.map((s) => [s.key, s]));

  // Gabungkan definisi default dengan yang tersimpan (section baru otomatis muncul)
  const sections = SECTION_DEFS.map((def, idx) => {
    const s = byKey.get(def.key);
    return {
      key: def.key,
      label: s?.label ?? def.label,
      desc: def.desc,
      enabled: s?.enabled ?? true,
      order: s?.order ?? idx,
      saved: Boolean(s),
    };
  }).sort((a, b) => a.order - b.order);

  return NextResponse.json({ sections });
}

/** PUT /api/admin/sections — simpan urutan + visibilitas sekaligus */
export async function PUT(req: NextRequest) {
  const session = await requireWrite(req, "sections");
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const list = Array.isArray(body.sections) ? body.sections : [];
    if (list.length === 0) {
      return NextResponse.json({ error: "Data section kosong." }, { status: 400 });
    }

    const validKeys = new Set(SECTION_DEFS.map((d) => d.key));
    for (const item of list) {
      if (!validKeys.has(item.key)) continue;
      await db.sectionConfig.upsert({
        where: { key: item.key },
        update: { enabled: Boolean(item.enabled), order: Number(item.order) || 0 },
        create: {
          key: item.key,
          label: cleanLabel(item.key),
          enabled: Boolean(item.enabled),
          order: Number(item.order) || 0,
        },
      });
    }

    await db.activityLog.create({
      data: { username: session.username, action: "UPDATE", detail: "Mengubah tampilan beranda (urutan/visibilitas section)" },
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/sections error:", e);
    return NextResponse.json({ error: "Gagal menyimpan konfigurasi." }, { status: 500 });
  }
}

function cleanLabel(key: string): string {
  return SECTION_DEFS.find((d) => d.key === key)?.label ?? key;
}
