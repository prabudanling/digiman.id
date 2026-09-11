"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface T {
  name: string;
  role: string;
  text: string;
  initials: string;
}

const rowA: T[] = [
  {
    name: "Rendra Wijaya",
    role: "Founder, Kopi Nusantara Rasa",
    text: "Dari NIB sampai sertifikasi halal, semua beres dalam 9 hari. Tim Digiman bahkan membantu saya memilih KBLI yang bikin saya dapat cuti pajak UMKM. Luar biasa detail.",
    initials: "RW",
  },
  {
    name: "Sandra Halim",
    role: "Owner, CV Sinar Teknik",
    text: "Pendiriannya cuma 4 hari dan saya tidak pernah keluar kantor. Portal monitoring-nya bikin saya tenang karena selalu tahu dokumen saya sedang di mana.",
    initials: "SH",
  },
  {
    name: "Michael Tanaka",
    role: "Director, Sakura Digital PMA",
    text: "Sebagai investor asing, regulasi Indonesia terasa rumit. Digiman memegang semuanya — BKPM, OSS, sampai laporan berkala. Highly recommended.",
    initials: "MT",
  },
  {
    name: "dr. Amelinda Putri",
    role: "Founder, Klinik Sehat Bersama",
    text: "Izin operasional klinik itu rumit. Dewan pakar mereka paham banget alur Dinkes dan BPOM. Pendampingannya sampai klinik kami benar-benar beroperasi.",
    initials: "AP",
  },
  {
    name: "Bagas Prakoso",
    role: "CEO, LogistikPro PT",
    text: "Garansi terbitnya bukan gimmick. Ada revisi dokumen dari notaris, mereka ulangi proses tanpa biaya tambahan dan tetap tepat waktu.",
    initials: "BP",
  },
];

const rowB: T[] = [
  {
    name: "Lestari Ningsih",
    role: "Owner, Batik Larasati",
    text: "Merek saya sempat hampir dibajak kompetitor. Untung pendaftaran DJKI lewat Digiman sudah jalan duluan. Sekarang brand saya aman total.",
    initials: "LN",
  },
  {
    name: "Yusuf Ramadhan",
    role: "Founder, EduSkill Academy",
    text: "Langit ke-7 mereka nyata: website + sistem manajemen siswa + otomasi marketing. Sekarang pendaftaran murid jalan sendiri 24 jam.",
    initials: "YR",
  },
  {
    name: "Clara Suryani",
    role: "Managing Partner, CS Consulting",
    text: "Saya langganan urus SPT klien-klien saya di sini. Konsultan pajaknya benar-benar bersertifikat dan fast response. 5 tahun tidak pernah telat lapor.",
    initials: "CS",
  },
  {
    name: "Hendra Gunawan",
    role: "Owner, Gudang Makan Sehat",
    text: "Sertifikasi halal + SNI selesai tanpa saya pusing. Harganya transparan dari awal, tidak ada biaya siluman seperti pengalaman saya di tempat lain.",
    initials: "HG",
  },
  {
    name: "Nadia Kusuma",
    role: "Co-Founder, Glowlab Skincare",
    text: "BPOM, merek, sampai website e-commerce semua ditangani satu tim. Koordinasinya gampang karena satu penanggung jawab akun.",
    initials: "NK",
  },
];

function Card({ t }: { t: T }) {
  return (
    <div className="glass card-glow w-[340px] shrink-0 rounded-3xl p-6 sm:w-[400px]">
      <div className="mb-4 flex items-center gap-1" aria-label="Rating 5 dari 5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold text-gold" />
        ))}
      </div>
      <Quote className="mb-3 h-5 w-5 text-emerald-400/50" />
      <p className="text-sm leading-relaxed text-emerald-50/75">&ldquo;{t.text}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-emerald-400/10 pt-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 font-display text-sm font-bold text-emerald-950">
          {t.initials}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{t.name}</div>
          <div className="text-xs text-emerald-50/50">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimoni" className="relative overflow-hidden py-24 sm:py-32">
      <div className="section-padding mx-auto mb-14 max-w-3xl text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Testimoni
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            2.500+ Pendaki Sudah{" "}
            <span className="gradient-text-gold">Sampai Puncak</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60 sm:text-lg">
            UMKM, startup, klinik, pabrik, hingga perusahaan asing — mereka naik bersama kami.
          </p>
        </motion.div>
      </div>

      <div className="marquee-paused space-y-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee-fast gap-6 pr-6">
          {[...rowA, ...rowA].map((t, i) => (
            <Card key={`a-${i}`} t={t} />
          ))}
        </div>
        <div className="flex w-max animate-marquee-reverse gap-6 pr-6">
          {[...rowB, ...rowB].map((t, i) => (
            <Card key={`b-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
