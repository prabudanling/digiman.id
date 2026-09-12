import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/admin-guard";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const { id } = await params;
  try {
    const f = await db.faq.delete({ where: { id } });
    await logActivity(session.username, "DELETE", `Menghapus FAQ “${f.question.slice(0, 60)}”`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "FAQ tidak ditemukan." }, { status: 404 });
  }
}
