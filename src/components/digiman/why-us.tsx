"use client";

import { motion } from "framer-motion";
import { UserRoundCheck, Timer, ShieldCheck, Handshake, Scale, BrainCircuit } from "lucide-react";

const experts = [
  "Hukum Perusahaan", "Notaris & PPAT", "Konsultan Pajak", "Akuntan Publik", "Kemenkumham",
  "OSS & BKPM", "DJKI Merek", "Halal BPJPH", "ISO Auditor", "SNI",
  "BPOM", "Web Engineer", "AI Engineer", "Digital Marketing", "HR & Ketenagakerjaan",
  "Perizinan Sektor", "Investor Relations", "Logistik & Ekspor",
];

export default function WhyUs() {
  return (
    <section className="section-padding relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Left — 46 expert orbit card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-emerald-400/20 bg-gradient-to-b from-[#0d201a] to-[#071410] p-8 sm:p-10"
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-[80px]" aria-hidden />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-300/8 blur-[80px]" aria-hidden />

            <span className="font-display gradient-text-gold text-6xl font-bold sm:text-7xl">46</span>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Dewan Pakar Lintas Bidang
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-emerald-50/60">
              Bukan satu orang, bukan satu tim — tapi 46 ahli dari hukum, perpajakan, perizinan,
              sertifikasi, hingga teknologi digital. Setiap kasus Anda langsung ditangani spesialisnya.
            </p>

            {/* Expert chips */}
            <div className="mt-8 flex max-h-64 flex-wrap gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {experts.map((e, i) => (
                <motion.span
                  key={e}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="cursor-default rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-100/80 transition-all hover:border-gold/50 hover:bg-yellow-300/10 hover:text-gold-light"
                >
                  {e}
                </motion.span>
              ))}
              <span className="rounded-full bg-gradient-to-r from-emerald-400/20 to-yellow-300/20 px-3.5 py-1.5 text-xs font-bold text-white">
                + 28 pakar lainnya
              </span>
            </div>
          </motion.div>

          {/* Right — reasons */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Kenapa Digiman
              </span>
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                Kami Tidak Hanya Mengurus Dokumen.
                <span className="gradient-text-gold"> Kami Menjaga Masa Depan Bisnis Anda.</span>
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  icon: Timer,
                  title: "Selesai 3–7 Hari Kerja",
                  desc: "Alur kerja terstandarisasi & portal monitoring status real-time — Anda selalu tahu dokumen Anda ada di tahap apa.",
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Terbit & Transparan",
                  desc: "Biaya jelas di depan tanpa biaya siluman. Dokumen tidak terbit karena kesalahan proses kami? Kami ulangi gratis.",
                },
                {
                  icon: Scale,
                  title: "Patuh Regulasi Terkini",
                  desc: "Tim kami memantau perubahan regulasi — CTA, OSS-RBA, Perpres terbaru — agar bisnis Anda selalu satu langkah aman.",
                },
                {
                  icon: Handshake,
                  title: "Pendampingan Seumur Hidup",
                  desc: "Setelah serah terima, Anda tetap bagian keluarga Digiman: konsultasi tahunan, pengingat kewajiban, dan dukungan pertumbuhan.",
                },
                {
                  icon: UserRoundCheck,
                  title: "Tanpa Anda Ke Mana-mana",
                  desc: "Proses 100% online dengan tanda tangan elektronik. Badan usaha resmi berdiri tanpa Anda meninggalkan meja kerja.",
                },
                {
                  icon: BrainCircuit,
                  title: "Langit ke-7: Otomasi Digital",
                  desc: "Hanya Digiman yang membawa Anda sampai puncak — sistem digital & AI agar bisnis berjalan bahkan saat Anda tidur.",
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="card-glow glass group rounded-3xl p-6"
                >
                  <f.icon className="mb-4 h-7 w-7 text-emerald-300 transition-transform duration-500 group-hover:scale-110 group-hover:text-gold" />
                  <h3 className="font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-50/60">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
