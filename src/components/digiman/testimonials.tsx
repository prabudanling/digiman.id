"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";
import { testiC } from "@/lib/i18n";

export interface TestimonialItem {
  slug: string | null;
  name: string;
  role: string;
  text: string;
}

interface T extends TestimonialItem {
  initials: string;
  localized: string;
}

function Card({ t }: { t: T }) {
  return (
    <div className="glass card-glow w-[340px] shrink-0 rounded-3xl p-6 sm:w-[400px]">
      <div className="mb-4 flex items-center gap-1" aria-label="Rating 5 dari 5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold text-gold" />
        ))}
      </div>
      <Quote className="mb-3 h-5 w-5 text-emerald-400/50" />
      <p className="text-sm leading-relaxed text-emerald-50/75">&ldquo;{t.localized}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-emerald-400/10 pt-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 font-display text-sm font-bold text-emerald-950">
          {t.initials}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{t.name}</div>
          <div className="text-xs text-emerald-50/50">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ items }: { items?: TestimonialItem[] }) {
  const { dict, locale } = useI18n();
  const source = items ?? [];
  const half = Math.ceil(source.length / 2);
  const withInitials: T[] = source.map((t) => ({
    ...t,
    localized: testiC(t, dict, locale).text,
    initials: t.name
      .replace(/^dr\.\s*/i, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join(""),
  }));
  const rowA = withInitials.slice(0, half);
  const rowB = withInitials.slice(half);
  const finalRowB = rowB.length > 0 ? rowB : rowA;

  return (
    <section id="testimoni" className="relative overflow-hidden py-24 sm:py-32">
      <div className="section-padding mx-auto mb-14 max-w-3xl text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {dict.testi.kicker}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {dict.testi.heading.split(" ").slice(0, -2).join(" ")} {" "}
            <span className="gradient-text-gold">{dict.testi.heading.split(" ").slice(-2).join(" ")}</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">
            {dict.testi.sub}
          </p>
        </motion.div>
      </div>

      <div className="marquee-paused space-y-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee-fast gap-6 pr-6">
          {[...rowA, ...rowA].map((t, i) => (
            <Card key={`a-${i}`} t={t} />
          ))}
        </div>
        <div className="flex w-max animate-marquee-reverse gap-6 pr-6">
          {[...finalRowB, ...finalRowB].map((t, i) => (
            <Card key={`b-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
