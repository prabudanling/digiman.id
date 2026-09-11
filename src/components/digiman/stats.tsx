"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, Layers, HeartHandshake } from "lucide-react";

function Counter({ target, suffix }: { target: number; suffix?: string }) {
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
      {val.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

const stats = [
  { icon: Building2, value: 2500, suffix: "+", label: "Perusahaan Didasarkan", note: "PT, CV, PMA & lainnya" },
  { icon: Users, value: 46, suffix: "", label: "Dewan Pakar Lintas Bidang", note: "Hukum, pajak, digital" },
  { icon: Layers, value: 7, suffix: "", label: "Lapis Layanan Terpadu", note: "Dari akta sampai digital" },
  { icon: HeartHandshake, value: 98, suffix: "%", label: "Klien Merekomendasikan", note: "Rating 4.9 / 5.0" },
];

export default function Stats() {
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
