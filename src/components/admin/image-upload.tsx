"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";

/** Resize gambar di sisi klien → data URL (PNG untuk transparansi, JPEG lainnya) */
export async function fileToDataUrl(file: File, max = 640): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");
  ctx.drawImage(bitmap, 0, 0, w, h);
  const isPng = file.type === "image/png" || file.type === "image/webp";
  return isPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85);
}

interface Props {
  value: string | null;
  onChange: (v: string | null) => void;
  size?: number;
  shape?: "circle" | "rounded";
  label?: string;
  maxSize?: number;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  size = 96,
  shape = "circle",
  label = "Unggah Foto",
  maxSize = 640,
  disabled,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr("File harus berupa gambar (JPG/PNG).");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file, maxSize);
      onChange(dataUrl);
    } catch {
      setErr("Gagal membaca gambar. Coba file lain.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const radius = shape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        onClick={() => !disabled && !busy && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => e.key === "Enter" && !disabled && fileRef.current?.click()}
        className={`group relative flex cursor-pointer items-center justify-center overflow-hidden ${radius} border-2 border-dashed transition-colors ${
          value ? "border-emerald-400/40 bg-emerald-950/60" : "border-emerald-400/35 bg-emerald-950/40 hover:border-gold/60"
        } ${disabled ? "opacity-60" : ""}`}
        style={{ width: size, height: size }}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
        ) : value ? (
           
          <img src={value} alt="Pratinjau" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-emerald-100/50">
            <Camera className="h-5 w-5 transition-colors group-hover:text-gold" />
            <span className="px-1 text-center text-[10px] font-medium leading-tight">{label}</span>
          </span>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || busy}
          className="text-[11px] font-semibold text-emerald-300 transition-colors hover:text-gold-light disabled:opacity-50"
        >
          {value ? "Ganti" : "Pilih file"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="flex items-center gap-1 text-[11px] font-semibold text-red-300/70 transition-colors hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" /> Hapus
          </button>
        )}
      </div>
      {err && <p className="max-w-40 text-center text-[10px] leading-tight text-red-400">{err}</p>}
    </div>
  );
}
