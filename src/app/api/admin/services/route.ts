import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, toInt, logActivity } from "@/lib/admin-guard";

/** Ikon lucide yang diizinkan untuk kartu layanan */
export const ALLOWED_ICONS = [
  "Building2", "Users", "Globe2", "Stamp", "Lightbulb", "Rocket",
  "FileCheck2", "ScrollText", "BadgeCheck", "Landmark", "Briefcase",
  "ShieldCheck", "Scale", "HeartHandshake", "Cpu", "BarChart3",
];

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const services = await db.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const title = cleanStr(body.title, 80);
    const desc = cleanStr(body.desc, 400);
    const price = cleanStr(body.price, 60) || "Konsultasi custom";
    const icon = ALLOWED_ICONS.includes(body.icon) ? body.icon : "Building2";
    const featured = Boolean(body.featured);

    const features: string[] = Array.isArray(body.features)
      ? body.features.map((f: unknown) => String(f).trim().slice(0, 120)).filter(Boolean).slice(0, 8)
      : [];
    if (!title || !desc || features.length === 0) {
      return NextResponse.json({ error: "Judul, deskripsi, dan minimal 1 fitur wajib diisi." }, { status: 400 });
    }

    const payload = {
      title, desc, price, icon, featured,
      features: JSON.stringify(features),
      order: toInt(body.order, 0),
      visible: body.visible === undefined ? true : Boolean(body.visible),
    };

    if (body.id) {
      const updated = await db.service.update({ where: { id: String(body.id) }, data: payload });
      await logActivity(session.username, "UPDATE", `Mengubah layanan “${title}”`);
      return NextResponse.json({ service: updated });
    }

    const last = await db.service.findFirst({ orderBy: { order: "desc" } });
    const created = await db.service.create({ data: { ...payload, order: (last?.order ?? -1) + 1 } });
    await logActivity(session.username, "CREATE", `Menambah layanan “${title}”`);
    return NextResponse.json({ service: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/services error:", e);
    return NextResponse.json({ error: "Gagal menyimpan layanan." }, { status: 500 });
  }
}
