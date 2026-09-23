"use client";

import { useEffect, useState } from "react";
import { LayoutTemplate, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, Save, RotateCcw, GripVertical } from "lucide-react";
import { PageHeader, AdminCard, btnGold } from "@/components/admin/admin-ui";

interface Sec {
  key: string;
  label: string;
  desc: string;
  enabled: boolean;
  order: number;
  saved: boolean;
}

export default function LayoutPage() {
  const [sections, setSections] = useState<Sec[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/sections")
      .then((r) => r.json())
      .then((j) => setSections(j.sections ?? []))
      .finally(() => setLoading(false));
  }, []);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next.map((s, idx) => ({ ...s, order: idx })));
    setMsg(null);
  };

  const toggle = (i: number) => {
    setSections(sections.map((s, idx) => (idx === i ? { ...s, enabled: !s.enabled } : s)));
    setMsg(null);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sections.map((s, i) => ({ key: s.key, enabled: s.enabled, order: i })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({ ok: true, text: "Tersimpan! Buka beranda untuk melihat hasilnya." });
        setSections(sections.map((s, i) => ({ ...s, saved: true, order: i })));
      } else {
        setMsg({ ok: false, text: json.error || "Gagal menyimpan." });
      }
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    fetch("/api/admin/sections")
      .then((r) => r.json())
      .then((j) => setSections(j.sections ?? []))
      .finally(() => setMsg(null));
  };

  const offCount = sections.filter((s) => !s.enabled).length;

  return (
    <div>
      <PageHeader
        icon={<LayoutTemplate className="h-6 w-6 text-gold" />}
        title="Tata Letak Section Beranda"
        desc="Atur urutan & visibilitas setiap bagian beranda — lebih fleksibel dari WordPress: tanpa plugin, efeknya langsung terlihat di website."
        action={
          <div className="flex gap-2">
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 px-4 py-2.5 text-sm font-semibold text-emerald-100/70 transition-colors hover:border-gold/40 hover:text-gold-light">
              <RotateCcw className="h-4 w-4" /> Muat Ulang
            </button>
            <button onClick={save} disabled={saving} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ${btnGold} disabled:opacity-60`}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Menyimpan…" : "Simpan Tampilan"}
            </button>
          </div>
        }
      />

      {msg && (
        <p role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200" : "border-red-400/30 bg-red-950/30 text-red-300"}`}>
          {msg.text}
        </p>
      )}

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between text-xs text-emerald-50/50">
              <span>{sections.length} section terdaftar</span>
              <span>{offCount > 0 ? `${offCount} disembunyikan dari beranda` : "Semua tampil"}</span>
            </div>
            <ul className="space-y-2.5">
              {sections.map((s, i) => (
                <li
                  key={s.key}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all ${
                    s.enabled
                      ? "border-emerald-400/15 bg-[#0a1613]"
                      : "border-emerald-400/8 bg-[#071a14]/40 opacity-55"
                  }`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-emerald-50/25" aria-hidden />
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/25 bg-[#04100c] font-display text-xs font-bold text-gold-light">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{s.label}</p>
                    <p className="truncate text-xs text-emerald-50/45">{s.desc}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Naikkan ${s.label}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 text-emerald-50/60 transition-colors hover:border-gold/40 hover:text-gold-light disabled:opacity-30">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} aria-label={`Turunkan ${s.label}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 text-emerald-50/60 transition-colors hover:border-gold/40 hover:text-gold-light disabled:opacity-30">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggle(i)}
                      role="switch"
                      aria-checked={s.enabled}
                      aria-label={`${s.enabled ? "Sembunyikan" : "Tampilkan"} ${s.label}`}
                      className={`relative h-8 w-14 shrink-0 rounded-full border transition-all ${s.enabled ? "border-gold/50 bg-gold/25" : "border-emerald-400/20 bg-[#04100c]"}`}
                    >
                      <span className={`absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-all ${s.enabled ? "left-[calc(100%-1.75rem)] bg-gradient-to-br from-yellow-300 to-amber-400 text-emerald-950" : "left-1 bg-emerald-400/30 text-emerald-100/60"}`}>
                        {s.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </AdminCard>
    </div>
  );
}
