import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, cleanStr, isValidDataUrl, toInt } from "@/lib/admin-guard";

const MAX_LOGO_LEN = 2_600_000; // ~2 MB setelah kompresi klien

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  let settings = await db.siteSetting.findUnique({ where: { id: 1 } });
  if (!settings) settings = await db.siteSetting.create({ data: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

  try {
    const body = await req.json();
    const waNumber = cleanStr(body.waNumber, 20).replace(/[^0-9]/g, "");
    const email = cleanStr(body.email, 120);
    const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl : null;

    if (waNumber && !/^[0-9]{8,15}$/.test(waNumber)) {
      return NextResponse.json(
        { error: "Nomor WA harus 8–15 digit angka (format internasional tanpa +, mis. 6281333397223)." },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }
    if (logoUrl && !isValidDataUrl(logoUrl, MAX_LOGO_LEN)) {
      return NextResponse.json({ error: "Logo tidak valid atau terlalu besar (maks ~2MB)." }, { status: 400 });
    }

    const data = {
      companyName: cleanStr(body.companyName, 120) || "PT Digital Bisnis Manajemen",
      waNumber: waNumber || "6281333397223",
      waDisplay: cleanStr(body.waDisplay, 30) || "+62 813-3339-7223",
      email: email || "halo@digiman.id",
      addressShort: cleanStr(body.addressShort, 160),
      addressFull: cleanStr(body.addressFull, 300),
      statClients: Math.min(1_000_000, Math.max(0, toInt(body.statClients, 2500))),
      statExperts: Math.min(1_000, Math.max(0, toInt(body.statExperts, 46))),
      statLayers: Math.min(100, Math.max(0, toInt(body.statLayers, 7))),
      statSuccess: Math.min(100, Math.max(0, toInt(body.statSuccess, 98))),
      ...(body.logoClear === true ? { logoUrl: null } : logoUrl ? { logoUrl } : {}),
    };

    const settings = await db.siteSetting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("PUT /api/admin/settings error:", e);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}
