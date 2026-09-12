import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const [team, services, testimonials, faqs, offices] = await Promise.all([
    db.teamMember.count(),
    db.service.count(),
    db.testimonial.count(),
    db.faq.count(),
    db.office.count(),
  ]);

  const settings = await db.siteSetting.findUnique({ where: { id: 1 } });

  // Skor kelengkapan situs (site health) — checklist ala WordPress Site Health
  const checks = [
    { label: "Logo kustom terpasang", ok: Boolean(settings?.logoUrl) },
    { label: "Kontak lengkap (WA & email)", ok: Boolean(settings?.waNumber && settings?.email) },
    { label: "Struktur direksi terisi", ok: team >= 2 },
    { label: "Head office & cabang terisi", ok: offices >= 2 },
    { label: "Layanan minimal 10 kartu", ok: services >= 10 },
    { label: "Testimoni minimal 5 klien", ok: testimonials >= 5 },
    { label: "FAQ minimal 6 pertanyaan", ok: faqs >= 6 },
    { label: "Hero beranda tersedia", ok: Boolean(settings?.heroHeadline) },
    { label: "SEO metadata terisi", ok: Boolean(settings?.metaTitle && settings?.metaDescription) },
  ];
  const done = checks.filter((c) => c.ok).length;

  return NextResponse.json({
    stats: { team, services, testimonials, faqs },
    health: {
      score: Math.round((done / checks.length) * 100),
      done,
      total: checks.length,
      checks,
    },
    settings: settings
      ? { waDisplay: settings.waDisplay, email: settings.email, hasLogo: Boolean(settings.logoUrl), updatedAt: settings.updatedAt }
      : null,
  });
}

// force rebuild: prisma client freshness
