import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWrite } from "@/lib/admin-guard";

/** DELETE /api/admin/media/[id] — hapus aset media */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "media");
  if (session instanceof NextResponse) return session;

  const { id } = await ctx.params;
  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Media tidak ditemukan." }, { status: 404 });

  await db.mediaAsset.delete({ where: { id } });
  await db.activityLog.create({
    data: { username: session.username, action: "DELETE", detail: `Hapus media "${asset.name}"` },
  }).catch(() => {});
  return NextResponse.json({ ok: true });
}
