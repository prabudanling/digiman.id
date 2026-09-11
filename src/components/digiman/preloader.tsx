"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letters = "DIGIMAN.ID".split("");

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const dur = 1600;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / dur) * 100));
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050d0a]"
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="absolute inset-0 starfield opacity-60" />
          <motion.div
            className="absolute h-72 w-72 rounded-full bg-emerald-500/15 blur-[90px]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            { }
            <img
              src="/logo-emblem.png"
              alt="Logo PT Digital Bisnis Manajemen"
              className="animate-floaty h-24 w-24 object-contain drop-shadow-[0_0_30px_rgba(242,193,78,0.55)]"
            />
          </motion.div>

          <div className="relative flex items-end overflow-hidden">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: 70, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`font-display text-4xl font-bold tracking-tight sm:text-6xl ${
                  i >= 8 ? "text-gold" : "text-emerald-300"
                }`}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-3 text-[11px] font-medium uppercase tracking-[0.5em] text-emerald-100/50"
          >
            Digital Bisnis Manajemen
          </motion.p>

          <div className="relative mt-10 h-[3px] w-56 overflow-hidden rounded-full bg-emerald-950">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-yellow-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mt-3 font-display text-sm text-gold-light/80 tabular-nums">{progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
