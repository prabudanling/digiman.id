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
}

export interface ServiceItem {
  title: string;
  desc: string;
  price: string;
  items: string[];
  icon: string;
  featured: boolean;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
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
}

// ---------- Data default (fallback) ----------
const DEFAULT_SETTINGS: SiteSettingsData = {
  companyName: "PT Digital Bisnis Manajemen",
  waNumber: "6281333397223",
  waDisplay: "+62 813-3339-7223",
  email: "halo@digiman.id",
  addressShort: "Jl. Muararajeun Lama No.26, Bandung",
  addressFull:
    "Jl. Muararajeun Lama No.26, Kel. Cihaur Geulis, Kec. Cibeunying Kaler, Kota Bandung, Jawa Barat 40122",
  logoUrl: null,
  statClients: 2500,
  statExperts: 46,
  statLayers: 7,
  statSuccess: 98,
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Pendirian PT",
    desc: "Akta notaris, SK Kemenkumham, NPWP, NIB — paket lengkap PT resmi berdiri dalam hitungan hari.",
    price: "Mulai Rp 3,5 jt",
    items: ["Akta Notaris + SK Kemenkumham", "NPWP & NIB otomatis", "Domisili usaha", "Gratis konsultasi KBLI"],
    icon: "Building2",
    featured: true,
  },
  {
    title: "Pendirian CV",
    desc: "Pilihan ideal usaha keluarga & kemitraan. Cepat, murah, dan sah di mata hukum.",
    price: "Mulai Rp 1,8 jt",
    items: ["Akta notaris CV", "Pengesahan kehakiman", "NPWP & NIB", "Konsultasi struktur modal"],
    icon: "Users",
    featured: false,
  },
  {
    title: "PT PMA (Modal Asing)",
    desc: "Berinvestasi di Indonesia? Kami pegang seluruh regulasi BKPM & OSS untuk Anda.",
    price: "Mulai Rp 15 jt",
    items: ["Struktur saham asing", "Laporan BKPM/OSS", "Izin investasi", "Pendampingan DGT & Bank"],
    icon: "Globe2",
    featured: false,
  },
  {
    title: "NIB, OSS & Izin Sektor",
    desc: "Pemetaan KBLI presisi + pengurusan izin usaha di sistem OSS-RBA sampai terbit.",
    price: "Mulai Rp 750 rb",
    items: ["OSS-RBA & perizinan berusaha", "Izin sektor spesifik", "SIUP, SLO, izin edar", "Rekomendasi KBLI terbaik"],
    icon: "Stamp",
    featured: false,
  },
  {
    title: "Merek, Hak Cipta & Paten",
    desc: "Amankan brand Anda sebelum orang lain. Cek ketersediaan + pengajuan ke DJKI.",
    price: "Mulai Rp 1,5 jt",
    items: ["Pencarian & analisis merek", "Pengajuan kelas Nice", "Hak cipta & paten", "Monitoring status pendaftaran"],
    icon: "Lightbulb",
    featured: false,
  },
  {
    title: "Digitalisasi Bisnis",
    desc: "Website, aplikasi, sistem manajemen & otomasi AI — langit ke-7 menuju bisnis yang skala.",
    price: "Konsultasi custom",
    items: ["Website & e-commerce", "Aplikasi & sistem internal", "Otomasi berbasis AI", "Digital marketing 360°"],
    icon: "Rocket",
    featured: false,
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { name: "Rendra Wijaya", role: "Founder, Kopi Nusantara Rasa", text: "Dari NIB sampai sertifikasi halal, semua beres dalam 9 hari. Tim Digiman bahkan membantu saya memilih KBLI yang bikin saya dapat cuti pajak UMKM. Luar biasa detail." },
  { name: "Sandra Halim", role: "Owner, CV Sinar Teknik", text: "Pendiriannya cuma 4 hari dan saya tidak pernah keluar kantor. Portal monitoring-nya bikin saya tenang karena selalu tahu dokumen saya sedang di mana." },
  { name: "Michael Tanaka", role: "Director, Sakura Digital PMA", text: "Sebagai investor asing, regulasi Indonesia terasa rumit. Digiman memegang semuanya — BKPM, OSS, sampai laporan berkala. Highly recommended." },
  { name: "dr. Amelinda Putri", role: "Founder, Klinik Sehat Bersama", text: "Izin operasional klinik itu rumit. Dewan pakar mereka paham banget alur Dinkes dan BPOM. Pendampingannya sampai klinik kami benar-benar beroperasi." },
  { name: "Bagas Prakoso", role: "CEO, LogistikPro PT", text: "Garansi terbitnya bukan gimmick. Ada revisi dokumen dari notaris, mereka ulangi proses tanpa biaya tambahan dan tetap tepat waktu." },
  { name: "Lestari Ningsih", role: "Owner, Batik Larasati", text: "Merek saya sempat hampir dibajak kompetitor. Untung pendaftaran DJKI lewat Digiman sudah jalan duluan. Sekarang brand saya aman total." },
  { name: "Yusuf Ramadhan", role: "Founder, EduSkill Academy", text: "Langit ke-7 mereka nyata: website + sistem manajemen siswa + otomasi marketing. Sekarang pendaftaran murid jalan sendiri 24 jam." },
  { name: "Clara Suryani", role: "Managing Partner, CS Consulting", text: "Saya langganan urus SPT klien-klien saya di sini. Konsultan pajaknya benar-benar bersertifikat dan fast response. 5 tahun tidak pernah telat lapor." },
  { name: "Hendra Gunawan", role: "Owner, Gudang Makan Sehat", text: "Sertifikasi halal + SNI selesai tanpa saya pusing. Harganya transparan dari awal, tidak ada biaya siluman seperti pengalaman saya di tempat lain." },
  { name: "Nadia Kusuma", role: "Co-Founder, Glowlab Skincare", text: "BPOM, merek, sampai website e-commerce semua ditangani satu tim. Koordinasinya gampang karena satu penanggung jawab akun." },
];

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
    a: "Bisa, 100% online. Dengan tanda tangan elektronik tersertifikasi (TTE) yang diakui Kemenkumham, akta dan pengesahan dapat dilakukan tanpa tatap muka. Dokumen asli kami kirim ke alamat Anda via kurir terjamin, atau Anda ambil di kantor kami.",
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

export async function getSiteData(): Promise<SiteData> {
  try {
    const [settingsRow, serviceRows, testimonialRows, faqRows, teamRows] = await Promise.all([
      db.siteSetting.findUnique({ where: { id: 1 } }),
      db.service.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.testimonial.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.faq.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    ]);

    const services: ServiceItem[] = serviceRows.map((s) => {
      let items: string[] = [];
      try {
        items = JSON.parse(s.features);
      } catch {
        items = [];
      }
      return {
        title: s.title,
        desc: s.desc,
        price: s.price,
        items,
        icon: s.icon,
        featured: s.featured,
      };
    });

    return {
      settings: settingsRow
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
          }
        : DEFAULT_SETTINGS,
      services: services.length > 0 ? services : DEFAULT_SERVICES,
      testimonials:
        testimonialRows.length > 0
          ? testimonialRows.map((t) => ({ name: t.name, role: t.role, text: t.text }))
          : DEFAULT_TESTIMONIALS,
      faqs: faqRows.length > 0 ? faqRows.map((f) => ({ q: f.question, a: f.answer })) : DEFAULT_FAQS,
      team: teamRows.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        division: t.division,
        photo: t.photo,
        order: t.order,
      })),
    };
  } catch (e) {
    console.error("getSiteData fallback ke data default:", e);
    return {
      settings: DEFAULT_SETTINGS,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      faqs: DEFAULT_FAQS,
      team: [],
    };
  }
}
