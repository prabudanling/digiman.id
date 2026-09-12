import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

/** Feed aktivitas terbaru (audit trail) untuk widget dashboard. */
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = await db.activityLog.count({ where: { createdAt: { gte: todayStart } } });

  return NextResponse.json({ logs, todayCount });
}

// force rebuild: prisma client freshness
