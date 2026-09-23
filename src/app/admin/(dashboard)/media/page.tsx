"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Upload, Trash2, Loader2, Download, HardDrive } from "lucide-react";
import { PageHeader, AdminCard, btnGold, inputCls } from "@/components/admin/admin-ui";
import { fileToDataUrl } from "@/components/admin/image-upload";

interface Asset {
  id: string;
  name: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
  createdAt: string;
}

function fmtSize(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<Asset | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      setAssets(json.assets ?? []);
      setTotalSize(json.totalSize ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      setErr("");
      const list = Array.from(files).slice(0, 10);
      if (list.length === 0) return;
      setUploading(true);
      try {
        for (const file of list) {
          if (!file.type.startsWith("image/")) {
            setErr(`"${file.name}" bukan gambar — dilewati.`);
            continue;
          }
          const dataUrl = await fileToDataUrl(file, 900);
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = dataUrl;
          });
          const res = await fetch("/api/admin/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name,
              mime: file.type || "image/png",
              dataUrl,
              width: img.width,
              height: img.height,
            }),
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) setErr(json.error || "Gagal mengunggah media.");
        }
        await load();
      } catch {
        setErr("Gagal memproses gambar.");
      } finally {
        setUploading(false);
      }
    },
    [load]
  );

  const remove = async (asset: Asset) => {
    if (!confirm(`Hapus media "${asset.name}"?`)) return;
    await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
    setPreview(null);
    load();
  };

  // Drag & drop seluruh area
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const over = (e: DragEvent) => {
      e.preventDefault();
      el.dataset.drag = "1";
    };
    const leave = () => delete el.dataset.drag;
    const drop = (e: DragEvent) => {
      e.preventDefault();
      delete el.dataset.drag;
      if (e.dataTransfer?.files.length) upload(e.dataTransfer.files);
    };
    el.addEventListener("dragover", over);
    el.addEventListener("dragleave", leave);
    el.addEventListener("drop", drop);
    return () => {
      el.removeEventListener("dragover", over);
      el.removeEventListener("dragleave", leave);
      el.removeEventListener("drop", drop);
    };
  }, [upload]);

  const filtered = assets.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        icon={<ImageIcon className="h-6 w-6 text-gold" />}
        title="Pusat Media"
        desc="Semua gambar situs tersimpan terpusat di sini — unggah sekali, pakai berkali-kali. Drag & drop langsung didukung."
        action={
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ${btnGold} disabled:opacity-60`}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Mengunggah…" : "Unggah Gambar"}
          </button>
        }
      />
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />

      <div ref={dropRef} className="mb-6 rounded-3xl border border-dashed border-emerald-400/25 bg-[#071a14]/50 px-6 py-8 text-center transition-colors data-[drag]:border-gold/60 data-[drag]:bg-gold/5">
        <Upload className="mx-auto mb-2 h-6 w-6 text-emerald-300/50" />
        <p className="text-sm font-semibold text-emerald-50/70">Tarik & lepas gambar ke sini</p>
        <p className="mt-1 text-xs text-emerald-50/40">PNG, JPG, WebP — otomatis dikompres hingga 900px. Maksimal ~2MB per file.</p>
      </div>

      {err && <p role="alert" className="mb-4 rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">{err}</p>}

      <AdminCard>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-emerald-50/60">
            <span className="font-bold text-white">{assets.length}</span> aset
            <span className="flex items-center gap-1.5 text-xs"><HardDrive className="h-3.5 w-3.5" /> {fmtSize(totalSize)}</span>
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama file…" className={`max-w-xs ${inputCls}`} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-emerald-50/20" />
            <p className="text-sm text-emerald-50/50">Belum ada media. Unggah gambar pertama Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((a) => (
              <button key={a.id} onClick={() => setPreview(a)} className="group overflow-hidden rounded-2xl border border-emerald-400/15 bg-[#0a1613] text-left transition-all hover:border-gold/45 hover:shadow-[0_10px_30px_-15px_rgba(242,193,78,0.3)]">
                <div className="relative aspect-square overflow-hidden bg-[#04100c]">
                  <img src={a.dataUrl} alt={a.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-100/80 opacity-0 transition-opacity group-hover:opacity-100">
                    {a.width}×{a.height}
                  </span>
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-xs font-semibold text-emerald-50/85">{a.name}</p>
                  <p className="text-[10px] text-emerald-50/40">{fmtSize(a.size)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Modal pratinjau */}
      {preview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Pratinjau ${preview.name}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)} aria-hidden />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/25 bg-[#071a14]">
            <div className="flex max-h-[60vh] items-center justify-center overflow-hidden bg-[#04100c]">
              <img src={preview.dataUrl} alt={preview.name} className="max-h-[60vh] w-auto object-contain" />
            </div>
            <div className="flex flex-col gap-3 border-t border-emerald-400/15 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{preview.name}</p>
                <p className="text-xs text-emerald-50/45">{preview.width}×{preview.height} px · {fmtSize(preview.size)} · {new Date(preview.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
              <div className="flex gap-2">
                <a href={preview.dataUrl} download={preview.name} className="flex items-center gap-1.5 rounded-xl border border-emerald-400/25 px-3.5 py-2 text-xs font-semibold text-emerald-100/80 transition-colors hover:border-gold/40 hover:text-gold-light">
                  <Download className="h-3.5 w-3.5" /> Unduh
                </a>
                <button onClick={() => remove(preview)} className="flex items-center gap-1.5 rounded-xl border border-red-400/30 bg-red-950/30 px-3.5 py-2 text-xs font-semibold text-red-300 transition-colors hover:border-red-400/60">
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
