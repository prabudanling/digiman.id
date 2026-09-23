import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireWrite, cleanStr, isValidDataUrl } from "@/lib/admin-guard";

/**
 * Backup & Restore ala WordPress Tools > Export/Import — tapi satu file JSON
 * berisi SELURUH konten situs (pengaturan, struktur, layanan, testimoni, faq,
 * kantor, section, media). Tidak menyertakan akun admin & log keamanan.
 */

const TABLES = [
  "siteSetting", "teamMember", "service", "testimonial", "faq",
  "office", "sectionConfig", "mediaAsset",
] as const;

/** GET /api/admin/backup — unduh berkas backup JSON */
export async function GET(req: NextRequest) {
  const session = await requireWrite(req, "backup");
  if (session instanceof NextResponse) return session;

  const [settings, team, services, testimonials, faqs, offices, sections, media] =
    await Promise.all([
      db.siteSetting.findUnique({ where: { id: 1 } }),
      db.teamMember.findMany(),
      db.service.findMany(),
      db.testimonial.findMany(),
      db.faq.findMany(),
      db.office.findMany(),
      db.sectionConfig.findMany(),
      db.mediaAsset.findMany(),
    ]);

  const payload = {
    _format: "digiman-backup",
    _version: 2,
    _exportedAt: new Date().toISOString(),
    data: { settings, team, services, testimonials, faqs, offices, sections, media },
  };

  await db.activityLog.create({
    data: { username: session.username, action: "EXPORT", detail: "Mengunduh berkas backup konten situs" },
  }).catch(() => {});

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="digiman-backup-${stamp}.json"`,
    },
  });
}

/** POST /api/admin/backup — pulihkan dari berkas JSON (mode ganti semua) */
export async function POST(req: NextRequest) {
  const session = await requireWrite(req, "backup");
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    if (body.confirm !== "PULIHKAN") {
      return NextResponse.json(
        { error: 'Konfirmasi salah. Ketik "PULIHKAN" untuk melanjutkan.' },
        { status: 400 }
      );
    }
    const data = body.data;
    if (!data || data._format !== "digiman-backup") {
      return NextResponse.json({ error: "Berkas bukan backup DIGIMAN yang valid." }, { status: 400 });
    }

    const d = data.data ?? {};
    let restored = 0;

    // 1) Pengaturan (baris tunggal)
    if (d.settings && typeof d.settings === "object") {
      const s = d.settings;
      const safe = {
        companyName: cleanStr(s.companyName, 120) || "PT Digital Bisnis Manajemen",
        waNumber: (cleanStr(s.waNumber, 20).replace(/[^0-9]/g, "") || "6281333397223"),
        waDisplay: cleanStr(s.waDisplay, 30) || "+62 813-3339-7223",
        email: cleanStr(s.email, 120) || "halo@digiman.id",
        addressShort: cleanStr(s.addressShort, 160),
        addressFull: cleanStr(s.addressFull, 300),
        logoUrl: isValidDataUrl(s.logoUrl, 2_600_000) ? s.logoUrl : null,
        statClients: Number(s.statClients) || 2500,
        statExperts: Number(s.statExperts) || 46,
        statLayers: Number(s.statLayers) || 7,
        statSuccess: Number(s.statSuccess) || 98,
        heroHeadline: cleanStr(s.heroHeadline, 300),
        heroSub: cleanStr(s.heroSub, 800),
        heroWords: cleanStr(s.heroWords, 1200) || '["Pendirian PT"]',
        metaTitle: cleanStr(s.metaTitle, 200),
        metaDescription: cleanStr(s.metaDescription, 400),
        metaKeywords: cleanStr(s.metaKeywords, 300),
        ogImage: isValidDataUrl(s.ogImage, 2_600_000) ? s.ogImage : null,
        googleSiteVerification: cleanStr(s.googleSiteVerification, 200),
        headScripts: typeof s.headScripts === "string" ? s.headScripts.slice(0, 8000) : "",
        contactFormEnabled: s.contactFormEnabled !== false,
        hours: cleanStr(s.hours, 120),
        instagram: cleanStr(s.instagram, 300),
        linkedin: cleanStr(s.linkedin, 300),
        tiktok: cleanStr(s.tiktok, 300),
        facebook: cleanStr(s.facebook, 300),
        youtube: cleanStr(s.youtube, 300),
      };
      await db.siteSetting.upsert({ where: { id: 1 }, update: safe, create: { id: 1, ...safe } });
      restored += 1;
    }

    // 2) Tabel konten: kosongkan lalu isi ulang by id (urutan & relasi tetap utuh)
    type RestoreDef = { model: keyof typeof db; rows: unknown[] };
    const restores: RestoreDef[] = [
      { model: "teamMember", rows: Array.isArray(d.team) ? d.team : [] },
      { model: "service", rows: Array.isArray(d.services) ? d.services : [] },
      { model: "testimonial", rows: Array.isArray(d.testimonials) ? d.testimonials : [] },
      { model: "faq", rows: Array.isArray(d.faqs) ? d.faqs : [] },
      { model: "office", rows: Array.isArray(d.offices) ? d.offices : [] },
      { model: "sectionConfig", rows: Array.isArray(d.sections) ? d.sections : [] },
      { model: "mediaAsset", rows: Array.isArray(d.media) ? d.media : [] },
    ];

    for (const { model, rows } of restores) {
      const client = db[model] as unknown as {
        deleteMany: () => Promise<unknown>;
        createMany: (args: { data: unknown[] }) => Promise<{ count: number }>;
      };
      await client.deleteMany();
      if (rows.length > 0) {
        // buang field relasional yang tidak ada di SQLite & id boleh dipertahankan
        const clean = rows.map((r) => {
          const row = { ...(r as Record<string, unknown>) };
          for (const k of ["updatedAt", "createdAt"]) {
            if (typeof row[k] === "string") {
              const t = new Date(row[k] as string);
              row[k] = Number.isNaN(t.getTime()) ? new Date() : t;
            }
          }
          return row;
        });
        try {
          const res = await client.createMany({ data: clean });
          restored += res.count;
        } catch {
          // fallback satu-per-satu bila createMany gagal (mis. data lama bermasalah)
          for (const row of clean) {
            try {
              await (db[model] as unknown as { create: (a: { data: unknown }) => Promise<unknown> }).create({ data: row });
              restored += 1;
            } catch {
              /* lewati baris rusak */
            }
          }
        }
      }
    }

    await db.activityLog.create({
      data: { username: session.username, action: "IMPORT", detail: `Memulihkan backup — ${restored} baris dipulihkan` },
    }).catch(() => {});

    return NextResponse.json({ ok: true, restored });
  } catch (e) {
    console.error("POST /api/admin/backup error:", e);
    return NextResponse.json({ error: "Gagal memulihkan backup." }, { status: 500 });
  }
}
