"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Users, Globe2, Stamp, Lightbulb, Rocket, FileCheck2, ScrollText,
  BadgeCheck, Landmark, Briefcase, ShieldCheck, Scale, HeartHandshake, Cpu,
  BarChart3, ArrowUpRight, CheckCircle2, FileBadge, Store, Handshake, Network,
  MapPin, FileSignature, Copyright, Award, Medal, Receipt, Calculator, HeartPulse,
  Plane, FileText, Archive, MonitorSmartphone, Sparkles, LayoutGrid,
} from "lucide-react";
import TiltCard from "./tilt-card";
import { useI18n } from "@/components/i18n/locale-provider";
import { svc } from "@/lib/i18n";

export interface ServiceItem {
  slug: string | null;
  title: string;
  desc: string;
  price: string;
  items: string[];
  icon: string; // nama ikon lucide
  category: string;
  featured: boolean;
}

const ICONS: Record<string, typeof Building2> = {
  Building2, Users, Globe2, Stamp, Lightbulb, Rocket, FileCheck2, ScrollText,
  BadgeCheck, Landmark, Briefcase, ShieldCheck, Scale, HeartHandshake, Cpu,
  BarChart3, FileBadge, Store, Handshake, Network, MapPin, FileSignature,
  Copyright, Award, Medal, Receipt, Calculator, HeartPulse, Plane, FileText,
  Archive, MonitorSmartphone, Sparkles,
};

const CATEGORY_ORDER = [
  "pendirian",
  "perizinan",
  "ki",
  "sertifikasi",
  "pajak",
  "ketenagakerjaan",
  "korporasi",
  "digital",
];

export default function Services({
  items,
  waNumber,
}: {
  items?: ServiceItem[];
  waNumber?: string;
}) {
  const { dict, locale } = useI18n();
  const [cat, setCat] = useState<string>("all");

  const services = items && items.length > 0 ? items : [];

  // Kategori yang benar-benar punya layanan (urutan tetap)
  const availableCats = useMemo(() => {
    const set = new Set(services.map((s) => s.category));
    return CATEGORY_ORDER.filter((c) => set.has(c));
  }, [services]);

  const filtered = useMemo(
    () => (cat === "all" ? services : services.filter((s) => s.category === cat)),
    [services, cat]
  );

  const waBase = waNumber || "6281333397223";

  return (
    <section id="layanan" className="section-padding relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-[140px]"
      />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {dict.services.kicker}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {dict.services.headingA}{" "}
            <span className="gradient-text-emerald">{dict.services.headingB}</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">
            {dict.services.sub}
          </p>
        </motion.div>

        {/* Tab kategori */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <TabBtn active={cat === "all"} onClick={() => setCat("all")}>
            <LayoutGrid className="h-3.5 w-3.5" />
            {dict.services.all}
            <span className="ml-1 rounded-full bg-emerald-400/15 px-1.5 text-[10px] font-bold text-emerald-200">
              {services.length}
            </span>
          </TabBtn>
          {availableCats.map((c) => (
            <TabBtn key={c} active={cat === c} onClick={() => setCat(c)}>
              {dict.services.categories[c] ?? c}
              <span className="ml-1 rounded-full bg-emerald-400/15 px-1.5 text-[10px] font-bold text-emerald-200">
                {services.filter((s) => s.category === c).length}
              </span>
            </TabBtn>
          ))}
        </div>

        {/* Grid kartu layanan */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => {
              const c = svc(s, dict, locale);
              const Ikon = ICONS[s.icon] ?? Building2;
              return (
                <motion.div
                  key={s.slug ?? s.title}
                  layout
                  initial={{ opacity: 0, y: 44, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ delay: (i % 3) * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="group h-full [perspective:900px]">
                    <div
                      className={`card-glow relative flex h-full flex-col rounded-[1.75rem] p-7 ${
                        s.featured
                          ? "border border-gold/45 bg-gradient-to-b from-[#12241d] to-[#0a1613] shadow-[0_0_50px_-18px_rgba(242,193,78,0.35)]"
                          : "glass"
                      }`}
                    >
                      {s.featured && (
                        <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 shadow-lg">
                          {dict.services.featured}
                        </span>
                      )}
                      <div
                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${
                          s.featured
                            ? "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_30px_rgba(242,193,78,0.4)]"
                            : "bg-gradient-to-br from-emerald-400/25 to-teal-600/10 ring-1 ring-emerald-400/35"
                        }`}
                      >
                        <Ikon className={`h-7 w-7 ${s.featured ? "text-emerald-950" : "text-emerald-200"}`} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-white">{c.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-emerald-50/60">{c.desc}</p>
                      <ul className="mt-5 flex-1 space-y-2.5">
                        {c.items.map((it) => (
                          <li key={it} className="flex items-start gap-2.5 text-sm text-emerald-50/75">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            {it}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-center justify-between border-t border-emerald-400/10 pt-5">
                        <span className={`font-display text-sm font-bold ${s.featured ? "text-gold-light" : "text-emerald-300"}`}>
                          {c.price}
                        </span>
                        <a
                          href={`https://wa.me/${waBase}?text=${encodeURIComponent(`Halo DIGIMAN.ID, saya tertarik dengan layanan ${c.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-semibold text-emerald-100/70 transition-colors group-hover:text-gold"
                          aria-label={`${dict.services.consult}: ${c.title}`}
                        >
                          {dict.services.consult}
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
        active
          ? "border-gold/50 bg-gradient-to-r from-yellow-300/15 to-emerald-400/10 text-gold-light shadow-[0_0_24px_-8px_rgba(242,193,78,0.5)]"
          : "border-emerald-400/20 bg-emerald-950/40 text-emerald-50/60 hover:border-emerald-400/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
