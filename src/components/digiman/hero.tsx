"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, ChevronDown, Sparkles, Star } from "lucide-react";
import ParticleField from "./particle-field";

const rotating = ["Pendirian PT", "Pendirian CV", "PT PMA", "NIB & OSS", "Pendaftaran Merek", "Sertifikasi Halal", "Digitalisasi Bisnis"];

const badges = [
  { label: "PT", x: "8%", y: "22%", delay: 0 },
  { label: "CV", x: "86%", y: "18%", delay: 0.8 },
  { label: "NIB", x: "12%", y: "62%", delay: 1.6 },
  { label: "NPWP", x: "88%", y: "58%", delay: 2.4 },
  { label: "MEREK™", x: "78%", y: "80%", delay: 3.2 },
  { label: "HALAL", x: "20%", y: "84%", delay: 4 },
];

const headline = ["Naikkan", "Bisnis", "Anda", "ke", "7", "Lapis", "Langit", "Legalitas."];

export default function Hero({ waNumber }: { waNumber?: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const orbX = useTransform(sx, (v) => v * 40);
  const orbY = useTransform(sy, (v) => v * 40);
  const orbX2 = useTransform(sx, (v) => v * -55);
  const orbY2 = useTransform(sy, (v) => v * -55);
  const badgeX = useTransform(sx, (v) => v * 18);
  const badgeY = useTransform(sy, (v) => v * 18);

  const { scrollYProgress } = useScroll();
  const heroFade = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroRise = useTransform(scrollYProgress, [0, 0.08], [0, -120]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2300);
    const iv = setInterval(() => setWordIndex((i) => (i + 1) % rotating.length), 2400);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <section id="beranda" className="relative flex min-h-screen items-center overflow-hidden noise-overlay">
      {/* Backdrops */}
      <div className="absolute inset-0 starfield opacity-70" aria-hidden />
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <motion.div
        aria-hidden
        style={{ x: orbX, y: orbY }}
        className="animate-aurora absolute -top-32 left-[8%] h-[480px] w-[480px] rounded-full bg-emerald-500/20 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={{ x: orbX2, y: orbY2 }}
        className="animate-aurora-rev absolute bottom-[-10%] right-[5%] h-[520px] w-[520px] rounded-full bg-yellow-500/14 blur-[140px]"
      />
      <ParticleField />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050d0a] to-transparent" aria-hidden />

      {/* Floating document badges */}
      <motion.div aria-hidden style={{ x: badgeX, y: badgeY }} className="pointer-events-none absolute inset-0 hidden md:block">
        {badges.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2.6 + i * 0.15, type: "spring", stiffness: 160, damping: 14 }}
            className="absolute"
            style={{ left: b.x, top: b.y }}
          >
            <div
              className="animate-floaty glass flex items-center gap-1.5 rounded-2xl px-4 py-2.5"
              style={{ animationDelay: `${b.delay * 0.4}s` }}
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="font-display text-sm font-semibold tracking-wide text-emerald-50">{b.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity: heroFade, y: heroRise }} className="section-padding relative z-10 mx-auto w-full max-w-7xl pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-950/50 px-5 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/90">
            PT Digital Bisnis Manajemen
          </span>
        </motion.div>

        <h1 className="mx-auto max-w-5xl text-center text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {headline.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 44, rotateX: -60 }}
              animate={mounted ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ delay: 2.4 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`mr-[0.28em] inline-block ${
                w === "7" ? "gradient-text-gold font-display" : ""
              } ${w === "Legalitas." ? "gradient-text-emerald" : ""}`}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        {/* Rotating service word */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 3.3 }}
          className="mx-auto mt-6 flex h-9 items-center justify-center gap-2 text-center"
        >
          <span className="text-lg text-emerald-100/70 sm:text-xl">Mulai dari</span>
          <span className="relative inline-flex h-9 min-w-[220px] items-center justify-center overflow-hidden sm:min-w-[280px]">
            {rotating.map((r, i) => (
              <motion.span
                key={r}
                className="absolute font-display text-lg font-bold text-gold-light sm:text-xl"
                initial={false}
                animate={
                  i === wordIndex
                    ? { y: 0, opacity: 1, filter: "blur(0px)" }
                    : { y: i < wordIndex ? -36 : 36, opacity: 0, filter: "blur(4px)" }
                }
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {r}
              </motion.span>
            ))}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.45, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-emerald-50/65 sm:text-lg"
        >
          Satu pintu untuk <strong className="font-semibold text-emerald-200">seluruh legalitas perusahaan di Indonesia</strong> —
          dari akta pendirian, perizinan OSS, kekayaan intelektual, hingga transformasi digital. Didampingi{" "}
          <strong className="font-semibold text-gold-light">46 dewan pakar lintas bidang</strong>, proses transparan, garansi di tangan.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.6, duration: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#kontak"
            className="shimmer-btn group relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-4 text-base font-bold text-emerald-950 shadow-[0_14px_44px_-10px_rgba(52,211,153,0.65)] transition-all hover:scale-[1.04] hover:shadow-[0_18px_54px_-8px_rgba(52,211,153,0.85)]"
          >
            Mulai Pendirian Sekarang
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={`https://wa.me/${waNumber || "6281333397223"}?text=Halo%20DIGIMAN.ID,%20saya%20ingin%20konsultasi%20legalitas%20bisnis`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-950/40 px-8 py-4 text-base font-semibold text-emerald-100 backdrop-blur-md transition-all hover:border-gold/60 hover:bg-emerald-900/40 hover:text-gold-light"
          >
            <MessageCircle className="h-5 w-5 text-gold" />
            Chat Dewan Pakar
          </a>
        </motion.div>

        {/* Mini trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 3.85 }}
          className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-emerald-50/55"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Resmi & Terdaftar AHU Kemenkumham
          </span>
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-gold text-gold" /> 4.9/5 dari 2.500+ klien
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" /> Selesai 3–7 hari kerja
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#tujuh-langit"
        aria-label="Gulir ke bawah"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 4.2 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-emerald-100/50 transition-colors hover:text-gold">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">Menjelajah</span>
          <ChevronDown className="animate-bounce-soft h-5 w-5" />
        </div>
      </motion.a>
    </section>
  );
}
