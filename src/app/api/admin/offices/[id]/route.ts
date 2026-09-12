import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, toInt, logActivity } from "@/lib/admin-guard";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  const { id } = await ctx.params;

  try {
    const body = await req.json();
    const type = body.type === "HEAD" ? "HEAD" : "BRANCH";
    const label = cleanStr(body.label, 80);
    const address = cleanStr(body.address, 300);
    if (!label || !address) {
      return NextResponse.json({ error: "Label dan alamat wajib diisi." }, { status: 400 });
    }
    const updated = await db.office.update({
      where: { id },
      data: { type, label, address, order: toInt(body.order, 0) },
    });
    await logActivity(session.username, "UPDATE", `Mengubah kantor “${label}”`);
    return NextResponse.json({ office: updated });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui kantor." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  const { id } = await ctx.params;

  try {
    const office = await db.office.delete({ where: { id } });
    await logActivity(session.username, "DELETE", `Menghapus kantor “${office.label}”`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kantor tidak ditemukan." }, { status: 404 });
  }
}
