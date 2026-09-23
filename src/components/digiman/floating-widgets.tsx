"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { MessageCircle, ArrowUp } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

export default function FloatingWidgets({ waNumber }: { waNumber?: string }) {
  const { dict } = useI18n();
  const [showTop, setShowTop] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setShowTop(v > 600));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTip(true), 6000);
    const t2 = setTimeout(() => setShowTip(false), 14000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-[85] flex flex-col items-end gap-3 sm:right-7">
      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="glass-strong flex h-11 w-11 items-center justify-center rounded-full text-emerald-200 transition-colors hover:text-gold"
            aria-label={dict.floating.top}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp */}
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.9 }}
              className="glass-strong hidden max-w-[230px] rounded-2xl rounded-br-sm px-4 py-3 sm:block"
            >
              <p className="text-xs leading-relaxed text-emerald-50/85">
                <strong className="text-gold-light">{dict.floating.wa}</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href={`https://wa.me/${waNumber || "6281316516524"}?text=${encodeURIComponent(dict.hero.waGreeting)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp Digiman.id"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_10px_36px_-6px_rgba(52,211,153,0.7)] transition-transform hover:scale-110"
        >
          <span className="animate-pulse-ring absolute inset-0 rounded-full bg-emerald-400/60" aria-hidden />
          <MessageCircle className="relative h-7 w-7 text-emerald-950" strokeWidth={2.2} />
        </a>
      </div>
    </div>
  );
}
