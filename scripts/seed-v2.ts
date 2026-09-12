/**
 * Seed v2 — kantor (HQ + cabang), katalog layanan lengkap 8 kategori,
 * FAQ tambahan, dan backfill slug untuk terjemahan multi-bahasa.
 * Aman dijalankan berulang (upsert by slug / match by title lama).
 */
import { db } from "../src/lib/db";

const OFFICES = [
  {
    type: "HEAD",
    label: "Head Office — Tasikmalaya",
    address:
      "Andalusia Garden Cluster Granada No.11, Mangkubumi, Mangkubumi, Tasikmalaya, 46181, Jawa Barat, Indonesia",
    order: 1,
  },
  {
    type: "BRANCH",
    label: "Branch Office I — Bandung",
    address: "Jln. Muararajeun Lama No.26, Bandung, Jawa Barat 40122",
    order: 2,
  },
  {
    type: "BRANCH",
    label: "Branch Office II — Sukarame",
    address:
      "Guntur Village 50, Desa Padasuka, Kecamatan Sukarame, Kabupaten Tasikmalaya, Jawa Barat, 46464",
    order: 3,
  },
  {
    type: "BRANCH",
    label: "Branch Office III — Arjasari",
    address:
      "Perumahan Arjamukti Kencana Raya Blok B7 No.2, Leuwisari, Arjasari, Kabupaten Tasikmalaya, Jawa Barat",
    order: 4,
  },
];

interface Svc {
  slug: string;
  title: string;
  desc: string;
  price: string;
  features: string[];
  icon: string;
  category: string;
  featured?: boolean;
  matchTitle?: string; // judul lama di DB utk di-update
}

const CATALOG: Svc[] = [
  // ===== 1. PENDIRIAN BADAN USAHA =====
  {
    slug: "pendirian-pt", title: "Pendirian PT", icon: "Building2", category: "pendirian", featured: true,
    matchTitle: "Pendirian PT", price: "Mulai Rp 3,5 jt",
    desc: "Akta notaris, SK Kemenkumham, NPWP, NIB — paket lengkap PT resmi berdiri dalam hitungan hari.",
    features: ["Akta Notaris + SK Kemenkumham", "NPWP & NIB otomatis", "Domisili usaha", "Gratis konsultasi KBLI"],
  },
  {
    slug: "pt-perorangan", title: "PT Perorangan (UUCK)", icon: "FileBadge", category: "pendirian",
    price: "Mulai Rp 850 rb",
    desc: "Badan usaha resmi untuk usaha individu via OSS — tanpa notaris, NIB terbit langsung, modal kecil maksimal.",
    features: ["NIB sebagai legalitas pasti", "Tanpa akta notaris", "Kewajiban pajak ringan", "Cocok UMKM & freelancer"],
  },
  {
    slug: "pendirian-cv", title: "Pendirian CV", icon: "Users", category: "pendirian",
    matchTitle: "Pendirian CV", price: "Mulai Rp 1,8 jt",
    desc: "Pilihan ideal usaha keluarga & kemitraan. Cepat, murah, dan sah di mata hukum.",
    features: ["Akta notaris CV", "Pengesahan kehakiman", "NPWP & NIB", "Konsultasi struktur modal"],
  },
  {
    slug: "pt-pma", title: "PT PMA (Investasi Asing)", icon: "Globe2", category: "pendirian",
    matchTitle: "PT PMA (Modal Asing)", price: "Mulai Rp 15 jt",
    desc: "Berinvestasi di Indonesia? Kami pegang seluruh regulasi BKPM & OSS untuk Anda.",
    features: ["Struktur saham asing", "Laporan BKPM/OSS", "Izin investasi", "Pendampingan DGT & Bank"],
  },
  {
    slug: "firma-ud", title: "Firma, UD & Persekutuan", icon: "Store", category: "pendirian",
    price: "Mulai Rp 1,2 jt",
    desc: "Bentuk badan usaha klasik untuk dagang & kemitraan nama bersama — cepat berdiri, biaya efisien.",
    features: ["Akta Firma/UD notaris", "NPWP & NIB", "Surat Keterangan Domisili", "Konsultasi tanggung jawab utang"],
  },
  {
    slug: "pendirian-koperasi", title: "Pendirian Koperasi", icon: "Handshake", category: "pendirian",
    price: "Mulai Rp 2,5 jt",
    desc: "Koperasi konsumen, produsen, atau jasa — dari AD/ART hingga BADAN legalitas resmi Kemenkop.",
    features: ["Rapat pendirian & AD/ART", "Pengesahan Kemenkop UKM", "NPWP & NIB koperasi", "Panduan SHU & RAT"],
  },
  {
    slug: "pendirian-yayasan", title: "Yayasan & Lembaga Nirlaba", icon: "HeartHandshake", category: "pendirian",
    price: "Mulai Rp 3 jt",
    desc: "Berdiri untuk kebaikan sosial, pendidikan, atau keagamaan — legal penuh dengan struktur organ yang benar.",
    features: ["Akta yayasan + SK Kemenkumham", "Struktur pembina-pengurus-pengawas", "NPWP & NIB", "Konsultasi pajak nirlaba"],
  },
  {
    slug: "perkumpulan-asosiasi", title: "Perkumpulan & Asosiasi", icon: "Network", category: "pendirian",
    price: "Mulai Rp 2,5 jt",
    desc: "Asosiasi profesi atau industri dengan badan hukum — angkatan besar, kredibilitas tinggi.",
    features: ["AD/ART perkumpulan", "SK Kemenkumham", "NPWP & NIB", "Panduan keanggotaan & iuran"],
  },

  // ===== 2. PERIZINAN & LEGALITAS =====
  {
    slug: "nib-oss", title: "NIB, OSS-RBA & Pemetaan KBLI", icon: "Stamp", category: "perizinan",
    matchTitle: "NIB, OSS & Izin Sektor", price: "Mulai Rp 750 rb",
    desc: "Nomor Induk Berusaha sebagai identitas utama bisnis Anda di sistem OSS-RBA — KBLI dipetakan presisi.",
    features: ["Registrasi OSS-RBA", "Analisis KBLI optimal", "NIB sama dengan izin dasar", "Revisi & penyesuaian data"],
  },
  {
    slug: "izin-sektor-ss", title: "Izin Usaha Sektor & Sertifikat Standar", icon: "FileCheck2", category: "perizinan",
    price: "Mulai Rp 1 jt",
    desc: "Perizinan spesifik sektor: kesehatan, makanan, logistik, konstruksi, pariwisata — sampai terbit.",
    features: ["Sertifikat Standar (SS)", "PKKPR & lingkungan", "Izin edar, SIUP, SLO", "Pendampingan audit lapangan"],
  },
  {
    slug: "domisili-vo", title: "Domisili Usaha & Virtual Office", icon: "MapPin", category: "perizinan",
    price: "Mulai Rp 500 rb",
    desc: "Alamat bisnis bergengsi tanpa biaya kantor fisik — SKDU/SKPPK lengkap untuk pendirian & perizinan.",
    features: ["SKDU / SKPPK", "Virtual office premium", "Layanan terima surat", "P cocok untuk PT & PMA"],
  },
  {
    slug: "legalisasi-apostille", title: "Legalisisasi, Apostille & Terjemahan", icon: "FileSignature", category: "perizinan",
    price: "Mulai Rp 350 rb/dok",
    desc: "Dokumen sah untuk dipakai luar negeri: apostille Kemenkumham, legalisasi KBRI, terjemahan tersumpah.",
    features: ["Apostille documents resmi", "Legalisasi kedutaan", "Terjemahan tersumpah", "Notaris & e-KTA"],
  },

  // ===== 3. KEKAYAAN INTELEKTUAL =====
  {
    slug: "pendaftaran-merek", title: "Pendaftaran Merek", icon: "Lightbulb", category: "ki",
    matchTitle: "Merek, Hak Cipta & Paten", price: "Mulai Rp 1,5 jt",
    desc: "Amankan brand Anda sebelum orang lain. Cek ketersediaan + pengajuan ke DJKI.",
    features: ["Pencarian & analisis merek", "Pengajuan kelas Nice", "Monitoring status", "Balasan argumen DJKI"],
  },
  {
    slug: "hak-cipta-paten", title: "Hak Cipta, Paten & Desain Industri", icon: "Copyright", category: "ki",
    price: "Mulai Rp 900 rb",
    desc: "Karya, inovasi, dan desain adalah aset — daftarkan agar sah, bernilai, dan bisa dipertaruhkan.",
    features: ["Hak cipta karya & aplikasi", "Paten & paten sederhana", "Desain industri", "Sertifikat resmi DJKI"],
  },
  {
    slug: "franchise", title: "Lisensi Franchise (STPW)", icon: "ScrollText", category: "ki",
    price: "Mulai Rp 2 jt",
    desc: "Siap mengembangkan jaringan franchise? STPW + prospek usaha tersusun sesuai regulasi Kemenperin.",
    features: ["STPW Kemenperin", "Prospek & pengalaman usaha", "Perjanjian franchise", "Manual brand & SOP"],
  },

  // ===== 4. SERTIFIKASI & STANDAR =====
  {
    slug: "sertifikasi-halal", title: "Sertifikasi Halal", icon: "BadgeCheck", category: "sertifikasi",
    price: "Mulai Rp 1,5 jt",
    desc: "Proses penuh di SIHALAL: dari SJPH, penyelia halal, hingga Audit & keputusan fatwa — garansi halal.",
    features: ["Pengajuan SIHALAL", "Pendampingan SJPH", "Penyelia halal terlatih", "Audi & sertifikat BPJPH"],
  },
  {
    slug: "bpom", title: "Izin Edar & Notifikasi BPOM", icon: "ShieldCheck", category: "sertifikasi",
    price: "Mulai Rp 2 jt",
    desc: "Produk makanan, kosmetik, obat tradisional lolos BPOM — MD/CD terbit, produk siap pajang di rak.",
    features: ["Notifikasi kosmetik (e-Not)", "Izin edar MD & CD", "Analisis label & komposisi", "Pendaftaran pabrik/importir"],
  },
  {
    slug: "sni", title: "Sertifikat SNI", icon: "Award", category: "sertifikasi",
    price: "Mulai Rp 2,5 jt",
    desc: "Wajib untuk produk tertentu (sepatu, kabel, makanan olahan) — kami dampingi uji lab sampai SNI terbit.",
    features: ["Analisis kewajiban SNI", "Pengujian lab terakreditasi", "Audit pabrik (SPPT-SNI)", "Penandaan LSPro"],
  },
  {
    slug: "iso", title: "Sertifikasi ISO", icon: "Medal", category: "sertifikasi",
    price: "Mulai Rp 5 jt",
    desc: "ISO 9001, 14001, 22000, 27001 — naikkan kredibilitas tender & kepercayaan mitra internasional.",
    features: ["Gap analysis awal", "Penyusunan dokumen SMM", "Pendampingan audit sertifikasi", "Sertifikat dari badan akreditasi"],
  },

  // ===== 5. PERPAJAKAN =====
  {
    slug: "npwp-pkp", title: "NPWP Badan & Pengukuhan PKP", icon: "Receipt", category: "pajak",
    price: "Mulai Rp 400 rb",
    desc: "NPWP badan, pengukuhan PKP 4,7% rate 0,5% (UMKM), sampai aktivasi e-Faktur & coretax.",
    features: ["NPWP badan/pribadi asing", "Pengukuhan PKP", "Aktivasi Coretax DJP", "Konsultasi tarif optimal"],
  },
  {
    slug: "pelaporan-pajak", title: "SPT, e-Faktur & Pelaporan Pajak", icon: "Calculator", category: "pajak",
    price: "Mulai Rp 500 rb/bln",
    desc: "Tenangkan kepala Anda: seluruh kewajiban pajak bulanan & tahunan dikelola konsultan bersertifikat.",
    features: ["SPT Masa PPN & PPh", "SPT Tahunan badan", "e-Faktur & pembukuan", "Restitusi & pemeriksaan pajak"],
  },

  // ===== 6. KETENAGAKERJAAN =====
  {
    slug: "bpjs", title: "BPJS Kesehatan & Ketenagakerjaan", icon: "HeartPulse", category: "ketenagakerjaan",
    price: "Mulai Rp 300 rb",
    desc: "Patuhi aturan ketenagakerjaan: daftar & kelola BPJS seluruh karyawan tanpa pusing administrasi.",
    features: ["Registrasi perusahaan BPJS", "Enrollment karyawan", "JPK imtegrasi perjanjian kerja", "Mutasi & klaim bulanan"],
  },
  {
    slug: "kitas-rptka", title: "KITAS/KITAP & RPTKA", icon: "Plane", category: "ketenagakerjaan",
    price: "Mulai Rp 5 jt",
    desc: "Pekerja asing & investor asing legal bekerja/tinggal: RPTKA, notification, VITAS-KITAS sampai KITAP.",
    features: ["RPTKA Kemenaker", "Notifikasi & telex VITAS", "KITAS investor & pekerja", "KITAP & MERP"],
  },

  // ===== 7. KORPORASI & LEGAL =====
  {
    slug: "perubahan-akta", title: "Perubahan Akta & Struktur", icon: "FileText", category: "korporasi",
    price: "Mulai Rp 1,5 jt",
    desc: "Ganti nama, alamat, pengurus, modal, pemegang saham, atau tambah KBLI — semua diurus tuntas.",
    features: ["Akta perubahan notaris", "Pengesahan Kemenkumham", "Update NIB/OSS & NPWP", "Publikasi tambahan cadangan"],
  },
  {
    slug: "pembubaran", title: "Pembubaran & Likuidasi", icon: "Archive", category: "korporasi",
    price: "Mulai Rp 2,5 jt",
    desc: "Tutup badan usaha dengan benar: RUPS pembubaran, pelunasan kewajiban, hingga penghapusan NIB.",
    features: ["RUPS & akta pembubaran", "Pemberitahuan kreditor", "Pelaporan pajak akhir", "Penghapusan NIB & NPWP"],
  },
  {
    slug: "legal-drafting", title: "Legal Drafting & Due Diligence", icon: "Scale", category: "korporasi",
    price: "Mulai Rp 750 rb",
    desc: "Perjanjian bisnis yang menutup celah hukum, dan pemeriksaan legalitas mitra sebelum Anda menandatangani.",
    features: ["Perjanjian kerja sama", "Perjanjian kerja & confidential", "Legal due diligence mitra", "Review kontrak oleh pakar"],
  },

  // ===== 8. DIGITALISASI =====
  {
    slug: "website-ecommerce", title: "Website & E-Commerce", icon: "Rocket", category: "digital",
    matchTitle: "Digitalisasi Bisnis", price: "Mulai Rp 3 jt",
    desc: "Website company profile sampai toko online — cepat, SEO-ready, dan meyakinkan pelanggan.",
    features: ["Company profile premium", "Toko online & payment gateway", "SEO & Google Business", "Domain, hosting, email bisnis"],
  },
  {
    slug: "aplikasi-sistem", title: "Aplikasi & Sistem Internal", icon: "MonitorSmartphone", category: "digital",
    price: "Konsultasi custom",
    desc: "POS, inventori, HRIS, CRM, hingga sistem khusus industri — dibangun tim software berpengalaman.",
    features: ["Kasir, stok & laporan", "HRIS & penggajian", "CRM & keanggotaan", "Integrasi & dashboard"],
  },
  {
    slug: "otomasi-ai", title: "Otomasi AI & Digital Marketing", icon: "Sparkles", category: "digital",
    price: "Mulai Rp 2,5 jt/bln",
    desc: "Chatbot WhatsApp AI, iklan berperforma, dan konten yang bekerja 24 jam untuk penjualan Anda.",
    features: ["Chatbot & AI assistant", "Ads Meta/Google/TikTok", "Konten & social media", "Laporan performa bulanan"],
  },
];

const NEW_FAQS = [
  {
    slug: "faq-7",
    question: "Apa bedanya PT, CV, dan PT Perorangan? Mana yang cocok untuk usaha saya?",
    answer:
      "PT cocok untuk bisnis yang butuh kredibilitas tinggi, investor, dan perlindungan aset pribadi (tanggung jawab terbatas pada modal). CV ideal untuk usaha keluarga/kemitraan dengan modal ringan namun tanggung jawab para sekutu tidak terbatas. PT Perorangan paling ringan dan murah — khusus usaha individu dengan modal kecil, tanpa notaris, cukup NIB via OSS. Tim kami akan memetakan pilihan paling efisien secara pajak dan hukum sesuai skala serta rencana bisnis Anda, gratis saat konsultasi awal.",
  },
  {
    slug: "faq-8",
    question: "Perusahaan saya sudah berjalan — bisakah diganti nama, pindah alamat, atau tambah KBLI?",
    answer:
      "Sangat bisa. Layanan perubahan akta & struktur kami mencakup: perubahan nama perusahaan, alamat, bidang usaha (KBLI), susunan pengurus/komisaris, pemegang saham, dan modal dasar. Kami urus dari akta notaris, pengesahan Kemenkumham, sampai sinkronisasi NIB/OSS dan NPWP agar seluruh dokumen turunan konsisten. Rata-rata proses 3–7 hari kerja, dan Anda tetap fokus beroperasi karena kami yang menangani seluruh birokrasinya.",
  },
  {
    slug: "faq-9",
    question: "Bagaimana keamanan data sensitif seperti KTP dan NPWP yang saya kirimkan?",
    answer:
      "Data Anda hanya diakses oleh konsultan penanggung jawab akun Anda — tidak dibagikan ke pihak ketiga di luar keperluan pengurusan (notaris, kementerian). Seluruh berkas tersimpan terenkripsi, dan setelah proses selesai Anda dapat meminta penghapusan arsip digital. Kami juga memberikan tanda terima dokumen yang jelas serta pemantauan status real-time, sehingga Anda selalu tahu dokumen sensitif Anda sedang berada di tahap apa.",
  },
  {
    slug: "faq-10",
    question: "Apakah DIGIMAN melayani klien dari luar kota atau luar negeri?",
    answer:
      "Melayani. Seluruh proses dapat berjalan 100% online dengan tanda tangan elektronik tersertifikasi — klien kami tersebar dari Aceh sampai Papua, termasuk diaspora Indonesia dan investor asing yang mendirikan PT PMA. Dokumen asli dikirim via kurir terjamin. Kami punya head office di Tasikmalaya serta cabang di Bandung dan sekitarnya, namun untuk Anda di mana pun, akun manager pribadi tetap memantau setiap tahap pengurusan Anda.",
  },
];

async function main() {
  console.log("=== Seed v2 dimulai ===");

  // 1. Kantor
  for (const o of OFFICES) {
    const existing = await db.office.findFirst({ where: { label: o.label } });
    if (!existing) await db.office.create({ data: o });
  }
  console.log(`Kantor OK (${OFFICES.length})`);

  // 2. Alamat utama = HQ Tasikmalaya
  await db.siteSetting.update({
    where: { id: 1 },
    data: {
      addressShort: "Andalusia Garden Granada No.11, Tasikmalaya",
      addressFull:
        "Andalusia Garden Cluster Granada No.11, Mangkubumi, Mangkubumi, Tasikmalaya, 46181, Jawa Barat, Indonesia",
    },
  });
  console.log("SiteSetting alamat -> HQ Tasikmalaya");

  // 3. Katalog layanan
  let created = 0, updated = 0;
  for (let i = 0; i < CATALOG.length; i++) {
    const s = CATALOG[i];
    const data = {
      slug: s.slug, title: s.title, desc: s.desc, price: s.price,
      features: JSON.stringify(s.features), icon: s.icon, category: s.category,
      featured: Boolean(s.featured), order: (i + 1) * 10,
    };
    const bySlug = await db.service.findUnique({ where: { slug: s.slug } });
    if (bySlug) {
      await db.service.update({ where: { id: bySlug.id }, data });
      updated++;
      continue;
    }
    const byOldTitle = s.matchTitle
      ? await db.service.findFirst({ where: { title: s.matchTitle, slug: null } })
      : null;
    if (byOldTitle) {
      await db.service.update({ where: { id: byOldTitle.id }, data });
      updated++;
      continue;
    }
    const byAnyTitle = await db.service.findFirst({ where: { title: s.title, slug: null } });
    if (byAnyTitle) {
      await db.service.update({ where: { id: byAnyTitle.id }, data });
      updated++;
      continue;
    }
    await db.service.create({ data });
    created++;
  }
  console.log(`Layanan: ${updated} update, ${created} baru (total ${CATALOG.length})`);

  // 4. Backfill slug FAQ lama (faq-1..faq-6 by order) + tambah FAQ baru
  const oldFaqs = await db.faq.findMany({ where: { slug: null }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  let faqNo = 1;
  for (const f of oldFaqs) {
    await db.faq.update({ where: { id: f.id }, data: { slug: `faq-${faqNo}` } });
    faqNo++;
  }
  for (const f of NEW_FAQS) {
    const exists = await db.faq.findUnique({ where: { slug: f.slug } });
    const maxOrder = (await db.faq.aggregate({ _max: { order: true } }))._max.order ?? 0;
    if (!exists) {
      await db.faq.create({ data: { ...f, order: maxOrder + 10 } });
    }
  }
  console.log("FAQ OK");

  // 5. Backfill slug testimoni (testimoni-1..n by order)
  const oldTs = await db.testimonial.findMany({ where: { slug: null }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  let tNo = 1;
  for (const t of oldTs) {
    await db.testimonial.update({ where: { id: t.id }, data: { slug: `testimoni-${tNo}` } });
    tNo++;
  }
  console.log("Testimoni OK");

  const counts = {
    offices: await db.office.count(),
    services: await db.service.count(),
    faqs: await db.faq.count(),
    testimonials: await db.testimonial.count(),
  };
  console.log("TOTAL:", JSON.stringify(counts));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
