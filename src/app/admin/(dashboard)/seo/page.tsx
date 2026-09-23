"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Save, Globe, FileCode2, CheckCircle2 } from "lucide-react";
import { PageHeader, AdminCard, FieldLabel, btnGold, inputCls } from "@/components/admin/admin-ui";

interface Settings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleSiteVerification: string;
  headScripts: string;
}

export default function SeoPage() {
  const [form, setForm] = useState<Settings>({ metaTitle: "", metaDescription: "", metaKeywords: "", googleSiteVerification: "", headScripts: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((j) => {
        if (j.settings)
          setForm({
            metaTitle: j.settings.metaTitle ?? "",
            metaDescription: j.settings.metaDescription ?? "",
            metaKeywords: j.settings.metaKeywords ?? "",
            googleSiteVerification: j.settings.googleSiteVerification ?? "",
            headScripts: j.settings.headScripts ?? "",
          });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      setMsg(
        res.ok
          ? { ok: true, text: "Pengaturan SEO tersimpan. Halaman publik otomatis memakai metadata baru." }
          : { ok: false, text: json.error || "Gagal menyimpan." }
      );
    } finally {
      setSaving(false);
    }
  };

  const titleLen = form.metaTitle.length;
  const descLen = form.metaDescription.length;

  return (
    <div>
      <PageHeader
        icon={<Search className="h-6 w-6 text-gold" />}
        title="Pusat SEO"
        desc="Kelola tampilan website di Google — metadata, kata kunci, verifikasi Search Console, dan skrip analytics tanpa menyentuh kode."
        action={
          <button onClick={save} disabled={saving || loading} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ${btnGold} disabled:opacity-60`}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Menyimpan…" : "Simpan SEO"}
          </button>
        }
      />

      {msg && (
        <p role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200" : "border-red-400/30 bg-red-950/30 text-red-300"}`}>
          {msg.text}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <AdminCard>
            <h2 className="mb-5 font-display text-lg font-bold text-white">Metadata Google</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel hint={`${titleLen}/60 karakter — ideal 50–60`}>Meta Title (judul SERP)</FieldLabel>
                <input value={form.metaTitle} maxLength={200} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputCls} />
              </div>
              <div>
                <FieldLabel hint={`${descLen}/160 karakter — ideal 140–160`}>Meta Description (deskripsi SERP)</FieldLabel>
                <textarea value={form.metaDescription} maxLength={400} rows={3} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Pisahkan dengan koma — dipakai sebagai meta keywords">Kata Kunci</FieldLabel>
                <input value={form.metaKeywords} maxLength={300} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className={inputCls} placeholder="jasa pendirian pt, legalitas usaha, konsultan bisnis" />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg font-bold text-white">
              <FileCode2 className="h-4.5 w-4.5 text-gold" /> Skrip Analytics / Pixel
            </h2>
            <p className="mb-4 text-xs leading-relaxed text-emerald-50/45">
              Tempel kode Google Analytics (gtag), Google Tag Manager, Meta Pixel, atau skrip lainnya — otomatis diinjeksi ke {"<head>"} seluruh halaman. Tanpa plugin, tanpa edit file.
            </p>
            <textarea
              value={form.headScripts}
              rows={6}
              onChange={(e) => setForm({ ...form, headScripts: e.target.value })}
              className={`${inputCls} font-mono text-xs`}
              placeholder={`// contoh:\nwindow.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-XXXXXXX');`}
            />
          </AdminCard>

          <AdminCard>
            <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg font-bold text-white">
              <Globe className="h-4.5 w-4.5 text-gold" /> Verifikasi Search Console
            </h2>
            <p className="mb-4 text-xs leading-relaxed text-emerald-50/45">
              Tempel hanya kode konten verifikasi Google — mis. <code className="rounded bg-[#0a1613] px-1.5 py-0.5 text-[10px] text-gold-light">google-site-verification=abc123…</code> — meta tag-nya otomatis dipasang di beranda.
            </p>
            <input
              value={form.googleSiteVerification}
              maxLength={200}
              onChange={(e) => setForm({ ...form, googleSiteVerification: e.target.value })}
              className={inputCls}
              placeholder="google-site-verification=…"
            />
          </AdminCard>
        </div>

        {/* Pratinjau SERP langsung */}
        <div className="space-y-5">
          <AdminCard className="sticky top-24">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Pratinjau Google</h2>
            <div className="rounded-2xl border border-emerald-400/15 bg-white p-4 shadow-inner">
              <p className="mb-1 flex items-center gap-1.5 text-xs text-[#5f6368]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1a73e8]" /> digiman.id
              </p>
              <p className="truncate text-lg leading-snug text-[#1a0dab]">{form.metaTitle || "Judul halaman"}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4d5156]">
                {form.metaDescription || "Deskripsi halaman akan muncul di sini…"}
              </p>
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <p className={`flex justify-between ${titleLen > 60 ? "text-red-300" : "text-emerald-200/70"}`}>
                <span>Judul</span> <span className="font-mono">{titleLen}/60</span>
              </p>
              <p className={`flex justify-between ${descLen > 160 ? "text-red-300" : "text-emerald-200/70"}`}>
                <span>Deskripsi</span> <span className="font-mono">{descLen}/160</span>
              </p>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
