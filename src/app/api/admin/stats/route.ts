import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const [team, services, testimonials, faqs] = await Promise.all([
    db.teamMember.count(),
    db.service.count(),
    db.testimonial.count(),
    db.faq.count(),
  ]);

  const settings = await db.siteSetting.findUnique({ where: { id: 1 } });

  return NextResponse.json({
    stats: { team, services, testimonials, faqs },
    settings: settings
      ? { waDisplay: settings.waDisplay, email: settings.email, hasLogo: Boolean(settings.logoUrl), updatedAt: settings.updatedAt }
      : null,
  });
}
