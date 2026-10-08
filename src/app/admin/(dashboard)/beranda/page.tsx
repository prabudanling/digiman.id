"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Type, Save, Plus, X, Sparkles, RotateCw, ExternalLink } from "lucide-react";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnGold } from "@/components/admin/admin-ui";

interface HeroData {
  heroHeadline: string;
  heroSub: string;
  words: string[];
}

export default function AdminBeranda() {
  const [headline, setHeadline] = useState("");
  const [sub, setSub] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [wordInput, setWordInput] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/hero", { cache: "no-store" });
        const json = await res.json();
        if (res.ok && json.hero) {
          setHeadline(json.hero.heroHeadline ?? "");
          setSub(json.hero.heroSub ?? "");
          setWords(Array.isArray(json.hero.words) ? json.hero.words : []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Animasi rotasi kata pada panel preview (ala website asli)
  useEffect(() => {
    if (words.length < 2) return;
    const iv = setInterval(() => setPreviewIndex((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(iv);
  }, [words]);

  const addWord = () => {
    const w = wordInput.trim().slice(0, 40);
    if (!w) return;
    if (words.length >= 12) {
      setMsg({ ok: false, text: "Maksimal 12 kata berputar." });
      return;
    }
    setWords((prev) => [...prev, w]);
    setWordInput("");
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroHeadline: headline, heroSub: sub, heroWords: words }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan.");
      setMsg({ ok: true, text: "Tersimpan! Perubahan langsung tayang di beranda website." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  const headlineWords = headline.trim().split(/\s+/).filter(Boolean);

  return (
    <div>
      <PageHeader
        icon={<Type className="h-6 w-6 text-emerald-300" />}
        title="Beranda (Hero)"
        desc="Atur judul besar, deskripsi, dan kata-kata berputar di bagian paling atas website. Kata yang mengandung angka otomatis bersinar emas."
        action={
          <a
            href="/#beranda"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/50 px-4 py-2.5 text-xs font-semibold text-emerald-100/75 transition-colors hover:border-gold/40 hover:text-gold-light"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Lihat Hasil
          </a>
        }
      />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl bg-emerald-400/5" />
          <div className="h-96 animate-pulse rounded-3xl bg-emerald-400/5" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ---------- Form ---------- */}
          <AdminCard>
            <div className="space-y-6">
              <div>
                <FieldLabel hint="Maksimal 160 karakter. Kata dengan angka otomatis berwarna emas.">
                  Judul Hero
                </FieldLabel>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={160}
                  className={`w-full rounded-xl px-4 py-3 text-base font-semibold ${inputCls}`}
                  placeholder="Naikkan Bisnis Anda ke 7 Lapis Langit Legalitas."
                />
              </div>

              <div>
                <FieldLabel hint="Teks pengantar di bawah judul. Maksimal 600 karakter.">
                  Deskripsi Singkat
                </FieldLabel>
                <textarea
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  maxLength={600}
                  rows={4}
                  className={`w-full rounded-xl px-4 py-3 text-sm leading-relaxed ${inputCls}`}
                  placeholder="Satu pintu untuk seluruh legalitas perusahaan di Indonesia…"
                />
                <p className="mt-1 text-right text-[11px] text-emerald-50/35">{sub.length}/600</p>
              </div>

              <div>
                <FieldLabel hint="Ketik lalu tekan Enter atau klik tombol tambah. Minimal 2, maksimal 12 kata.">
                  Kata Berputar (Animasi)
                </FieldLabel>
                <div className="flex gap-2">
                  <input
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addWord();
                      }
                    }}
                    maxLength={40}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm ${inputCls}`}
                    placeholder="mis. Pendampingan Pajak"
                  />
                  <button
                    onClick={addWord}
                    className="flex items-center gap-1.5 rounded-xl border border-gold/30 bg-yellow-300/10 px-4 py-2.5 text-xs font-bold text-gold-light transition-colors hover:bg-yellow-300/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah
                  </button>
                </div>
                {words.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {words.map((w, i) => (
                      <span
                        key={`${w}-${i}`}
                        className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-950/60 py-1.5 pl-3.5 pr-2 text-xs font-semibold text-emerald-100"
                      >
                        {w}
                        <button
                          onClick={() => setWords((prev) => prev.filter((_, idx) => idx !== i))}
                          className="flex h-4 w-4 items-center justify-center rounded-full text-emerald-50/45 transition-colors hover:bg-red-400/20 hover:text-red-300"
                          aria-label={`Hapus kata ${w}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    msg.ok
                      ? "border border-emerald-400/30 bg-emerald-950/50 text-emerald-200"
                      : "border border-red-400/30 bg-red-950/30 text-red-300"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <button
                onClick={save}
                disabled={saving || loading}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm ${btnGold} disabled:opacity-60`}
              >
                <Save className={`h-4 w-4 ${saving ? "animate-pulse" : ""}`} />
                {saving ? "Menyimpan…" : "Simpan & Tayangkan"}
              </button>
            </div>
          </AdminCard>

          {/* ---------- Preview ---------- */}
          <div className="space-y-6">
            <AdminCard className="relative overflow-hidden !p-0">
              <div className="flex items-center justify-between border-b border-emerald-400/10 px-5 py-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/60">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> Pratinjau Langsung
                </p>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300/70">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Live
                </span>
              </div>

              {/* Mock hero */}
              <div className="relative overflow-hidden bg-[#050d0a] px-6 py-12 text-center">
                <div className="pointer-events-none absolute -top-16 left-[10%] h-48 w-48 rounded-full bg-emerald-500/15 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-16 right-[5%] h-48 w-48 rounded-full bg-yellow-500/10 blur-[80px]" />

                <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-950/50 px-4 py-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100/90">
                    PT Digital Bisnis Manajemen
                  </span>
                </div>

                <h2 className="mx-auto max-w-md text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  {headlineWords.length > 0
                    ? headlineWords.map((w, i) => {
                        const hasDigit = /\d/.test(w);
                        const isLast = i === headlineWords.length - 1 && /\.$/.test(w);
                        return (
                          <motion.span
                            key={`${i}-${w}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            className={`mr-[0.28em] inline-block ${hasDigit ? "gradient-text-gold" : ""} ${
                              isLast ? "gradient-text-emerald" : ""
                            }`}
                          >
                            {w}
                          </motion.span>
                        );
                      })
                    : <span className="text-emerald-50/30">Judul hero akan tampil di sini…</span>}
                </h2>

                <div className="mx-auto mt-4 flex h-7 items-center justify-center gap-2">
                  <span className="text-sm text-emerald-100/60">Mulai dari</span>
                  <span className="relative inline-flex h-7 min-w-[160px] items-center justify-center overflow-hidden">
                    {words.map((r, i) => (
                      <motion.span
                        key={`${r}-${i}`}
                        className="absolute text-sm font-bold text-gold-light"
                        initial={false}
                        animate={
                          i === previewIndex
                            ? { y: 0, opacity: 1, filter: "blur(0px)" }
                            : { y: i < previewIndex ? -24 : 24, opacity: 0, filter: "blur(3px)" }
                        }
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {r}
                      </motion.span>
                    ))}
                  </span>
                </div>

                {sub.trim() && (
                  <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-emerald-50/60 sm:text-sm">
                    {sub}
                  </p>
                )}
              </div>
            </AdminCard>

            <div className="flex items-start gap-3 rounded-2xl border border-gold/20 bg-yellow-300/[0.04] px-5 py-4">
              <RotateCw className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p className="text-xs leading-relaxed text-emerald-50/60">
                <span className="font-bold text-gold-light">Tips:</span> pratinjau di samping meniru tampilan asli
                website — termasuk animasi kata berputar dan pewarnaan otomatis. Setelah menyimpan, buka beranda
                untuk melihat hasil akhirnya dengan animasi penuh.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
