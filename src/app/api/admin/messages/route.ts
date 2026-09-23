import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWrite } from "@/lib/admin-guard";

/** GET /api/admin/messages — kotak masuk leads */
export async function GET(req: NextRequest) {
  const session = await requireWrite(req, "messages");
  if (session instanceof NextResponse) return session;

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") ?? "all";

  const where =
    filter === "new"
      ? { status: "NEW" }
      : filter === "archived"
        ? { status: "ARCHIVED" }
        : filter === "starred"
          ? { starred: true, status: { not: "ARCHIVED" } }
          : { status: { not: "ARCHIVED" } };

  const [messages, counts] = await Promise.all([
    db.contactMessage.findMany({ where, orderBy: [{ starred: "desc" }, { createdAt: "desc" }], take: 200 }),
    Promise.all([
      db.contactMessage.count({ where: { status: "NEW" } }),
      db.contactMessage.count({ where: { status: { not: "ARCHIVED" } } }),
      db.contactMessage.count({ where: { starred: true, status: { not: "ARCHIVED" } } }),
      db.contactMessage.count({ where: { status: "ARCHIVED" } }),
    ]),
  ]);

  return NextResponse.json({
    messages,
    counts: { new: counts[0], inbox: counts[1], starred: counts[2], archived: counts[3] },
  });
}
