import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, logActivity } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  const faqs = await db.faq.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const question = cleanStr(body.question, 300);
    const answer = cleanStr(body.answer, 2000);

    if (!question || !answer) {
      return NextResponse.json({ error: "Pertanyaan dan jawaban wajib diisi." }, { status: 400 });
    }

    const payload = {
      question, answer,
      visible: body.visible === undefined ? true : Boolean(body.visible),
    };

    if (body.id) {
      const updated = await db.faq.update({ where: { id: String(body.id) }, data: payload });
      await logActivity(session.username, "UPDATE", `Mengubah FAQ “${question.slice(0, 60)}”`);
      return NextResponse.json({ faq: updated });
    }

    const last = await db.faq.findFirst({ orderBy: { order: "desc" } });
    const created = await db.faq.create({ data: { ...payload, order: (last?.order ?? -1) + 1 } });
    await logActivity(session.username, "CREATE", `Menambah FAQ “${question.slice(0, 60)}”`);
    return NextResponse.json({ faq: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/faqs error:", e);
    return NextResponse.json({ error: "Gagal menyimpan FAQ." }, { status: 500 });
  }
}
