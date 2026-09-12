"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { useI18n } from "./locale-provider";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Pilih bahasa / Select language"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-950/50 px-3.5 py-2 text-xs font-semibold text-emerald-100/85 backdrop-blur-md transition-all hover:border-gold/50 hover:text-gold-light"
      >
        <Globe className="h-3.5 w-3.5 text-gold" />
        <span className={compact ? "hidden sm:inline" : ""}>{LOCALE_META[locale].native}</span>
        <span className={`text-[10px] text-emerald-50/40 transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="glass-strong absolute right-0 z-[95] mt-2 max-h-[320px] w-56 overflow-y-auto rounded-2xl border border-emerald-400/25 p-1.5 shadow-2xl [scrollbar-width:thin]"
            role="listbox"
            aria-label="Daftar bahasa"
          >
            {LOCALES.map((l: Locale) => {
              const active = l === locale;
              return (
                <li key={l}>
                  <button
                    onClick={() => {
                      setLocale(l);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={active}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                      active
                        ? "bg-yellow-300/10 font-bold text-gold-light"
                        : "text-emerald-50/75 hover:bg-emerald-400/10 hover:text-white"
                    }`}
                  >
                    <span>
                      {LOCALE_META[l].native}
                      <span className="block text-[10px] font-medium uppercase tracking-wider text-emerald-50/35">
                        {LOCALE_META[l].name}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0 text-gold" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
