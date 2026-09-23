import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity, requireAdmin, requireWrite } from "@/lib/admin-guard";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "services");
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  try {
    const service = await db.service.delete({ where: { id } });
    await logActivity(session.username, "DELETE", `Menghapus layanan “${service.title}”`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Layanan tidak ditemukan." }, { status: 404 });
  }
}
