import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity, requireAdmin, requireWrite, toInt } from "@/lib/admin-guard";

/** Pindahkan urutan anggota (naik/turun) atau hapus. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "team");
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  try {
    const body = await req.json();
    if (typeof body.direction === "string") {
      const members = await db.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
      const idx = members.findIndex((m) => m.id === id);
      const swapWith = body.direction === "up" ? idx - 1 : idx + 1;
      if (idx < 0 || swapWith < 0 || swapWith >= members.length) {
        return NextResponse.json({ ok: true }); // sudah di ujung
      }
      const a = members[idx];
      const b = members[swapWith];
      await db.$transaction([
        db.teamMember.update({ where: { id: a.id }, data: { order: b.order } }),
        db.teamMember.update({ where: { id: b.id }, data: { order: a.order } }),
      ]);
      await logActivity(session.username, "UPDATE", `Menggeser urutan anggota “${a.name}” ${body.direction === "up" ? "ke atas" : "ke bawah"}`);
      return NextResponse.json({ ok: true });
    }

    if (body.order !== undefined) {
      await db.teamMember.update({ where: { id }, data: { order: toInt(body.order, 0) } });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Tidak ada perubahan." }, { status: 400 });
  } catch (e) {
    console.error("PUT /api/admin/team/[id] error:", e);
    return NextResponse.json({ error: "Gagal memperbarui urutan." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireWrite(req, "team");
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  try {
    const member = await db.teamMember.delete({ where: { id } });
    await logActivity(session.username, "DELETE", `Menghapus anggota struktur “${member.name}”`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Anggota tidak ditemukan." }, { status: 404 });
  }
}
