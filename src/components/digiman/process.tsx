"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MessagesSquare, FolderCheck, FileSignature, PartyPopper } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

const STEP_ICONS = [MessagesSquare, FolderCheck, FileSignature, PartyPopper];

export default function Process() {
  const { dict } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const steps = dict.process.steps.map((s, i) => ({ ...s, no: String(i + 1).padStart(2, "0"), icon: STEP_ICONS[i] }));

  return (
    <section id="proses" className="section-padding relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-yellow-400/6 blur-[130px]"
      />
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {dict.process.kicker}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {dict.process.headingA}{" "}
            <span className="gradient-text-emerald">{dict.process.headingB}</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">
            {dict.process.sub}
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          {/* Vertical line */}
          <div className="absolute bottom-8 left-[26px] top-2 w-px bg-emerald-400/12 sm:left-1/2" aria-hidden>
            <motion.div
              className="h-full w-px origin-top bg-gradient-to-b from-emerald-400 via-yellow-300 to-gold"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-12">
            {steps.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={s.no}
                  initial={{ opacity: 0, y: 40, x: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex gap-6 sm:w-1/2 ${
                    left ? "sm:pr-14" : "sm:ml-auto sm:pl-14"
                  } pl-16 sm:pl-0 ${left ? "" : "sm:pl-14"}`}
                >
                  {/* Node */}
                  <div
                    className={`absolute left-0 top-1 flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-emerald-400/35 bg-[#0a1613] shadow-[0_0_24px_rgba(52,211,153,0.25)] ${
                      left ? "sm:left-auto sm:-right-[27px]" : "sm:-left-[27px]"
                    }`}
                  >
                    <s.icon className="h-6 w-6 text-emerald-300" />
                  </div>

                  <div className="card-glow glass w-full rounded-3xl p-7">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-display text-3xl font-bold text-emerald-400/30">{s.no}</span>
                      <span className="rounded-full border border-gold/35 bg-yellow-300/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-light">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-emerald-50/60">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
