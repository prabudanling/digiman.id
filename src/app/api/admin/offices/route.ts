import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, toInt, logActivity } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const offices = await db.office.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ offices });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const type = body.type === "HEAD" ? "HEAD" : "BRANCH";
    const label = cleanStr(body.label, 80);
    const address = cleanStr(body.address, 300);
    if (!label || !address) {
      return NextResponse.json({ error: "Label dan alamat wajib diisi." }, { status: 400 });
    }

    const payload = {
      type, label, address,
      order: toInt(body.order, 0),
    };

    if (body.id) {
      const updated = await db.office.update({ where: { id: String(body.id) }, data: payload });
      await logActivity(session.username, "UPDATE", `Mengubah kantor “${label}”`);
      return NextResponse.json({ office: updated });
    }

    const last = await db.office.findFirst({ orderBy: { order: "desc" } });
    const created = await db.office.create({ data: { ...payload, order: (last?.order ?? -1) + 1 } });
    await logActivity(session.username, "CREATE", `Menambah kantor “${label}”`);
    return NextResponse.json({ office: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/offices error:", e);
    return NextResponse.json({ error: "Gagal menyimpan kantor." }, { status: 500 });
  }
}
