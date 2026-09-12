import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, isValidDataUrl, logActivity } from "@/lib/admin-guard";

const MAX_PHOTO_LEN = 2_100_000;

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const members = await db.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const name = cleanStr(body.name, 80);
    const role = cleanStr(body.role, 80);
    const division = cleanStr(body.division, 80) || null;
    const photo = typeof body.photo === "string" ? body.photo : null;

    if (!name || !role) {
      return NextResponse.json({ error: "Nama dan jabatan wajib diisi." }, { status: 400 });
    }
    if (photo && !isValidDataUrl(photo, MAX_PHOTO_LEN)) {
      return NextResponse.json({ error: "Foto tidak valid atau terlalu besar (maks ~1.5MB)." }, { status: 400 });
    }

    if (body.id) {
      const updated = await db.teamMember.update({
        where: { id: String(body.id) },
        data: { name, role, division, ...(photo !== null ? { photo } : {}) },
      });
      await logActivity(session.username, "UPDATE", `Mengubah anggota struktur “${name}”`);
      return NextResponse.json({ member: updated });
    }

    const last = await db.teamMember.findFirst({ orderBy: { order: "desc" } });
    const created = await db.teamMember.create({
      data: { name, role, division, photo, order: (last?.order ?? -1) + 1 },
    });
    await logActivity(session.username, "CREATE", `Menambah anggota struktur “${name}” — ${role}${photo ? " (dengan foto)" : ""}`);
    return NextResponse.json({ member: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/team error:", e);
    return NextResponse.json({ error: "Gagal menyimpan data." }, { status: 500 });
  }
}
