import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

/** Feed aktivitas (audit trail) — ?limit=10 untuk widget dashboard, ?limit=200&filter=LOGIN untuk halaman audit penuh */
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit")) || 10));
  const filter = url.searchParams.get("filter") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  const where: {
    action?: string;
    OR?: { detail?: { contains: string }; username?: { contains: string } }[];
  } = {};
  if (filter) where.action = filter;
  if (q) {
    where.OR = [{ detail: { contains: q } }, { username: { contains: q } }];
  }

  const [logs, todayStart] = [
    await db.activityLog.findMany({ where, orderBy: { createdAt: "desc" }, take: limit }),
    new Date(new Date().setHours(0, 0, 0, 0)),
  ];
  const todayCount = await db.activityLog.count({ where: { createdAt: { gte: todayStart } } });

  return NextResponse.json({ logs, todayCount });
}

// force rebuild: prisma client freshness
