"use client";

import { motion } from "framer-motion";
import { Building, MapPin, Clock, Phone } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";
import type { OfficeItem } from "@/lib/site-data";

export default function Offices({
  offices,
  waDisplay,
  hours,
  waNumber,
}: {
  offices?: OfficeItem[];
  waDisplay?: string;
  hours?: string;
  waNumber?: string;
}) {
  const { dict } = useI18n();
  const list = (offices ?? []).slice().sort((a, b) => a.order - b.order);

  // Nomor romawi badge dihitung HANYA dari kartu BRANCH, agar konsisten
  // dengan label di database ("Branch Office I — Bandung" dst.).
  // Tipe "REP" (Representative Office) memperoleh perlakuan emas + badge SCBD.
  let branchNo = 0;
  const cards = list.map((o) => {
    const isBranch = o.type !== "HEAD" && o.type !== "REP";
    const num = isBranch ? ++branchNo : 0;
    return { o, num };
  });

  return (
    <section id="kantor" className="section-padding relative py-24 sm:py-28">
      <div
        aria-hidden
        className="absolute right-0 top-1/4 h-[380px] w-[380px] rounded-full bg-emerald-400/6 blur-[120px]"
      />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {dict.offices.kicker}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {dict.offices.heading}
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">{dict.offices.sub}</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ o, num }, i) => {
            const isHq = o.type === "HEAD";
            const isRep = o.type === "REP";
            const isPremium = isHq || isRep;
            return (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`card-glow group relative flex flex-col rounded-3xl p-6 ${
                  isPremium
                    ? "border border-gold/40 bg-gradient-to-b from-[#12241d] to-[#0a1613] shadow-[0_0_44px_-16px_rgba(242,193,78,0.35)]"
                    : "glass"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 ${
                      isPremium
                        ? "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_26px_rgba(242,193,78,0.4)]"
                        : "bg-gradient-to-br from-emerald-400/25 to-teal-600/10 ring-1 ring-emerald-400/35"
                    }`}
                  >
                    {isPremium ? (
                      <Building className="h-5 w-5 text-emerald-950" />
                    ) : (
                      <MapPin className="h-5 w-5 text-emerald-200" />
                    )}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ${
                      isPremium
                        ? "bg-yellow-300/10 text-gold-light ring-gold/30"
                        : "bg-emerald-400/8 text-emerald-200/80 ring-emerald-400/25"
                    }`}
                  >
                    {isHq ? dict.offices.hq : isRep ? "SCBD" : `${dict.offices.branch} ${roman(num)}`}
                  </span>
                </div>
                <h3 className={`font-display text-base font-bold leading-snug ${isPremium ? "text-gold-light" : "text-white"}`}>
                  {o.label}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-emerald-50/60">{o.address}</p>
                <div className="mt-4 space-y-1.5 border-t border-emerald-400/10 pt-4 text-xs text-emerald-50/55">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> {hours}
                  </p>
                  <a
                    href={`https://wa.me/${waNumber || "6281316516524"}?text=${encodeURIComponent(dict.hero.waGreeting)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-semibold text-emerald-100/80 transition-colors hover:text-gold-light"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> {waDisplay}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function roman(n: number): string {
  return ["", "I", "II", "III", "IV", "V", "VI", "VII"][n] ?? String(n);
}
