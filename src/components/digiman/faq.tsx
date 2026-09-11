"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "Berapa lama proses pendirian PT sampai resmi beroperasi?",
    a: "Rata-rata 3–7 hari kerja sejak dokumen lengkap dan akta ditandatangani. Proses mencakup akta notaris, pengesahan SK Kemenkumham (biasanya real-time atau 1 hari), penerbitan NPWP badan, dan NIB via OSS. Untuk izin sektor tertentu (kesehatan, logistik, makanan) dapat memakan waktu tambahan — estimasi detail selalu kami berikan di awal, gratis.",
  },
  {
    q: "Apa saja yang saya siapkan untuk mendirikan perusahaan?",
    a: "Cukup: KTP & NPWP para pendiri (dan pemegang saham), alamat email aktif, nomor HP, serta alamat usaha (bisa rumah — kami bantu atur domisili). Untuk PT PMA diperlukan paspor asing dan surat pernyataan modal. Selebihnya — penyusunan akta, KBLI, hingga pengurusan online — tim kami yang mengerjakan.",
  },
  {
    q: "Apakah bisa mendirikan perusahaan tanpa datang ke kantor?",
    a: "Bisa, 100% online. Dengan tanda tangan elektronik tersertifikasi (TTE) yang diakui Kemenkumham, akta dan pengesahan dapat dilakukan tanpa tatap muka. Dokumen asli kami kirim ke alamat Anda via kurir terjamin, atau Anda ambil di kantor kami di Jakarta.",
  },
  {
    q: "Apakah ada biaya tersembunyi di tengah proses?",
    a: "Tidak. Semua biaya — honor notaris, resi Kemenkumham, administrasi pemerintahan, hingga jasa kami — tertulis jelas dalam penawaran sebelum Anda setuju. Jika ada kebutuhan di luar scope (misal izin sektor tambahan), kami konfirmasi dulu sebelum melanjutkan. Ini komitmen transparansi Digiman.",
  },
  {
    q: "Apa yang dimaksud 'Garansi Terbit'?",
    a: "Jika dokumen tidak terbit karena kesalahan proses atau administrasi pihak kami, seluruh tahap yang bermasalah kami ulangi tanpa biaya tambahan, plus kompensasi penundaan. Selama 5 tahun operasi, 99,2% dokumen kami terbit sesuai jadwal — sisanya karena perubahan regulasi mendadak yang selalu kami antisipasi dan komunikasikan.",
  },
  {
    q: "Bagaimana cara mulai konsultasi? Apakah berbayar?",
    a: "Gratis. Klik tombol WhatsApp di halaman ini atau isi form kontak — dalam 1×24 jam Anda terhubung dengan dewan pakar sesuai bidang bisnis Anda. Kami akan memetakan kebutuhan legalitas, merekomendasikan bentuk badan usaha yang paling efisien secara pajak, dan memberi estimasi biaya & waktu. Tanpa komitmen apa pun.",
  },
];

export default function Faq({ faqs: propFaqs }: { faqs?: FaqItem[] }) {
  const faqs = propFaqs && propFaqs.length > 0 ? propFaqs : DEFAULT_FAQS;
  return (
    <section id="faq" className="section-padding relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Pertanyaan yang{" "}
            <span className="gradient-text-emerald">Sering Diajukan</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60">
            Belum menemukan jawabannya? Tim kami siap menjawab via WhatsApp — gratis, tentu saja.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass overflow-hidden rounded-2xl border-none px-6"
              >
                <AccordionTrigger className="py-5 text-left font-semibold text-white hover:text-gold-light hover:no-underline [&>svg]:text-emerald-300">
                  <span className="mr-3 font-display text-sm text-emerald-400/60">{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 leading-relaxed text-emerald-50/65">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
