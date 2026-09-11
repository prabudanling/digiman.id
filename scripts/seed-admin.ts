/**
 * Seed data awal admin panel DIGIMAN.ID
 * Idempoten: hanya mengisi tabel yang masih kosong.
 * Jalankan: bun run scripts/seed-admin.ts
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const SERVICES = [
  {
    title: "Pendirian PT",
    desc: "Akta notaris, SK Kemenkumham, NPWP, NIB — paket lengkap PT resmi berdiri dalam hitungan hari.",
    price: "Mulai Rp 3,5 jt",
    features: ["Akta Notaris + SK Kemenkumham", "NPWP & NIB otomatis", "Domisili usaha", "Gratis konsultasi KBLI"],
    icon: "Building2",
    featured: true,
    order: 0,
  },
  {
    title: "Pendirian CV",
    desc: "Pilihan ideal usaha keluarga & kemitraan. Cepat, murah, dan sah di mata hukum.",
    price: "Mulai Rp 1,8 jt",
    features: ["Akta notaris CV", "Pengesahan kehakiman", "NPWP & NIB", "Konsultasi struktur modal"],
    icon: "Users",
    featured: false,
    order: 1,
  },
  {
    title: "PT PMA (Modal Asing)",
    desc: "Berinvestasi di Indonesia? Kami pegang seluruh regulasi BKPM & OSS untuk Anda.",
    price: "Mulai Rp 15 jt",
    features: ["Struktur saham asing", "Laporan BKPM/OSS", "Izin investasi", "Pendampingan DGT & Bank"],
    icon: "Globe2",
    featured: false,
    order: 2,
  },
  {
    title: "NIB, OSS & Izin Sektor",
    desc: "Pemetaan KBLI presisi + pengurusan izin usaha di sistem OSS-RBA sampai terbit.",
    price: "Mulai Rp 750 rb",
    features: ["OSS-RBA & perizinan berusaha", "Izin sektor spesifik", "SIUP, SLO, izin edar", "Rekomendasi KBLI terbaik"],
    icon: "Stamp",
    featured: false,
    order: 3,
  },
  {
    title: "Merek, Hak Cipta & Paten",
    desc: "Amankan brand Anda sebelum orang lain. Cek ketersediaan + pengajuan ke DJKI.",
    price: "Mulai Rp 1,5 jt",
    features: ["Pencarian & analisis merek", "Pengajuan kelas Nice", "Hak cipta & paten", "Monitoring status pendaftaran"],
    icon: "Lightbulb",
    featured: false,
    order: 4,
  },
  {
    title: "Digitalisasi Bisnis",
    desc: "Website, aplikasi, sistem manajemen & otomasi AI — langit ke-7 menuju bisnis yang skala.",
    price: "Konsultasi custom",
    features: ["Website & e-commerce", "Aplikasi & sistem internal", "Otomasi berbasis AI", "Digital marketing 360°"],
    icon: "Rocket",
    featured: false,
    order: 5,
  },
];

const TESTIMONIALS = [
  // Baris A (order 0-4)
  { name: "Rendra Wijaya", role: "Founder, Kopi Nusantara Rasa", text: "Dari NIB sampai sertifikasi halal, semua beres dalam 9 hari. Tim Digiman bahkan membantu saya memilih KBLI yang bikin saya dapat cuti pajak UMKM. Luar biasa detail.", order: 0 },
  { name: "Sandra Halim", role: "Owner, CV Sinar Teknik", text: "Pendiriannya cuma 4 hari dan saya tidak pernah keluar kantor. Portal monitoring-nya bikin saya tenang karena selalu tahu dokumen saya sedang di mana.", order: 1 },
  { name: "Michael Tanaka", role: "Director, Sakura Digital PMA", text: "Sebagai investor asing, regulasi Indonesia terasa rumit. Digiman memegang semuanya — BKPM, OSS, sampai laporan berkala. Highly recommended.", order: 2 },
  { name: "dr. Amelinda Putri", role: "Founder, Klinik Sehat Bersama", text: "Izin operasional klinik itu rumit. Dewan pakar mereka paham banget alur Dinkes dan BPOM. Pendampingannya sampai klinik kami benar-benar beroperasi.", order: 3 },
  { name: "Bagas Prakoso", role: "CEO, LogistikPro PT", text: "Garansi terbitnya bukan gimmick. Ada revisi dokumen dari notaris, mereka ulangi proses tanpa biaya tambahan dan tetap tepat waktu.", order: 4 },
  // Baris B (order 5-9)
  { name: "Lestari Ningsih", role: "Owner, Batik Larasati", text: "Merek saya sempat hampir dibajak kompetitor. Untung pendaftaran DJKI lewat Digiman sudah jalan duluan. Sekarang brand saya aman total.", order: 5 },
  { name: "Yusuf Ramadhan", role: "Founder, EduSkill Academy", text: "Langit ke-7 mereka nyata: website + sistem manajemen siswa + otomasi marketing. Sekarang pendaftaran murid jalan sendiri 24 jam.", order: 6 },
  { name: "Clara Suryani", role: "Managing Partner, CS Consulting", text: "Saya langganan urus SPT klien-klien saya di sini. Konsultan pajaknya benar-benar bersertifikat dan fast response. 5 tahun tidak pernah telat lapor.", order: 7 },
  { name: "Hendra Gunawan", role: "Owner, Gudang Makan Sehat", text: "Sertifikasi halal + SNI selesai tanpa saya pusing. Harganya transparan dari awal, tidak ada biaya siluman seperti pengalaman saya di tempat lain.", order: 8 },
  { name: "Nadia Kusuma", role: "Co-Founder, Glowlab Skincare", text: "BPOM, merek, sampai website e-commerce semua ditangani satu tim. Koordinasinya gampang karena satu penanggung jawab akun.", order: 9 },
];

const FAQS = [
  {
    question: "Berapa lama proses pendirian PT sampai resmi beroperasi?",
    answer: "Rata-rata 3–7 hari kerja sejak dokumen lengkap dan akta ditandatangani. Proses mencakup akta notaris, pengesahan SK Kemenkumham (biasanya real-time atau 1 hari), penerbitan NPWP badan, dan NIB via OSS. Untuk izin sektor tertentu (kesehatan, logistik, makanan) dapat memakan waktu tambahan — estimasi detail selalu kami berikan di awal, gratis.",
    order: 0,
  },
  {
    question: "Apa saja yang saya siapkan untuk mendirikan perusahaan?",
    answer: "Cukup: KTP & NPWP para pendiri (dan pemegang saham), alamat email aktif, nomor HP, serta alamat usaha (bisa rumah — kami bantu atur domisili). Untuk PT PMA diperlukan paspor asing dan surat pernyataan modal. Selebihnya — penyusunan akta, KBLI, hingga pengurusan online — tim kami yang mengerjakan.",
    order: 1,
  },
  {
    question: "Apakah bisa mendirikan perusahaan tanpa datang ke kantor?",
    answer: "Bisa, 100% online. Dengan tanda tangan elektronik tersertifikasi (TTE) yang diakui Kemenkumham, akta dan pengesahan dapat dilakukan tanpa tatap muka. Dokumen asli kami kirim ke alamat Anda via kurir terjamin, atau Anda ambil di kantor kami.",
    order: 2,
  },
  {
    question: "Apakah ada biaya tersembunyi di tengah proses?",
    answer: "Tidak. Semua biaya — honor notaris, resi Kemenkumham, administrasi pemerintahan, hingga jasa kami — tertulis jelas dalam penawaran sebelum Anda setuju. Jika ada kebutuhan di luar scope (misal izin sektor tambahan), kami konfirmasi dulu sebelum melanjutkan. Ini komitmen transparansi Digiman.",
    order: 3,
  },
  {
    question: "Apa yang dimaksud 'Garansi Terbit'?",
    answer: "Jika dokumen tidak terbit karena kesalahan proses atau administrasi pihak kami, seluruh tahap yang bermasalah kami ulangi tanpa biaya tambahan, plus kompensasi penundaan. Selama 5 tahun operasi, 99,2% dokumen kami terbit sesuai jadwal — sisanya karena perubahan regulasi mendadak yang selalu kami antisipasi dan komunikasikan.",
    order: 4,
  },
  {
    question: "Bagaimana cara mulai konsultasi? Apakah berbayar?",
    answer: "Gratis. Klik tombol WhatsApp di halaman ini atau isi form kontak — dalam 1×24 jam Anda terhubung dengan dewan pakar sesuai bidang bisnis Anda. Kami akan memetakan kebutuhan legalitas, merekomendasikan bentuk badan usaha yang paling efisien secara pajak, dan memberi estimasi biaya & waktu. Tanpa komitmen apa pun.",
    order: 5,
  },
];

async function main() {
  console.log("=== Seed Admin Panel DIGIMAN.ID ===");

  // 1. Pengaturan situs
  const settings = await db.siteSetting.count();
  if (settings === 0) {
    await db.siteSetting.create({ data: { id: 1 } });
    console.log("✓ SiteSetting dibuat (kontak resmi + statistik default)");
  } else {
    console.log("• SiteSetting sudah ada, lewati");
  }

  // 2. Layanan
  const svcCount = await db.service.count();
  if (svcCount === 0) {
    for (const s of SERVICES) {
      await db.service.create({ data: { ...s, features: JSON.stringify(s.features) } });
    }
    console.log(`✓ ${SERVICES.length} layanan di-seed`);
  } else {
    console.log(`• Service sudah ada (${svcCount}), lewati`);
  }

  // 3. Testimoni
  const tCount = await db.testimonial.count();
  if (tCount === 0) {
    for (const t of TESTIMONIALS) {
      await db.testimonial.create({ data: { ...t, rating: 5 } });
    }
    console.log(`✓ ${TESTIMONIALS.length} testimoni di-seed`);
  } else {
    console.log(`• Testimonial sudah ada (${tCount}), lewati`);
  }

  // 4. FAQ
  const fCount = await db.faq.count();
  if (fCount === 0) {
    for (const f of FAQS) {
      await db.faq.create({ data: f });
    }
    console.log(`✓ ${FAQS.length} FAQ di-seed`);
  } else {
    console.log(`• Faq sudah ada (${fCount}), lewati`);
  }

  // 5. Akun admin default
  const adminCount = await db.adminUser.count();
  if (adminCount === 0) {
    await db.adminUser.create({
      data: {
        username: "admin",
        passwordHash: hashPassword("digiman2025"),
        name: "Administrator Digiman",
      },
    });
    console.log("✓ Akun admin dibuat → username: admin | password: digiman2025");
  } else {
    console.log(`• AdminUser sudah ada (${adminCount}), lewati`);
  }

  console.log("=== Seed selesai ===");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
