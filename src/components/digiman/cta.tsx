"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Mail, MapPin, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section id="kontak" className="section-padding relative pb-24 pt-8 sm:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-emerald-400/20 p-10 text-center sm:p-16 noise-overlay"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(242,193,78,0.14), transparent 60%), radial-gradient(ellipse 70% 80% at 20% 100%, rgba(52,211,153,0.16), transparent 60%), #081712",
        }}
      >
        <div className="absolute inset-0 starfield opacity-50" aria-hidden />
        <div className="absolute -top-24 left-1/2 h-48 w-[560px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-[90px]" aria-hidden />

        <div className="relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-yellow-300/8 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold-light"
          >
            Langit ke-7 Menanti
          </motion.span>

          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Bisnis Anda Layak Berdiri{" "}
            <span className="gradient-text-gold font-display">Di Atas Awan.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-emerald-50/65 sm:text-lg">
            Ceritakan rencana Anda hari ini — besok, dewan pakar kami sudah menyusun peta pendakian
            legalitas & digitalisasi bisnis Anda. Gratis, tanpa komitmen.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/6281112345678?text=Halo%20DIGIMAN.ID,%20saya%20siap%20mendaki%20ke%207%20Lapis%20Langit%20Legalitas!"
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-btn group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-4 text-base font-bold text-emerald-950 shadow-[0_14px_44px_-10px_rgba(52,211,153,0.65)] transition-all hover:scale-[1.04]"
            >
              <MessageCircle className="h-5 w-5" />
              Chat WhatsApp Sekarang
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="mailto:halo@digiman.id?subject=Konsultasi%20Legalitas%20Bisnis"
              className="flex items-center gap-2.5 rounded-2xl border border-gold/40 bg-yellow-300/5 px-8 py-4 text-base font-semibold text-gold-light transition-all hover:bg-yellow-300/15"
            >
              <Mail className="h-5 w-5" />
              halo@digiman.id
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-emerald-50/55">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-400" /> +62 811-1234-5678
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" /> Jakarta Selatan, Indonesia
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-emerald-400" /> Respons &lt; 1×24 jam
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
