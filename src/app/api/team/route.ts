import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Batas ukuran foto base64 (~1.5 MB setelah kompresi klien)
const MAX_PHOTO_LEN = 2_100_000;

function clean(v: unknown, max = 120): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function GET() {
  try {
    const count = await db.teamMember.count();
    if (count === 0) {
      // Seed dari Akta Pendirian resmi: PT Perorangan — pemilik tunggal
      await db.teamMember.create({
        data: {
          name: "Gugun Gunara",
          role: "Pendiri & Direktur Utama",
          division: "Pemegang Saham Tunggal",
          order: 0,
        },
      });
    }
    const members = await db.teamMember.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ members });
  } catch (e) {
    console.error("GET /api/team error:", e);
    return NextResponse.json({ error: "Gagal memuat struktur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = clean(body.name, 80);
    const role = clean(body.role, 80);
    const division = clean(body.division, 80) || null;
    const photo = typeof body.photo === "string" ? body.photo : null;

    if (!name || !role) {
      return NextResponse.json({ error: "Nama dan jabatan wajib diisi." }, { status: 400 });
    }
    if (photo && (photo.length > MAX_PHOTO_LEN || !photo.startsWith("data:image/"))) {
      return NextResponse.json({ error: "Foto tidak valid atau terlalu besar (maks ~1.5MB)." }, { status: 400 });
    }

    const last = await db.teamMember.findFirst({ orderBy: { order: "desc" } });
    const nextOrder = (last?.order ?? -1) + 1;

    if (body.id) {
      const updated = await db.teamMember.update({
        where: { id: String(body.id) },
        data: { name, role, division, ...(photo !== null ? { photo } : {}) },
      });
      return NextResponse.json({ member: updated });
    }

    const created = await db.teamMember.create({
      data: { name, role, division, photo, order: nextOrder },
    });
    return NextResponse.json({ member: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/team error:", e);
    return NextResponse.json({ error: "Gagal menyimpan data." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Parameter id wajib." }, { status: 400 });
    }
    await db.teamMember.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/team error:", e);
    return NextResponse.json({ error: "Gagal menghapus data." }, { status: 500 });
  }
}
