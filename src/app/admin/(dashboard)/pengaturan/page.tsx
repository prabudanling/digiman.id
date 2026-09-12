"use client";

import { useEffect, useState } from "react";
import { Settings, Loader2, Save, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/image-upload";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald } from "@/components/admin/admin-ui";

interface Settings {
  companyName: string;
  waNumber: string;
  waDisplay: string;
  email: string;
  addressShort: string;
  addressFull: string;
  logoUrl: string | null;
  statClients: number;
  statExperts: number;
  statLayers: number;
  statSuccess: number;
}

export default function PengaturanPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setS(data.settings);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = <K extends keyof Settings>(key: K, v: Settings[K]) => {
    setS((prev) => (prev ? { ...prev, [key]: v } : prev));
  };

  const save = async () => {
    if (!s) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gagal menyimpan." });
        return;
      }
      setS(data.settings);
      setMsg({ ok: true, text: "Pengaturan tersimpan & langsung tayang di website." });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }
  if (!s) return <p className="text-sm text-red-300">Gagal memuat pengaturan.</p>;

  return (
    <div>
      <PageHeader
        icon={<Settings className="h-6 w-6 text-emerald-300" />}
        title="Pengaturan Situs"
        desc="Nomor WhatsApp, email, alamat, logo, dan angka statistik — digunakan di seluruh halaman website."
        action={
          <Button onClick={save} disabled={saving} className={btnEmerald}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Semua
          </Button>
        }
      />

      {msg && (
        <div
          className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
            msg.ok
              ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200"
              : "border-red-400/25 bg-red-950/30 text-red-300"
          }`}
          role="status"
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Kolom utama */}
        <div className="space-y-6">
          <AdminCard>
            <h2 className="font-display mb-5 text-lg font-bold text-white">Kontak & Identitas</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Nama Perusahaan</FieldLabel>
                <Input value={s.companyName} onChange={(e) => set("companyName", e.target.value)} className={inputCls} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel hint="Tampil di website, bebas format">Nomor WA (tampilan)</FieldLabel>
                  <Input value={s.waDisplay} onChange={(e) => set("waDisplay", e.target.value)} placeholder="+62 813-3339-7223" className={inputCls} />
                </div>
                <div>
                  <FieldLabel hint="Angka saja, awali 62 tanpa +">Nomor WA (link wa.me)</FieldLabel>
                  <Input value={s.waNumber} onChange={(e) => set("waNumber", e.target.value)} placeholder="6281333397223" className={inputCls} />
                </div>
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <Input value={s.email} onChange={(e) => set("email", e.target.value)} placeholder="halo@digiman.id" className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Versi pendek untuk section CTA">Alamat (pendek)</FieldLabel>
                <Input value={s.addressShort} onChange={(e) => set("addressShort", e.target.value)} className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Versi lengkap untuk footer">Alamat (lengkap)</FieldLabel>
                <Textarea value={s.addressFull} onChange={(e) => set("addressFull", e.target.value)} rows={2} className={inputCls} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display mb-5 text-lg font-bold text-white">Angka Statistik</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel hint="Contoh: 2500 → tampil 2.500+">Perusahaan Didasarkan</FieldLabel>
                <Input type="number" min={0} value={s.statClients} onChange={(e) => set("statClients", parseInt(e.target.value || "0", 10))} className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Contoh: 46">Dewan Pakar</FieldLabel>
                <Input type="number" min={0} value={s.statExperts} onChange={(e) => set("statExperts", parseInt(e.target.value || "0", 10))} className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Contoh: 7">Lapis Layanan</FieldLabel>
                <Input type="number" min={0} value={s.statLayers} onChange={(e) => set("statLayers", parseInt(e.target.value || "0", 10))} className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Dalam persen, contoh: 98">Klien Merekomendasikan (%)</FieldLabel>
                <Input type="number" min={0} max={100} value={s.statSuccess} onChange={(e) => set("statSuccess", parseInt(e.target.value || "0", 10))} className={inputCls} />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Kolom logo */}
        <AdminCard className="h-fit">
          <h2 className="font-display mb-1.5 text-lg font-bold text-white">Logo Perusahaan</h2>
          <p className="mb-5 text-xs leading-relaxed text-emerald-50/50">
            PNG transparan disarankan. Digunakan di navbar, footer, preloader & CTA.
          </p>
          <div className="flex flex-col items-center gap-4">
            <ImageUpload
              value={s.logoUrl}
              onChange={(v) => set("logoUrl", v)}
              shape="rounded"
              size={150}
              maxSize={512}
              label="Unggah Logo"
            />
            <div className="flex items-start gap-2 rounded-xl border border-emerald-400/15 bg-emerald-950/40 px-3.5 py-3 text-[11px] leading-relaxed text-emerald-50/55">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              Jika dikosongkan, logo emas bawaan DIGIMAN yang digunakan. Setelah simpan, refresh halaman website untuk melihat hasilnya.
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="mt-8">
        <Button onClick={save} disabled={saving} className={`${btnEmerald} w-full sm:w-auto`}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  );
}
