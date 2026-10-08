"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Users, Globe2, FileBadge, HeartHandshake, Store, Handshake,
  Lightbulb, HeartPulse, FlaskConical, Award, MapPin, Receipt, ShieldCheck,
  Rocket, Sparkles, CheckCircle2, ArrowUpRight, Clock3, Wallet, Compass,
  ListChecks, RotateCcw, Send, Mountain,
} from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

/* ============================================================
   DATA KALKULATOR — biaya (Rp) & durasi (hari kerja) per item.
   Angka merujuk harga layanan asli di katalog DB digiman.id.
   ============================================================ */
type Range = [number, number];

const ENTITIES: Record<string, { cost: Range; days: Range }> = {
  pt: { cost: [3_500_000, 5_000_000], days: [3, 7] },
  cv: { cost: [1_800_000, 2_800_000], days: [3, 7] },
  perorangan: { cost: [850_000, 1_500_000], days: [1, 3] },
  pma: { cost: [15_000_000, 25_000_000], days: [14, 30] },
  yayasan: { cost: [2_500_000, 4_000_000], days: [5, 10] },
  koperasi: { cost: [2_500_000, 3_500_000], days: [5, 10] },
  firma: { cost: [1_200_000, 2_000_000], days: [2, 5] },
};

const CALC_ADDONS: Record<string, { cost: Range; days: Range }> = {
  merek: { cost: [1_500_000, 2_500_000], days: [3, 7] },
  halal: { cost: [1_500_000, 3_000_000], days: [10, 20] },
  bpom: { cost: [2_000_000, 5_000_000], days: [14, 30] },
  iso: { cost: [5_000_000, 12_000_000], days: [30, 60] },
  vo: { cost: [500_000, 1_200_000], days: [1, 2] },
  pajak: { cost: [4_000_000, 6_000_000], days: [1, 2] },
  bpjs: { cost: [300_000, 600_000], days: [1, 2] },
  website: { cost: [3_000_000, 8_000_000], days: [7, 14] },
  ai: { cost: [2_500_000, 5_000_000], days: [3, 7] },
  apostille: { cost: [350_000, 700_000], days: [2, 5] },
};

const ENTITY_ORDER = ["pt", "cv", "perorangan", "pma", "yayasan", "koperasi", "firma"] as const;
const ADDON_ORDER = ["merek", "halal", "bpom", "iso", "vo", "pajak", "bpjs", "website", "ai", "apostille"] as const;
const TIMELINE_ORDER = ["segera", "triwulan", "rencana"] as const;

const ENTITY_ICONS: Record<string, typeof Building2> = {
  pt: Building2, cv: Users, perorangan: FileBadge, pma: Globe2,
  yayasan: HeartHandshake, koperasi: Store, firma: Handshake,
};

const ADDON_ICONS: Record<string, typeof Lightbulb> = {
  Lightbulb, HeartPulse, FlaskConical, Award, MapPin,
  Receipt, ShieldCheck, Rocket, Sparkles, Globe2,
};

/** Format Rupiah ringkas gaya Indonesia: Rp 7,5 jt / Rp 850 rb. */
function fmtRp(v: number): string {
  const n = v >= 1_000_000_000
    ? v / 1_000_000_000
    : v >= 1_000_000
      ? v / 1_000_000
      : v / 1_000;
  const s = n.toLocaleString("id-ID", { maximumFractionDigits: v % 1_000_000 === 0 && v >= 1_000_000 ? 0 : 1 });
  if (v >= 1_000_000_000) return `Rp ${s} M`;
  if (v >= 1_000_000) return `Rp ${s} jt`;
  if (v >= 1_000) return `Rp ${s} rb`;
  return `Rp ${v.toLocaleString("id-ID")}`;
}

const sum = (r: Range[], idx: 0 | 1) => r.reduce((acc, v) => acc + v[idx], 0);

export default function Paket({ waNumber }: { waNumber?: string }) {
  const { dict } = useI18n();
  const p = dict.paket;

  const [entity, setEntity] = useState<string | null>(null);
  const [addons, setAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string | null>(null);

  const waBase = waNumber || "6281316516524";

  const addonItems = useMemo(
    () => p.addons.items.map((it, i) => ({ ...it, id: ADDON_ORDER[i] })),
    [p.addons.items]
  );

  const totals = useMemo(() => {
    if (!entity) return null;
    const e = ENTITIES[entity];
    if (!e) return null;
    const cost = [e.cost, ...addons.map((a) => CALC_ADDONS[a].cost)];
    const days = [e.days, ...addons.map((a) => CALC_ADDONS[a].days)];
    return {
      costMin: sum(cost, 0),
      costMax: sum(cost, 1),
      dayMin: sum(days, 0),
      dayMax: sum(days, 1),
    };
  }, [entity, addons]);

  const recommended = useMemo(() => {
    if (!entity) return null;
    if (entity === "pma") return p.tiers[3].name;
    if (entity === "perorangan") return p.tiers[0].name;
    if (entity === "pt") return addons.length >= 2 ? p.tiers[2].name : p.tiers[1].name;
    return p.tiers[1].name; // cv, firma, koperasi, yayasan
  }, [entity, addons.length, p.tiers]);

  const waUrl = useMemo(() => {
    if (!entity || !totals) return "#paket";
    const c = p.calc;
    const lines = [
      c.waIntro,
      "",
      `${c.waEntity}: ${c.entities[entity]}`,
      addons.length > 0 ? `${c.waAddons}: ${addons.map((a) => c.addons[a]).join(", ")}` : null,
      timeline ? `${c.waTimeline}: ${c.timelines[timeline]}` : null,
      `${c.investment}: ${fmtRp(totals.costMin)} – ${fmtRp(totals.costMax)}`,
      `${c.duration}: ${totals.dayMin}–${totals.dayMax} ${p.days}`,
      "",
      c.waClose,
    ].filter((l): l is string => l !== null);
    return `https://wa.me/${waBase}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [entity, addons, timeline, totals, p, waBase]);

  const toggleAddon = (id: string) =>
    setAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const tierWa = (name: string, ent: string) =>
    `https://wa.me/${waBase}?text=${encodeURIComponent(
      `Halo DIGIMAN.ID, saya tertarik dengan ${name} (${ent}). Mohon info proses & jadwal konsultasi gratisnya.`
    )}`;

  return (
    <section id="paket" className="section-padding relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute right-[10%] top-24 h-[380px] w-[680px] rounded-full bg-gold/[0.05] blur-[150px]"
      />
      <div className="mx-auto max-w-7xl">
        {/* ---------- Header ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold">
            {p.kicker}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {p.headingA}{" "}
            <span className="gradient-text-gold">{p.headingB}</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">{p.sub}</p>
        </motion.div>

        {/* ---------- Paket Berjenjang ---------- */}
        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
          {p.tiers.map((t, i) => {
            const featured = i === 1;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex h-full flex-col rounded-[1.75rem] p-7 ${
                  featured
                    ? "border border-gold/50 bg-gradient-to-b from-[#12241d] to-[#0a1613] shadow-[0_0_60px_-20px_rgba(242,193,78,0.45)] xl:-my-3 xl:py-10"
                    : "glass"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 shadow-lg">
                    {p.popular}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-white">{t.name}</h3>
                <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${featured ? "text-gold" : "text-emerald-300"}`}>
                  {t.entity}
                </p>
                <div className="mt-5">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-50/40">{t.priceNote.split("—")[0].trim()}</span>
                  <div className={`font-display text-3xl font-extrabold ${featured ? "gradient-text-gold" : "text-white"}`}>
                    {t.price}
                  </div>
                  {t.priceNote.includes("—") && (
                    <div className="mt-1 text-xs font-medium text-emerald-300/80">{t.priceNote.split("—")[1].trim()}</div>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-emerald-50/60">{t.desc}</p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-emerald-400/10 pt-5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-emerald-50/75">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-gold" : "text-emerald-400"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={tierWa(t.name, t.entity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${
                    featured
                      ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-emerald-950 shadow-[0_8px_30px_-8px_rgba(242,193,78,0.6)] hover:brightness-110"
                      : "border border-emerald-400/30 bg-emerald-400/5 text-emerald-100 hover:border-gold/50 hover:text-gold"
                  }`}
                >
                  {i === 3 ? p.ctaTierCustom : p.ctaTier}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </motion.div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-emerald-50/40 sm:text-sm">
          {p.note}
        </p>

        {/* ---------- Add-on ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28 mb-10 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {p.addons.kicker}
          </span>
          <h3 className="text-2xl font-extrabold text-white sm:text-4xl">
            {p.addons.headingA}{" "}
            <span className="gradient-text-emerald">{p.addons.headingB}</span>
          </h3>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-emerald-50/60">{p.addons.sub}</p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {addonItems.map((a, i) => {
            const Ikon = ADDON_ICONS[a.icon] ?? Sparkles;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.05, duration: 0.5 }}
                className="group flex items-center gap-3.5 rounded-2xl p-4 transition-colors glass hover:border-gold/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/25 to-teal-600/10 ring-1 ring-emerald-400/30 transition-transform duration-500 group-hover:scale-110">
                  <Ikon className="h-5 w-5 text-emerald-200" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{a.name}</span>
                  <span className="text-xs font-bold text-gold-light">{a.price}</span>
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* ---------- Kalkulator Legalitas ---------- */}
        <div className="mt-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold">
              <CalculatorGlyph /> {p.calc.kicker}
            </span>
            <h3 className="text-2xl font-extrabold text-white sm:text-4xl">
              {p.calc.headingA}{" "}
              <span className="gradient-text-gold">{p.calc.headingB}</span>
            </h3>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-emerald-50/60">{p.calc.sub}</p>
          </motion.div>

          <div className="grid items-start gap-6 lg:grid-cols-5">
            {/* Langkah-langkah */}
            <div className="space-y-6 lg:col-span-3">
              {/* Langkah 1 — bentuk usaha */}
              <StepCard step={1} title={p.calc.step1} hint={p.calc.step1Hint}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ENTITY_ORDER.map((id) => {
                    const Ikon = ENTITY_ICONS[id] ?? Building2;
                    const active = entity === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setEntity(id)}
                        aria-pressed={active}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all ${
                          active
                            ? "border-gold/60 bg-gradient-to-r from-yellow-300/15 to-emerald-400/10 shadow-[0_0_24px_-10px_rgba(242,193,78,0.6)]"
                            : "border-emerald-400/20 bg-emerald-950/40 hover:border-emerald-400/45"
                        }`}
                      >
                        <Ikon className={`h-5 w-5 shrink-0 ${active ? "text-gold" : "text-emerald-300"}`} />
                        <span className={`text-sm font-semibold ${active ? "text-gold-light" : "text-emerald-50/80"}`}>
                          {p.calc.entities[id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </StepCard>

              {/* Langkah 2 — layanan pendukung */}
              <StepCard step={2} title={p.calc.step2} hint={p.calc.step2Hint}>
                <div className="flex flex-wrap gap-2.5">
                  {addonItems.map((a) => {
                    const active = addons.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddon(a.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
                          active
                            ? "border-gold/60 bg-gradient-to-r from-yellow-300/15 to-emerald-400/10 text-gold-light"
                            : "border-emerald-400/20 bg-emerald-950/40 text-emerald-50/60 hover:border-emerald-400/45 hover:text-white"
                        }`}
                      >
                        {active && <CheckCircle2 className="h-4 w-4 text-gold" />}
                        {p.calc.addons[a.id]}
                        <span className={`text-xs font-bold ${active ? "text-gold" : "text-emerald-300/50"}`}>
                          {a.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </StepCard>

              {/* Langkah 3 — rencana mulai */}
              <StepCard step={3} title={p.calc.step3} hint={p.calc.step3Hint}>
                <div className="flex flex-wrap gap-2.5">
                  {TIMELINE_ORDER.map((id) => {
                    const active = timeline === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setTimeline(id)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                          active
                            ? "border-gold/60 bg-gradient-to-r from-yellow-300/15 to-emerald-400/10 text-gold-light"
                            : "border-emerald-400/20 bg-emerald-950/40 text-emerald-50/60 hover:border-emerald-400/45 hover:text-white"
                        }`}
                      >
                        {p.calc.timelines[id]}
                      </button>
                    );
                  })}
                </div>
              </StepCard>
            </div>

            {/* Panel hasil — sticky di desktop */}
            <div className="lg:col-span-2 lg:sticky lg:top-28">
              <div className="card-glow relative overflow-hidden rounded-[1.75rem] border border-gold/40 bg-gradient-to-b from-[#12241d] to-[#081410] p-7 shadow-[0_0_60px_-24px_rgba(242,193,78,0.5)]">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-gold" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-gold">
                    {p.calc.resultKicker}
                  </span>
                </div>
                <h4 className="mt-1.5 font-display text-xl font-bold text-white">{p.calc.resultTitle}</h4>

                <AnimatePresence mode="wait">
                  {!totals ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-10 mb-10 flex flex-col items-center gap-3 text-center"
                    >
                      <Compass className="h-10 w-10 text-emerald-400/40" />
                      <p className="max-w-[240px] text-sm leading-relaxed text-emerald-50/45">{p.calc.resultEmpty}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${entity}-${addons.join(",")}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="mt-5 space-y-5"
                    >
                      <div className="rounded-2xl bg-emerald-950/50 p-4 ring-1 ring-emerald-400/15">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-50/50">
                          <Wallet className="h-3.5 w-3.5 text-gold" /> {p.calc.investment}
                        </div>
                        <div className="mt-1 font-display text-2xl font-extrabold gradient-text-gold">
                          {fmtRp(totals.costMin)} – {fmtRp(totals.costMax)}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-emerald-950/50 p-4 ring-1 ring-emerald-400/15">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-50/50">
                          <Clock3 className="h-3.5 w-3.5 text-gold" /> {p.calc.duration}
                        </div>
                        <div className="mt-1 font-display text-xl font-extrabold text-white">
                          {totals.dayMin}–{totals.dayMax} <span className="text-sm font-semibold text-emerald-200/70">{p.days}</span>
                        </div>
                      </div>

                      {recommended && (
                        <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/[0.06] p-4">
                          <Compass className="h-6 w-6 shrink-0 text-gold" />
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-50/50">
                              {p.calc.recommended}
                            </div>
                            <div className="font-display text-base font-bold text-gold-light">{recommended}</div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-50/50">
                          <ListChecks className="h-3.5 w-3.5 text-gold" /> {p.calc.breakdown}
                        </div>
                        <ul className="space-y-1.5">
                          <li className="flex items-center gap-2 text-sm text-emerald-50/75">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            {p.calc.entities[entity]}
                          </li>
                          {addons.map((a) => (
                            <li key={a} className="flex items-center gap-2 text-sm text-emerald-50/75">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              {p.calc.addons[a]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!totals}
                  className={`mt-6 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                    totals
                      ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-emerald-950 shadow-[0_8px_30px_-8px_rgba(242,193,78,0.6)] hover:brightness-110"
                      : "pointer-events-none border border-emerald-400/15 bg-emerald-950/40 text-emerald-50/30"
                  }`}
                >
                  <Send className="h-4 w-4" />
                  {p.calc.ctaWa}
                </a>

                {(entity || addons.length > 0) && (
                  <button
                    onClick={() => { setEntity(null); setAddons([]); setTimeline(null); }}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-emerald-50/45 transition-colors hover:text-gold"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> {p.calc.restart}
                  </button>
                )}

                <p className="mt-5 border-t border-emerald-400/10 pt-4 text-[11px] leading-relaxed text-emerald-50/35">
                  {p.calc.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Kartu langkah kecil ---------- */
function StepCard({
  step, title, hint, children,
}: {
  step: number; title: string; hint: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-[1.5rem] p-6 glass sm:p-7"
    >
      <div className="mb-5 flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 font-display text-base font-extrabold text-emerald-950 shadow-[0_0_24px_rgba(242,193,78,0.4)]">
          {step}
        </span>
        <div>
          <h4 className="font-display text-lg font-bold text-white">{title}</h4>
          <p className="mt-0.5 text-xs leading-relaxed text-emerald-50/45">{hint}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/** Ikon kalkulator kecil untuk pill kicker. */
function CalculatorGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
    </svg>
  );
}
