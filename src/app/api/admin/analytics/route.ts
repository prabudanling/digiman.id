import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

/**
 * GET /api/admin/analytics — ringkasan kunjungan & aktivitas untuk dashboard.
 * Query: ?days=14 (default) | 30
 */
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const url = new URL(req.url);
  const days = Math.min(90, Math.max(7, Number(url.searchParams.get("days")) || 14));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [views, total30, mobile30, topPaths, referrers, unread, mediaCount, userCount] =
    await Promise.all([
      // Deret harian
      db.pageView.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, device: true },
      }),
      db.pageView.count({ where: { createdAt: { gte: since30 } } }),
      db.pageView.count({ where: { createdAt: { gte: since30 }, device: "mobile" } }),
      db.pageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: since30 } },
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 5,
      }),
      db.pageView.groupBy({
        by: ["referrer"],
        where: { createdAt: { gte: since30 }, referrer: { not: "" } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 5,
      }),
      db.contactMessage.count({ where: { status: "NEW" } }),
      db.mediaAsset.count(),
      db.adminUser.count(),
    ]);

  // Agregasi harian manual (SQLite + groupBy tanggal memerlukan raw; cukup di memori)
  const byDay = new Map<string, { count: number; mobile: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    byDay.set(d.toISOString().slice(0, 10), { count: 0, mobile: 0 });
  }
  for (const v of views) {
    const key = v.createdAt.toISOString().slice(0, 10);
    const slot = byDay.get(key);
    if (slot) {
      slot.count += 1;
      if (v.device === "mobile") slot.mobile += 1;
    }
  }
  const daily = Array.from(byDay.entries()).map(([day, v]) => ({ day, ...v }));

  const host = (r: string) => {
    try {
      return new URL(r).host;
    } catch {
      return r.slice(0, 40) || "(langsung)";
    }
  };

  return NextResponse.json({
    daily,
    totals: {
      days,
      views: views.length,
      views30: total30,
      mobileShare: total30 > 0 ? Math.round((mobile30 / total30) * 100) : 0,
      unread,
      mediaCount,
      userCount,
    },
    topPaths: topPaths.map((p) => ({ path: p.path, count: p._count.path })),
    topReferrers: referrers.map((r) => ({ source: r.referrer ? host(r.referrer) : "(langsung)", count: r._count.referrer })),
  });
}
