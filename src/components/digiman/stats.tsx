"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, Layers, HeartHandshake } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

function Counter({ target, suffix }: { target: number; suffix?: string }) {
  const { locale } = useI18n();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString(locale === "id" ? "id-ID" : locale)}
      {suffix}
    </span>
  );
}

const STAT_ICONS = [Building2, Users, Layers, HeartHandshake];

export default function Stats({
  clients,
  experts,
  layers,
  success,
}: {
  clients?: number;
  experts?: number;
  layers?: number;
  success?: number;
}) {
  const { dict, locale } = useI18n();
  const meta = [dict.stats.clients, dict.stats.experts, dict.stats.layers, dict.stats.success];
  const values = [clients, experts, layers, success];
  const stats = STAT_ICONS.map((icon, i) => ({
    icon,
    value: typeof values[i] === "number" && values[i]! >= 0 ? values[i]! : [2500, 46, 7, 98][i],
    suffix: ["+", "", "", "%"][i],
    label: meta[i].label,
    note: meta[i].note,
  }));
  return (
    <section className="section-padding relative py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="card-glow glass group rounded-3xl p-6 sm:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-emerald-600/10 ring-1 ring-emerald-400/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <s.icon className="h-6 w-6 text-emerald-300" />
            </div>
            <div className="font-display text-4xl font-bold text-white sm:text-5xl">
              <Counter target={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm font-semibold text-emerald-100/90">{s.label}</div>
            <div className="mt-1 text-xs text-emerald-50/45">{s.note}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
