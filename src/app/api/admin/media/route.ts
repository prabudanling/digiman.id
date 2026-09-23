import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWrite, cleanStr, isValidDataUrl } from "@/lib/admin-guard";

const MAX_ASSET = 2_600_000; // ~2MB data URL hasil kompresi klien

/** GET /api/admin/media — daftar aset media (terbaru dulu) */
export async function GET(req: NextRequest) {
  const session = await requireWrite(req, "media");
  if (session instanceof NextResponse) return session;

  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 120,
  });
  const totalSize = assets.reduce((a, m) => a + m.size, 0);
  return NextResponse.json({ assets, totalSize });
}

/** POST /api/admin/media — simpan aset baru */
export async function POST(req: NextRequest) {
  const session = await requireWrite(req, "media");
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const name = cleanStr(body.name, 120) || "gambar";
    const mime = cleanStr(body.mime, 60);
    const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
    const width = Math.max(0, Math.min(10_000, Number(body.width) || 0));
    const height = Math.max(0, Math.min(10_000, Number(body.height) || 0));

    if (!isValidDataUrl(dataUrl, MAX_ASSET)) {
      return NextResponse.json(
        { error: "File harus gambar (PNG/JPG/WebP) maksimal ~2MB." },
        { status: 400 }
      );
    }
    if (mime && !/^image\/(png|jpe?g|webp|svg\+xml|gif)$/.test(mime)) {
      return NextResponse.json({ error: "Tipe file tidak didukung." }, { status: 400 });
    }

    const size = Math.round((dataUrl.length * 3) / 4);
    const asset = await db.mediaAsset.create({
      data: { name, mime: mime || "image/png", dataUrl, width, height, size },
    });
    await db.activityLog.create({
      data: { username: session.username, action: "CREATE", detail: `Upload media "${name}"` },
    }).catch(() => {});
    return NextResponse.json({ ok: true, asset });
  } catch (e) {
    console.error("POST /api/admin/media error:", e);
    return NextResponse.json({ error: "Gagal menyimpan media." }, { status: 500 });
  }
}
