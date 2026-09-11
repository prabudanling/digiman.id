import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, toInt } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const testimonials = await db.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const name = cleanStr(body.name, 80);
    const role = cleanStr(body.role, 120);
    const text = cleanStr(body.text, 600);

    if (!name || !role || !text) {
      return NextResponse.json({ error: "Nama, peran, dan isi testimoni wajib diisi." }, { status: 400 });
    }

    const payload = {
      name, role, text,
      rating: Math.min(5, Math.max(1, toInt(body.rating, 5))),
      visible: body.visible === undefined ? true : Boolean(body.visible),
    };

    if (body.id) {
      const updated = await db.testimonial.update({ where: { id: String(body.id) }, data: payload });
      return NextResponse.json({ testimonial: updated });
    }

    const last = await db.testimonial.findFirst({ orderBy: { order: "desc" } });
    const created = await db.testimonial.create({ data: { ...payload, order: (last?.order ?? -1) + 1 } });
    return NextResponse.json({ testimonial: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/testimonials error:", e);
    return NextResponse.json({ error: "Gagal menyimpan testimoni." }, { status: 500 });
  }
}
