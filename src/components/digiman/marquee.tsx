"use client";

import { Sparkle } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

export default function Marquee() {
  const { dict } = useI18n();
  const items = dict.marquee;
  const row = [...items, ...items];
  return (
    <div className="marquee-paused relative border-y border-emerald-400/15 bg-[#071410]/80 py-5 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050d0a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050d0a] to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100/75">
              {item}
            </span>
            <Sparkle className="h-3.5 w-3.5 fill-gold/70 text-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
