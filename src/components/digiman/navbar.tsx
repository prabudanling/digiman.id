"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";
import LanguageSwitcher from "@/components/i18n/language-switcher";

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 40)), [scrollY]);

  const links = [
    { href: "#beranda", label: dict.nav.home },
    { href: "#tujuh-langit", label: dict.nav.seven },
    { href: "#layanan", label: dict.nav.services },
    { href: "#struktur", label: dict.nav.structure },
    { href: "#proses", label: dict.nav.process },
    { href: "#testimoni", label: dict.nav.testimonials },
    { href: "#faq", label: dict.nav.faq },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[80]"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8 ${
            scrolled
              ? "glass-strong my-3 rounded-2xl py-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] md:mx-4 xl:mx-auto"
              : "py-5"
          }`}
        >
          {/* Logo */}
          <a href="#beranda" className="group flex items-center gap-2.5" aria-label="Digiman.id beranda">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#071410]/70 ring-1 ring-gold/45 shadow-[0_0_26px_rgba(242,193,78,0.35)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
              { }
              <img
                src={logoUrl || "/logo-emblem.png"}
                alt="Logo PT Digital Bisnis Manajemen"
                className="h-9 w-9 object-contain"
              />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              DIGIMAN<span className="text-gold">.ID</span>
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-emerald-50/70 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-emerald-400 to-yellow-300 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <a
              href="#kontak"
              className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-[0_8px_30px_-8px_rgba(242,193,78,0.6)] transition-all hover:shadow-[0_10px_40px_-6px_rgba(242,193,78,0.8)] hover:brightness-110 sm:flex"
            >
              {dict.nav.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-950/60 text-emerald-100 lg:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed inset-x-4 top-24 z-[79] rounded-3xl p-6 lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-xl px-4 py-3.5 text-base font-medium text-emerald-50/85 transition-colors hover:bg-emerald-400/10 hover:text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#kontak"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-5 py-4 text-base font-bold text-emerald-950"
              >
                {dict.nav.cta} <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
