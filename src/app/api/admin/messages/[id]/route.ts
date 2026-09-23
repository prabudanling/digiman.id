import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWrite } from "@/lib/admin-guard";

/** PATCH /api/admin/messages/[id] — ubah status / bintang */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "messages");
  if (session instanceof NextResponse) return session;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const data: { status?: string; starred?: boolean } = {};
  if (body.status === "NEW" || body.status === "READ" || body.status === "ARCHIVED") {
    data.status = body.status;
  }
  if (typeof body.starred === "boolean") data.starred = body.starred;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan." }, { status: 400 });
  }

  const updated = await db.contactMessage.update({ where: { id }, data }).catch(() => null);
  if (!updated) return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true, message: updated });
}

/** DELETE /api/admin/messages/[id] */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "messages");
  if (session instanceof NextResponse) return session;

  const { id } = await ctx.params;
  await db.contactMessage.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
