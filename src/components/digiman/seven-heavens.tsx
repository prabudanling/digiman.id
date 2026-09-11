"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileCheck2,
  ScrollText,
  Lightbulb,
  BadgeCheck,
  Landmark,
  Rocket,
  ArrowUp,
} from "lucide-react";

interface Layer {
  no: string;
  title: string;
  tagline: string;
  desc: string;
  items: string[];
  icon: React.ElementType;
  glow: string;
  peak?: boolean;
}

const layers: Layer[] = [
  {
    no: "01",
    title: "Badan Usaha & Akta Pendirian",
    tagline: "Fondasi bisnis Anda lahir secara resmi",
    desc: "Kami susun akta pendirian bersama notaris mitra, urus pengesahan Kemenkumham, sampai badan hukum Anda resmi berdiri — tanpa Anda keluar rumah.",
    items: ["PT (Perseroan Terbatas)", "CV (Persekutuan Komanditer)", "PT PMA (Modal Asing)", "PT Perorangan", "Yayasan & Perkumpulan", "Koperasi"],
    icon: Building2,
    glow: "rgba(52,211,153,0.22)",
  },
  {
    no: "02",
    title: "Legalitas Inti Perusahaan",
    tagline: "Identitas resmi di mata negara",
    desc: "Dokumen vital yang menjadi syarat membuka rekening, mengajukan kredit, dan berkontrak dengan korporasi maupun instansi pemerintah.",
    items: ["NIB (Nomor Induk Berusaha)", "NPWP Badan", "SK Pengesahan Kemenkumham", "SKDU & Domisili Usaha", "Dokumen Penunjang Lainnya"],
    icon: FileCheck2,
    glow: "rgba(45,212,191,0.22)",
  },
  {
    no: "03",
    title: "Perizinan OSS & Izin Sektor",
    tagline: "Kunci gerbang regulasi",
    desc: "Navigasi KBLI 2020 dan sistem OSS-RBA adalah labirin — dewan pakar kami memetakan izin yang benar untuk skala bisnis Anda, dari UMKM hingga korporasi.",
    items: ["OSS-RBA (Risiko Berbasis Usaha)", "Pemetaan KBLI 2020", "Izin Usaha Sektor", "SIUP & SLO", "Izin Edar & Distribusi"],
    icon: ScrollText,
    glow: "rgba(163,230,53,0.2)",
  },
  {
    no: "04",
    title: "Kekayaan Intelektual",
    tagline: "Bentengkan aset tak berwujud Anda",
    desc: "Nama brand, logo, hingga inovasi Anda adalah aset berharga. Kami pastikan terdaftar resmi dan terlindungi dari pembajakan di seluruh Indonesia.",
    items: ["Pendaftaran Merek (DJKI)", "Hak Cipta", "Paten & Paten Sederhana", "Desain Industri", "Rahasia Dagang"],
    icon: Lightbulb,
    glow: "rgba(251,191,36,0.22)",
  },
  {
    no: "05",
    title: "Sertifikasi & Standar Mutu",
    tagline: "Paspor masuk pasar modern",
    desc: "Marketplace, ritel modern, ekspor, dan tender pemerintah menuntut sertifikasi. Kami antar produk Anda melewati semua gerbang mutu.",
    items: ["Sertifikasi Halal (BPJPH)", "SNI", "ISO 9001 / 22000 / 27001", "HACCP & BPOM", "Sertifikat Ekspor"],
    icon: BadgeCheck,
    glow: "rgba(251,146,60,0.22)",
  },
  {
    no: "06",
    title: "Pajak & Keuangan",
    tagline: "Sehat secara fiskal, tenang di akhir tahun",
    desc: "46 dewan pakar kami termasuk konsultan pajak bersertifikat — memastikan bisnis Anda patuh, efisien, dan bebas dari sanksi.",
    items: ["Pelaporan SPT Tahunan & Masa", "Konsultasi Pajak", "Pembukuan & Laporan Keuangan", "Audit & Review", "Pendampingan Koreksi Pajak"],
    icon: Landmark,
    glow: "rgba(251,113,133,0.18)",
  },
  {
    no: "07",
    title: "Digitalisasi & Manajemen Bisnis",
    tagline: "Puncak langit: bisnis yang berjalan otomatis",
    desc: "Legality selesai, kini saatnya scale. Tim teknologi kami membangun website, aplikasi, sistem manajemen, hingga otomasi berbasis AI untuk bisnis Anda.",
    items: ["Website Company Profile & E-Commerce", "Aplikasi & Sistem Internal", "Sistem Manajemen Digital", "AI & Otomasi Proses", "Digital Marketing 360°"],
    icon: Rocket,
    glow: "rgba(255,233,168,0.35)",
    peak: true,
  },
];

function LayerCard({
  layer,
  index,
  onActive,
}: {
  layer: Layer;
  index: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-42% 0px -42% 0px" });
  const Icon = layer.icon;

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="relative py-6 lg:py-8">
      <motion.div
        animate={{
          scale: inView ? 1 : 0.94,
          opacity: inView ? 1 : 0.35,
          filter: inView ? "blur(0px)" : "blur(1.5px)",
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`glass relative overflow-hidden rounded-[2rem] p-7 sm:p-10 ${
          layer.peak ? "border-gold/40" : ""
        }`}
        style={{ boxShadow: inView ? `0 0 90px -20px ${layer.glow}` : "none" }}
      >
        {layer.peak && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-emerald-400/10" aria-hidden />
        )}
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className={`font-display text-5xl font-bold sm:text-6xl ${
                layer.peak ? "gradient-text-gold" : "text-emerald-400/25"
              }`}
            >
              {layer.no}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{layer.title}</h3>
            <p className={`mt-1.5 text-sm font-semibold uppercase tracking-[0.18em] ${layer.peak ? "text-gold-light" : "text-emerald-300/80"}`}>
              {layer.tagline}
            </p>
          </div>
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:h-20 sm:w-20 ${
              layer.peak
                ? "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_44px_rgba(242,193,78,0.5)]"
                : "bg-gradient-to-br from-emerald-400/30 to-teal-600/15 ring-1 ring-emerald-400/40"
            }`}
          >
            <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${layer.peak ? "text-emerald-950" : "text-emerald-200"}`} />
          </div>
        </div>
        <p className="relative mt-5 max-w-2xl leading-relaxed text-emerald-50/70">{layer.desc}</p>
        <div className="relative mt-6 flex flex-wrap gap-2">
          {layer.items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium sm:text-sm ${
                layer.peak
                  ? "border-gold/40 bg-yellow-300/10 text-gold-light"
                  : "border-emerald-400/25 bg-emerald-400/5 text-emerald-100/85"
              }`}
            >
              {item}
            </motion.span>
          ))}
        </div>
        <div className="relative mt-7 flex items-center gap-2 text-xs text-emerald-50/40">
          <span>Lapis {index + 1} dari 7</span>
          <ArrowUp className="h-3.5 w-3.5 text-gold/70" aria-hidden />
        </div>
      </motion.div>
    </div>
  );
}

export default function SevenHeavens() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.6", "end 0.7"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const handleActive = (i: number) => setActive(i);

  return (
    <section id="tujuh-langit" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="absolute inset-0 starfield opacity-40" aria-hidden />
      <div className="section-padding mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-20"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-yellow-300/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold-light">
            Konsep Digiman
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Perjalanan Naik{" "}
            <span className="gradient-text-gold font-display">7 Lapis Langit</span>{" "}
            Legalitas Bisnis
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">
            Setiap bisnis adalah pendakian. Kami adalah tim Sherpa Anda — melalui tujuh lapis langit
            regulasi Indonesia, dari akta pendirian di lantai dasar hingga puncak digitalisasi di langit
            ketujuh. Gulir dan rasakan perjalanannya.
          </p>
        </motion.div>

        <div className="relative lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* Sticky visual (desktop) */}
          <div className="sticky top-24 hidden h-[70vh] self-start lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col justify-center overflow-hidden rounded-[2.5rem] border border-emerald-400/15 p-10"
                style={{
                  background: `radial-gradient(ellipse at 30% 20%, ${layers[active].glow}, rgba(6,14,11,0.9) 65%)`,
                }}
              >
                {(() => {
                  const Icon = layers[active].icon;
                  return (
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-3xl ${
                        layers[active].peak
                          ? "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_60px_rgba(242,193,78,0.55)]"
                          : "bg-emerald-400/15 ring-1 ring-emerald-300/40"
                      }`}
                    >
                      <Icon className={`h-12 w-12 ${layers[active].peak ? "text-emerald-950" : "text-emerald-200"}`} />
                    </div>
                  );
                })()}
                <span className="gradient-text-gold font-display mt-8 text-[7rem] font-bold leading-none">
                  {layers[active].no}
                </span>
                <h3 className="mt-2 text-3xl font-bold text-white">{layers[active].title}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                  {layers[active].tagline}
                </p>
                <p className="mt-5 leading-relaxed text-emerald-50/60">{layers[active].desc}</p>

                <div className="mt-8 flex gap-1.5" aria-hidden>
                  {layers.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === active ? "w-10 bg-gradient-to-r from-emerald-400 to-gold" : "w-4 bg-emerald-400/25"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cards + progress line */}
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-emerald-400/12 sm:block lg:left-0" aria-hidden>
              <motion.div
                className="w-px origin-top bg-gradient-to-b from-emerald-400 via-yellow-300 to-gold"
                style={{ height: "100%", scaleY: lineScale }}
              />
            </div>
            <div className="space-y-2 sm:pl-10 lg:pl-2">
              {layers.map((layer, i) => (
                <LayerCard key={layer.no} layer={layer} index={i} onActive={handleActive} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
