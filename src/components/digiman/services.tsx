"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Globe2,
  Stamp,
  Lightbulb,
  Rocket,
  FileCheck2,
  ScrollText,
  BadgeCheck,
  Landmark,
  Briefcase,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Cpu,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import TiltCard from "./tilt-card";

export interface ServiceItem {
  title: string;
  desc: string;
  price: string;
  items: string[];
  icon: string; // nama ikon lucide
  featured: boolean;
}

const ICONS: Record<string, typeof Building2> = {
  Building2,
  Users,
  Globe2,
  Stamp,
  Lightbulb,
  Rocket,
  FileCheck2,
  ScrollText,
  BadgeCheck,
  Landmark,
  Briefcase,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Cpu,
  BarChart3,
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    icon: "Building2",
    title: "Pendirian PT",
    desc: "Akta notaris, SK Kemenkumham, NPWP, NIB — paket lengkap PT resmi berdiri dalam hitungan hari.",
    items: ["Akta Notaris + SK Kemenkumham", "NPWP & NIB otomatis", "Domisili usaha", "Gratis konsultasi KBLI"],
    price: "Mulai Rp 3,5 jt",
    featured: true,
  },
  {
    icon: "Users",
    title: "Pendirian CV",
    desc: "Pilihan ideal usaha keluarga & kemitraan. Cepat, murah, dan sah di mata hukum.",
    items: ["Akta notaris CV", "Pengesahan kehakiman", "NPWP & NIB", "Konsultasi struktur modal"],
    price: "Mulai Rp 1,8 jt",
  },
  {
    icon: "Globe2",
    title: "PT PMA (Modal Asing)",
    desc: "Berinvestasi di Indonesia? Kami pegang seluruh regulasi BKPM & OSS untuk Anda.",
    items: ["Struktur saham asing", "Laporan BKPM/OSS", "Izin investasi", "Pendampingan DGT & Bank"],
    price: "Mulai Rp 15 jt",
  },
  {
    icon: "Stamp",
    title: "NIB, OSS & Izin Sektor",
    desc: "Pemetaan KBLI presisi + pengurusan izin usaha di sistem OSS-RBA sampai terbit.",
    items: ["OSS-RBA & perizinan berusaha", "Izin sektor spesifik", "SIUP, SLO, izin edar", "Rekomendasi KBLI terbaik"],
    price: "Mulai Rp 750 rb",
  },
  {
    icon: "Lightbulb",
    title: "Merek, Hak Cipta & Paten",
    desc: "Amankan brand Anda sebelum orang lain. Cek ketersediaan + pengajuan ke DJKI.",
    items: ["Pencarian & analisis merek", "Pengajuan kelas Nice", "Hak cipta & paten", "Monitoring status pendaftaran"],
    price: "Mulai Rp 1,5 jt",
  },
  {
    icon: "Rocket",
    title: "Digitalisasi Bisnis",
    desc: "Website, aplikasi, sistem manajemen & otomasi AI — langit ke-7 menuju bisnis yang skala.",
    items: ["Website & e-commerce", "Aplikasi & sistem internal", "Otomasi berbasis AI", "Digital marketing 360°"],
    price: "Konsultasi custom",
  },
];

export default function Services({ items }: { items?: ServiceItem[] }) {
  const services = items && items.length > 0 ? items : DEFAULT_SERVICES;
  return (
    <section id="layanan" className="section-padding relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-[140px]"
      />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Layanan Kami
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Semua Legalitas,{" "}
            <span className="gradient-text-emerald">Satu Atap</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">
            Dari UMKM yang baru memulai, hingga korporasi dan investor asing — pilih layanan,
            kami yang berjalan menaungi seluruh birokrasinya.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="group h-full [perspective:900px]">
                <div
                  className={`card-glow relative flex h-full flex-col rounded-[1.75rem] p-7 ${
                    s.featured
                      ? "border border-gold/45 bg-gradient-to-b from-[#12241d] to-[#0a1613] shadow-[0_0_50px_-18px_rgba(242,193,78,0.35)]"
                      : "glass"
                  }`}
                >
                  {s.featured && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 shadow-lg">
                      Terpopuler
                    </span>
                  )}
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${
                      s.featured
                        ? "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_30px_rgba(242,193,78,0.4)]"
                        : "bg-gradient-to-br from-emerald-400/25 to-teal-600/10 ring-1 ring-emerald-400/35"
                    }`}
                  >
                    {(() => {
                      const Ikon = ICONS[s.icon] ?? Building2;
                      return <Ikon className={`h-7 w-7 ${s.featured ? "text-emerald-950" : "text-emerald-200"}`} />;
                    })()}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-emerald-50/60">{s.desc}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-sm text-emerald-50/75">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-emerald-400/10 pt-5">
                    <span className={`font-display text-sm font-bold ${s.featured ? "text-gold-light" : "text-emerald-300"}`}>
                      {s.price}
                    </span>
                    <a
                      href="#kontak"
                      className="flex items-center gap-1 text-sm font-semibold text-emerald-100/70 transition-colors group-hover:text-gold"
                      aria-label={`Pesan layanan ${s.title}`}
                    >
                      Pesan
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
