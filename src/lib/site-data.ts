/**
 * Helper data untuk halaman publik (server component).
 * Membaca seluruh konten dari database dengan fallback aman ke data default,
 * sehingga website tetap tampil sempurna walau DB kosong / bermasalah.
 */
import { db } from "@/lib/db";

export interface SiteSettingsData {
  companyName: string;
  waNumber: string;
  waDisplay: string;
  email: string;
  addressShort: string;
  addressFull: string;
  logoUrl: string | null;
  statClients: number;
  statExperts: number;
  statLayers: number;
  statSuccess: number;
  heroHeadline: string;
  heroSub: string;
  heroWords: string[];
  metaTitle: string;
  metaDescription: string;
  hours: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  facebook: string;
  youtube: string;
  metaKeywords: string;
  googleSiteVerification: string;
  headScripts: string;
  contactFormEnabled: boolean;
  skNumber: string;
  nibNumber: string;
  npwpNumber: string;
  established: string;
}

export interface ServiceItem {
  slug: string | null;
  title: string;
  desc: string;
  price: string;
  items: string[];
  icon: string;
  category: string;
  featured: boolean;
}

export interface TestimonialItem {
  slug: string | null;
  name: string;
  role: string;
  text: string;
}

export interface FaqItem {
  slug: string | null;
  q: string;
  a: string;
}

export interface OfficeItem {
  type: string; // "HEAD" | "BRANCH"
  label: string;
  address: string;
  order: number;
}

export interface TeamItem {
  id: string;
  name: string;
  role: string;
  division: string | null;
  photo: string | null;
  order: number;
}

export interface SiteData {
  settings: SiteSettingsData;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  team: TeamItem[];
  offices: OfficeItem[];
  sections: SectionRow[];
}

export interface SectionRow {
  key: string;
  label: string;
  enabled: boolean;
  order: number;
}

/** Urutan & label default section beranda (harus sinkron dengan API admin sections) */
export const DEFAULT_SECTIONS: SectionRow[] = [
  { key: "hero", label: "Hero / Beranda", enabled: true, order: 0 },
  { key: "marquee", label: "Marquee Layanan", enabled: true, order: 1 },
  { key: "stats", label: "Statistik", enabled: true, order: 2 },
  { key: "seven-heavens", label: "7 Lapis Langit", enabled: true, order: 3 },
  { key: "services", label: "Layanan", enabled: true, order: 4 },
  { key: "paket", label: "Paket & Harga", enabled: true, order: 5 },
  { key: "why-us", label: "Mengapa Kami", enabled: true, order: 6 },
  { key: "team", label: "Struktur Perusahaan", enabled: true, order: 7 },
  { key: "offices", label: "Kantor & Cabang", enabled: true, order: 8 },
  { key: "process", label: "Proses Kerja", enabled: true, order: 9 },
  { key: "testimonials", label: "Testimoni", enabled: true, order: 10 },
  { key: "faq", label: "FAQ", enabled: true, order: 11 },
  { key: "cta", label: "Ajakan Konsultasi", enabled: true, order: 12 },
  { key: "contact-form", label: "Formulir Konsultasi", enabled: true, order: 13 },
];

/** Baca konfigurasi urutan/visibilitas section (fallback: urutan default bila DB kosong) */
export async function getSectionConfig(): Promise<SectionRow[]> {
  try {
    const saved = await db.sectionConfig.findMany({ orderBy: { order: "asc" } });
    if (saved.length === 0) return DEFAULT_SECTIONS;
    const byKey = new Map(saved.map((s) => [s.key, s]));
    return DEFAULT_SECTIONS.map((def) => {
      const s = byKey.get(def.key);
      return s ? { key: s.key, label: s.label, enabled: s.enabled, order: s.order } : def;
    }).sort((a, b) => a.order - b.order);
  } catch {
    return DEFAULT_SECTIONS;
  }
}

// ---------- Data default (fallback) ----------
const DEFAULT_SETTINGS: SiteSettingsData = {
  companyName: "PT Digital Bisnis Manajemen",
  waNumber: "6281333397223",
  waDisplay: "+62 813-3339-7223",
  email: "halo@digiman.id",
  addressShort: "Andalusia Garden Granada No.11, Tasikmalaya",
  addressFull:
    "Andalusia Garden Cluster Granada No.11, Mangkubumi, Mangkubumi, Tasikmalaya, 46181, Jawa Barat, Indonesia",
  logoUrl: null,
  statClients: 2500,
  statExperts: 46,
  statLayers: 7,
  statSuccess: 98,
  heroHeadline: "Naikkan Bisnis Anda ke 7 Lapis Langit Legalitas.",
  heroSub:
    "Satu pintu untuk seluruh legalitas perusahaan di Indonesia — dari akta pendirian, perizinan OSS, kekayaan intelektual, hingga transformasi digital. Didampingi 46 dewan pakar lintas bidang, proses transparan, garansi di tangan.",
  heroWords: [
    "Pendirian PT",
    "Pendirian CV",
    "PT PMA",
    "NIB & OSS",
    "Pendaftaran Merek",
    "Sertifikasi Halal",
    "Digitalisasi Bisnis",
  ],
  metaTitle: "DIGIMAN.ID — Naikkan Bisnis Anda ke 7 Lapis Langit Legalitas & Digitalisasi",
  metaDescription:
    "PT Digital Bisnis Manajemen (DIGIMAN.ID) — Jasa pembuatan akta pendirian perusahaan (PT, CV, PT PMA) dan seluruh legalitas usaha di Indonesia: NIB, OSS, NPWP, Merek, Halal, hingga konsultan digitalisasi bisnis.",
  hours: "Senin–Jumat 09.00–17.00 WIB",
  instagram: "",
  linkedin: "",
  tiktok: "",
  facebook: "",
  youtube: "",
  metaKeywords: "",
  googleSiteVerification: "",
  headScripts: "",
  contactFormEnabled: true,
  skNumber: "AHU-059566.AH.01.30.Tahun 2022",
  nibNumber: "2612220035584",
  npwpNumber: "62.239.729.7-423.000",
  established: "26 Desember 2022",
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    slug: "pendirian-pt", title: "Pendirian PT", featured: true, icon: "Building2", category: "pendirian",
    desc: "Akta notaris, SK Kemenkumham, NPWP, NIB — paket lengkap PT resmi berdiri dalam hitungan hari.",
    price: "Mulai Rp 3,5 jt",
    items: ["Akta Notaris + SK Kemenkumham", "NPWP & NIB otomatis", "Domisili usaha", "Gratis konsultasi KBLI"],
  },
  {
    slug: "pt-perorangan", title: "PT Perorangan (UUCK)", featured: false, icon: "FileBadge", category: "pendirian",
    desc: "Badan usaha resmi untuk usaha individu via OSS — tanpa notaris, NIB terbit langsung.",
    price: "Mulai Rp 850 rb",
    items: ["NIB sebagai legalitas pasti", "Tanpa akta notaris", "Kewajiban pajak ringan", "Cocok UMKM & freelancer"],
  },
  {
    slug: "pendirian-cv", title: "Pendirian CV", featured: false, icon: "Users", category: "pendirian",
    desc: "Pilihan ideal usaha keluarga & kemitraan. Cepat, murah, dan sah di mata hukum.",
    price: "Mulai Rp 1,8 jt",
    items: ["Akta notaris CV", "Pengesahan kehakiman", "NPWP & NIB", "Konsultasi struktur modal"],
  },
  {
    slug: "pt-pma", title: "PT PMA (Investasi Asing)", featured: false, icon: "Globe2", category: "pendirian",
    desc: "Berinvestasi di Indonesia? Kami pegang seluruh regulasi BKPM & OSS untuk Anda.",
    price: "Mulai Rp 15 jt",
    items: ["Struktur saham asing", "Laporan BKPM/OSS", "Izin investasi", "Pendampingan DGT & Bank"],
  },
  {
    slug: "nib-oss", title: "NIB, OSS-RBA & Pemetaan KBLI", featured: false, icon: "Stamp", category: "perizinan",
    desc: "Nomor Induk Berusaha sebagai identitas utama bisnis Anda di sistem OSS-RBA — KBLI dipetakan presisi.",
    price: "Mulai Rp 750 rb",
    items: ["Registrasi OSS-RBA", "Analisis KBLI optimal", "NIB sama dengan izin dasar", "Revisi & penyesuaian data"],
  },
  {
    slug: "pendaftaran-merek", title: "Pendaftaran Merek", featured: false, icon: "Lightbulb", category: "ki",
    desc: "Amankan brand Anda sebelum orang lain. Cek ketersediaan + pengajuan ke DJKI.",
    price: "Mulai Rp 1,5 jt",
    items: ["Pencarian & analisis merek", "Pengajuan kelas Nice", "Monitoring status", "Balasan argumen DJKI"],
  },
  {
    slug: "website-ecommerce", title: "Website & E-Commerce", featured: false, icon: "Rocket", category: "digital",
    desc: "Website company profile sampai toko online — cepat, SEO-ready, dan meyakinkan pelanggan.",
    price: "Mulai Rp 3 jt",
    items: ["Company profile premium", "Toko online & payment gateway", "SEO & Google Business", "Domain, hosting, email bisnis"],
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { slug: "testimoni-1", name: "Rendra Wijaya", role: "Founder, Kopi Nusantara Rasa", text: "Dari NIB sampai sertifikasi halal, semua beres dalam 9 hari. Tim Digiman bahkan membantu saya memilih KBLI yang bikin saya dapat cuti pajak UMKM. Luar biasa detail." },
  { slug: "testimoni-2", name: "Sandra Halim", role: "Owner, CV Sinar Teknik", text: "Pendiriannya cuma 4 hari dan saya tidak pernah keluar kantor. Portal monitoring-nya bikin saya tenang karena selalu tahu dokumen saya sedang di mana." },
  { slug: "testimoni-3", name: "Michael Tanaka", role: "Director, Sakura Digital PMA", text: "Sebagai investor asing, regulasi Indonesia terasa rumit. Digiman memegang semuanya — BKPM, OSS, sampai laporan berkala. Highly recommended." },
  { slug: "testimoni-4", name: "dr. Amelinda Putri", role: "Founder, Klinik Sehat Bersama", text: "Izin operasional klinik itu rumit. Dewan pakar mereka paham banget alur Dinkes dan BPOM. Pendampingannya sampai klinik kami benar-benar beroperasi." },
  { slug: "testimoni-5", name: "Bagas Prakoso", role: "CEO, LogistikPro PT", text: "Garansi terbitnya bukan gimmick. Ada revisi dokumen dari notaris, mereka ulangi proses tanpa biaya tambahan dan tetap tepat waktu." },
  { slug: "testimoni-6", name: "Lestari Ningsih", role: "Owner, Batik Larasati", text: "Merek saya sempat hampir dibajak kompetitor. Untung pendaftaran DJKI lewat Digiman sudah jalan duluan. Sekarang brand saya aman total." },
  { slug: "testimoni-7", name: "Yusuf Ramadhan", role: "Founder, EduSkill Academy", text: "Langit ke-7 mereka nyata: website + sistem manajemen siswa + otomasi marketing. Sekarang pendaftaran murid jalan sendiri 24 jam." },
  { slug: "testimoni-8", name: "Clara Suryani", role: "Managing Partner, CS Consulting", text: "Saya langganan urus SPT klien-klien saya di sini. Konsultan pajaknya benar-benar bersertifikat dan fast response. 5 tahun tidak pernah telat lapor." },
  { slug: "testimoni-9", name: "Hendra Gunawan", role: "Owner, Gudang Makan Sehat", text: "Sertifikasi halal + SNI selesai tanpa saya pusing. Harganya transparan dari awal, tidak ada biaya siluman seperti pengalaman saya di tempat lain." },
  { slug: "testimoni-10", name: "Nadia Kusuma", role: "Co-Founder, Glowlab Skincare", text: "BPOM, merek, sampai website e-commerce semua ditangani satu tim. Koordinasinya gampang karena satu penanggung jawab akun." },
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    slug: "faq-1",
    q: "Berapa lama proses pendirian PT sampai resmi beroperasi?",
    a: "Rata-rata 3–7 hari kerja sejak dokumen lengkap dan akta ditandatangani. Proses mencakup akta notaris, pengesahan SK Kemenkumham (biasanya real-time atau 1 hari), penerbitan NPWP badan, dan NIB via OSS. Untuk izin sektor tertentu (kesehatan, logistik, makanan) dapat memakan waktu tambahan — estimasi detail selalu kami berikan di awal, gratis.",
  },
  {
    slug: "faq-2",
    q: "Apa saja yang saya siapkan untuk mendirikan perusahaan?",
    a: "Cukup: KTP & NPWP para pendiri (dan pemegang saham), alamat email aktif, nomor HP, serta alamat usaha (bisa rumah — kami bantu atur domisili). Untuk PT PMA diperlukan paspor asing dan surat pernyataan modal. Selebihnya — penyusunan akta, KBLI, hingga pengurusan online — tim kami yang mengerjakan.",
  },
  {
    slug: "faq-3",
    q: "Apakah bisa mendirikan perusahaan tanpa datang ke kantor?",
    a: "Bisa, 100% online. Dengan tanda tangan elektronik tersertifikasi (TTE) yang diakui Kemenkumham, akta dan pengesahan dapat dilakukan tanpa tatap muka. Dokumen asli kami kirim ke alamat Anda via kurir terjamin, atau Anda ambil di kantor kami.",
  },
  {
    slug: "faq-4",
    q: "Apakah ada biaya tersembunyi di tengah proses?",
    a: "Tidak. Semua biaya — honor notaris, resi Kemenkumham, administrasi pemerintahan, hingga jasa kami — tertulis jelas dalam penawaran sebelum Anda setuju. Jika ada kebutuhan di luar scope (misal izin sektor tambahan), kami konfirmasi dulu sebelum melanjutkan. Ini komitmen transparansi Digiman.",
  },
  {
    slug: "faq-5",
    q: "Apa yang dimaksud 'Garansi Terbit'?",
    a: "Jika dokumen tidak terbit karena kesalahan proses atau administrasi pihak kami, seluruh tahap yang bermasalah kami ulangi tanpa biaya tambahan, plus kompensasi penundaan. Selama 5 tahun operasi, 99,2% dokumen kami terbit sesuai jadwal — sisanya karena perubahan regulasi mendadak yang selalu kami antisipasi dan komunikasikan.",
  },
  {
    slug: "faq-6",
    q: "Bagaimana cara mulai konsultasi? Apakah berbayar?",
    a: "Gratis. Klik tombol WhatsApp di halaman ini atau isi form kontak — dalam 1×24 jam Anda terhubung dengan dewan pakar sesuai bidang bisnis Anda. Kami akan memetakan kebutuhan legalitas, merekomendasikan bentuk badan usaha yang paling efisien secara pajak, dan memberi estimasi biaya & waktu. Tanpa komitmen apa pun.",
  },
];

export async function getSiteData(): Promise<SiteData> {
  try {
    const [settingsRow, serviceRows, testimonialRows, faqRows, teamRows, officeRows, sectionRows] = await Promise.all([
      db.siteSetting.findUnique({ where: { id: 1 } }),
      db.service.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.testimonial.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.faq.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.office.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.sectionConfig.findMany({ orderBy: { order: "asc" } }),
    ]);

    const services: ServiceItem[] = serviceRows.map((s) => {
      let items: string[] = [];
      try {
        items = JSON.parse(s.features);
      } catch {
        items = [];
      }
      return {
        slug: s.slug,
        title: s.title,
        desc: s.desc,
        price: s.price,
        items,
        icon: s.icon,
        category: s.category,
        featured: s.featured,
      };
    });

    let heroWords: string[] = DEFAULT_SETTINGS.heroWords;
    if (settingsRow?.heroWords) {
      try {
        const parsed = JSON.parse(settingsRow.heroWords);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          heroWords = parsed.map((w) => String(w));
        }
      } catch {
        heroWords = DEFAULT_SETTINGS.heroWords;
      }
    }

    const settings: SiteSettingsData = settingsRow
      ? {
          companyName: settingsRow.companyName,
          waNumber: settingsRow.waNumber,
          waDisplay: settingsRow.waDisplay,
          email: settingsRow.email,
          addressShort: settingsRow.addressShort,
          addressFull: settingsRow.addressFull,
          logoUrl: settingsRow.logoUrl,
          statClients: settingsRow.statClients,
          statExperts: settingsRow.statExperts,
          statLayers: settingsRow.statLayers,
          statSuccess: settingsRow.statSuccess,
          heroHeadline: settingsRow.heroHeadline || DEFAULT_SETTINGS.heroHeadline,
          heroSub: settingsRow.heroSub || DEFAULT_SETTINGS.heroSub,
          heroWords,
          metaTitle: settingsRow.metaTitle || DEFAULT_SETTINGS.metaTitle,
          metaDescription: settingsRow.metaDescription || DEFAULT_SETTINGS.metaDescription,
          hours: settingsRow.hours || DEFAULT_SETTINGS.hours,
          instagram: settingsRow.instagram,
          linkedin: settingsRow.linkedin,
          tiktok: settingsRow.tiktok,
          facebook: settingsRow.facebook ?? "",
          youtube: settingsRow.youtube ?? "",
          metaKeywords: settingsRow.metaKeywords ?? "",
          googleSiteVerification: settingsRow.googleSiteVerification ?? "",
          headScripts: settingsRow.headScripts ?? "",
          contactFormEnabled: settingsRow.contactFormEnabled !== false,
          skNumber: settingsRow.skNumber || DEFAULT_SETTINGS.skNumber,
          nibNumber: settingsRow.nibNumber || DEFAULT_SETTINGS.nibNumber,
          npwpNumber: settingsRow.npwpNumber || DEFAULT_SETTINGS.npwpNumber,
          established: settingsRow.established || DEFAULT_SETTINGS.established,
        }
      : DEFAULT_SETTINGS;

    // Konfigurasi section: gabungkan default dengan yang tersimpan
    const savedSections = sectionRows.length > 0
      ? (() => {
          const byKey = new Map(sectionRows.map((sec) => [sec.key, sec]));
          return DEFAULT_SECTIONS.map((def) => {
            const s = byKey.get(def.key);
            return s ? { key: s.key, label: s.label, enabled: s.enabled, order: s.order } : def;
          }).sort((a, b) => a.order - b.order);
        })()
      : DEFAULT_SECTIONS;

    return {
      settings,
      services: services.length > 0 ? services : DEFAULT_SERVICES,
      testimonials:
        testimonialRows.length > 0
          ? testimonialRows.map((t) => ({ slug: t.slug, name: t.name, role: t.role, text: t.text }))
          : DEFAULT_TESTIMONIALS,
      faqs: faqRows.length > 0
        ? faqRows.map((f) => ({ slug: f.slug, q: f.question, a: f.answer }))
        : DEFAULT_FAQS,
      team: teamRows.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        division: t.division,
        photo: t.photo,
        order: t.order,
      })),
      offices: officeRows.map((o) => ({
        type: o.type,
        label: o.label,
        address: o.address,
        order: o.order,
      })),
      sections: savedSections,
    };
  } catch (e) {
    console.error("getSiteData fallback ke data default:", e);
    return {
      settings: DEFAULT_SETTINGS,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      faqs: DEFAULT_FAQS,
      team: [],
      offices: [],
      sections: DEFAULT_SECTIONS,
    };
  }
}
