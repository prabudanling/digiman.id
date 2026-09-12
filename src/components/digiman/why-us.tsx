"use client";

import { motion } from "framer-motion";
import { UserRoundCheck, Timer, ShieldCheck, Handshake, Scale, BrainCircuit } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

const REASON_ICONS = [Timer, ShieldCheck, Scale, Handshake, UserRoundCheck, BrainCircuit];

export default function WhyUs() {
  const { dict } = useI18n();
  return (
    <section className="section-padding relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Left — 46 expert orbit card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-emerald-400/20 bg-gradient-to-b from-[#0d201a] to-[#071410] p-8 sm:p-10"
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-[80px]" aria-hidden />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-300/8 blur-[80px]" aria-hidden />

            <span className="font-display gradient-text-gold text-6xl font-bold sm:text-7xl">46</span>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {dict.why.expertTitle}
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-emerald-50/60">
              {dict.why.expertDesc}
            </p>

            {/* Expert chips */}
            <div className="mt-8 flex max-h-64 flex-wrap gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {dict.why.chips.map((e, i) => (
                <motion.span
                  key={e}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="cursor-default rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-100/80 transition-all hover:border-gold/50 hover:bg-yellow-300/10 hover:text-gold-light"
                >
                  {e}
                </motion.span>
              ))}
              <span className="rounded-full bg-gradient-to-r from-emerald-400/20 to-yellow-300/20 px-3.5 py-1.5 text-xs font-bold text-white">
                {dict.why.expertMore}
              </span>
            </div>
          </motion.div>

          {/* Right — reasons */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                {dict.why.kicker}
              </span>
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                {dict.why.headingA}
                <span className="gradient-text-gold"> {dict.why.headingB}</span>
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {dict.why.reasons.map((f, i) => {
                const Icon = REASON_ICONS[i % REASON_ICONS.length];
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="card-glow glass group rounded-3xl p-6"
                  >
                    <Icon className="mb-4 h-7 w-7 text-emerald-300 transition-transform duration-500 group-hover:scale-110 group-hover:text-gold" />
                    <h3 className="font-bold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-50/60">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
