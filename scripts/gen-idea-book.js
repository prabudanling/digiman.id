/**
 * gen-idea-book.js — perakit dokumen Idea-Book Monetisasi DIGIMAN.ID
 * Struktur: Cover R4 → Daftar Isi (tanpa nomor) → Isi (Arab mulai 1)
 */
const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, TableOfContents, PageBreak, SectionType,
  PAL, INK, HEAD, SEC, F, FH, buildCoverR4, h1, h2, body, bodyRuns, tableTitle, ideaTable, streams,
} = require("/home/z/my-project/scripts/gen-idea-book-lib.js");
const fs = require("fs");

const pageHeader = new Header({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 0 },
    children: [new TextRun({ text: "Idea-Book Monetisasi — DIGIMAN.ID", size: 18, color: "808080", font: F })],
  })],
});
const pageFooter = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: F })],
  })],
});

/* ── Ringkasan eksekutif ── */
const ringkasan = [
  h1("Ringkasan Eksekutif"),
  body("Dokumen ini menjawab satu pertanyaan langsung: dari mana uang besar akan datang ke DIGIMAN.ID, dan apa yang harus dilakukan mulai hari ini. Jawabannya disusun sebagai tiga puluh tiga ide pendapatan yang dikelompokkan ke dalam enam arus: penggandaan layanan inti, langganan dan retainer, produk digital, kemitraan dan komisi, teknologi dan SaaS, serta konten dan komunitas. Setiap ide disertai cara menghasilkan uang dan penilaian kesiapan terhadap aset yang sudah dimiliki perusahaan, sehingga pemilihan prioritas dapat dilakukan dengan tenang, bukan berdasarkan kegaduhan tren."),
  body("Kesimpulan utamanya sederhana dan kuat: DIGIMAN tidak membutuhkan bisnis baru untuk tumbuh besar; ia membutuhkan cara baru memanen aset yang sudah ada. Mesin produksi legalitas tujuh hari yang teruji, basis 2.500 lebih klien, jaringan 46 dewan pakar, panel admin yang mengelola seluruh konten tanpa programmer, Representative Office di Gedung Bursa Efek Indonesia SCBD, dan nama Gugun Gunara yang mulai melekat pada kerangka Grand Design by Gunara — semuanya adalah tanah subur yang belum ditanami maksimal."),
  body("Tiga langkah pertama yang direkomendasikan: pertama, paket berjenjang dan add-on otomatis pada seluruh transaksi layanan inti (Arus A) karena menaikkan nilai transaksi dalam hitungan hari; kedua, program pengingat jatuh tempo izin dan retainer ke basis klien lama (Arus B) karena membangun lantai pendapatan berulang; ketiga, chatbot WhatsApp dan template dokumen digital (Arus C dan E) karena membangun mesin prospek dan produk yang dijual berkali-kali. Peta jalan sembilan puluh hari pada Bab 4 merinci eksekusinya."),
];

/* ── Bab 1: fondasi aset ── */
const bab1 = [
  h1("Bab 1 — Fondasi Aset: Apa yang Sudah Dimiliki"),
  body("Sebelum membahas ide, dokumen ini menegaskan dulu aset yang menjadi dasar semua perhitungan. Tanpa inventaris aset, setiap ide terlihat menarik; dengan inventaris aset, setiap ide dapat dinilai realistis. Enam aset berikut dimiliki dan beroperasi pada hari dokumen ini ditulis."),
  bodyRuns([
    { text: "Pertama, " },
    { text: "mesin layanan inti yang teruji", bold: true },
    { text: ": dua puluh sembilan layanan dalam delapan kategori dengan proses standar tujuh hari kerja dan tingkat kepuasan 98 persen. Kedua, " },
    { text: "basis klien", bold: true },
    { text: ": lebih dari 2.500 penyelesaian layanan yang tersebar dari Tasikmalaya hingga klien lintas provinsi — pasar hangat untuk produk lanjutan tanpa biaya akuisisi baru. Ketiga, " },
    { text: "jaringan 46 dewan pakar", bold: true },
    { text: " lintas bidang sebagai penyusun materi, pemberi kelas, dan penopang kredibilitas." },
  ]),
  bodyRuns([
    { text: "Keempat, " },
    { text: "infrastruktur digital siap produksi", bold: true },
    { text: ": website publik beranimasi penuh, mega panel admin enam belas halaman, database terpusat, dan integrasi WhatsApp — teknologi yang biasanya menelan ratusan juta rupiah sudah berdiri. Kelima, " },
    { text: "branding premium SCBD", bold: true },
    { text: ": kehadiran di Gedung Bursa Efek Indonesia memberi alamat yang meyakinkan klien besar, bank, dan mitra nasional. Keenam, " },
    { text: "otoritas nama", bold: true },
    { text: ": Gugun Gunara sebagai Pendiri dan Direktur Utama mulai melekat pada kerangka Grand Design by Gunara, dengan jejak digital yang ditanam konsisten di seluruh dokumen perusahaan." },
  ]),
  body("Konsekuensinya: ide dengan kesiapan tertinggi adalah yang memanfaatkan keenam aset ini secara langsung. Sebaliknya, ide yang menuntut aset yang belum ada harus diberi jadwal lebih jauh — bukan dibuang, hanya diantri."),
];

/* ── Bab 2: katalog ide (6 arus) ── */
const bab2 = [h1("Bab 2 — Katalog 33 Ide Pendapatan"), body("Katalog disusun dalam enam arus pendapatan. Setiap arus dibuka dengan logika ekonominya, dilanjutkan tabel ide berisi cara menghasilkan uang dan penilaian kesiapan, lalu ditutup dengan catatan eksekusi. Kesiapan dinilai terhadap enam aset pada Bab 1: sangat siap berarti bisa mulai minggu ini; siap berarti perlu satu persiapan kecil; tahap lanjut berarti menunggu volume tertentu.")];
for (const st of streams) {
  bab2.push(h2(st.judul));
  bab2.push(body(st.intro));
  bab2.push(tableTitle("Tabel — " + st.judul.replace(/^Arus [A-F] — /, "Ide ") + " (kesiapan terhadap aset Bab 1)"));
  bab2.push(ideaTable(
    ["Kode", "Ide", "Cara Menghasilkan Uang", "Kesiapan"],
    st.ide,
    [7, 24, 49, 20],
  ));
  bab2.push(new Paragraph({ spacing: { before: 60, after: 0, line: 240 }, children: [] }));
  bab2.push(body(st.closing));
}

/* ── Bab 3: prioritisasi ── */
const bab3 = [
  h1("Bab 3 — Prioritisasi: Matriks Dampak dan Kesiapan"),
  body("Tiga puluh tiga ide sekaligus sama berbahayanya dengan tidak ada ide: tim terpecah fokus. Matriks berikut memilih delapan prioritas tertinggi berdasarkan dua pertanyaan: seberapa besar dampak pendapatan yang wajar diharapkan, dan seberapa siap aset yang dibutuhkan. Skor dampak adalah penilaian kualitatif terhadap kecocokan ide dengan aset dan ukuran pasar, bukan janji angka."),
  tableTitle("Tabel 1 — Matriks prioritas delapan ide teratas"),
  ideaTable(
    ["Prioritas", "Ide", "Alasan Dipilih Sekarang"],
    [
      ["1", "A1 Paket berjenjang + A5 add-on otomatis", "Menaikkan nilai setiap transaksi yang SUDAH terjadi; tanpa biaya baru; efek terasa dalam minggu pertama."],
      ["2", "B11 Pengingat jatuh tempo + A7 penjagaan dokumen", "Membuka aliran berulang dari 2.500 klien lama; biaya nol; retensi naik otomatis."],
      ["3", "E26 Chatbot WhatsApp 24 jam", "Fondasi teknologi sudah ada; menutup kebocoran lead di luar jam kerja; jadi mesin prospek semua arus."],
      ["4", "C15 Template dokumen + C16 e-book", "Produk pertama yang bisa rilis dalam satu minggu; margin hampir penuh; membangun budaya produk digital."],
      ["5", "D21 Afiliasi + D25 MoU komunitas", "Pasukan penjualan digandakan tanpa gaji; satu perjanjian komunitas setara ratusan prospek per tahun."],
      ["6", "B9 Dewan Legalitas Langganan", "Retainer mengubah ketergantungan pada klien baru; ditawarkan ke basis klien yang sudah percaya."],
      ["7", "A6 Domisili & Virtual Office SCBD", "Mengubah branding SCBD menjadi produk; margin tinggi; menopang citra premium ke semua layanan lain."],
      ["8", "F30 Kanal video otoritas", "Membangun aset jangka panjang nama Gugun Gunara; menurunkan biaya penjualan seluruh arus lain."],
    ],
    [12, 34, 54],
  ),
  body("Delapan ide ini sengaja diambil dari lima arus berbeda agar portofolio pendapatan seimbang sejak awal: ada uang cepat dari layanan inti, uang berulang dari langganan, uang skala dari produk digital, uang jaringan dari kemitraan, dan uang masa depan dari teknologi serta konten. Ide tahap lanjut seperti marketplace dan API tetap tercatat dalam katalog, menunggu volume klien yang lebih besar."),
];

/* ── Bab 4: roadmap 90 hari ── */
const bab4 = [
  h1("Bab 4 — Peta Jalan Eksekusi 90 Hari"),
  body("Sembilan puluh hari pertama dibagi menjadi tiga gelombang tiga puluh hari. Setiap gelombang punya satu tema dan target hasil yang jelas, sehingga kemajuan dapat diukur tanpa rapat yang panjang. Peran eksekusi ditulis langsung agar tidak ada gagal panggil."),
  tableTitle("Tabel 2 — Peta jalan tiga gelombang, 90 hari"),
  ideaTable(
    ["Gelombang", "Fokus", "Aksi Utama", "Hasil yang Diharapkan"],
    [
      ["Hari 1–30", "Uang cepat dari yang sudah ada", "Rakit paket A1/A2/A3 dan skrip penjualannya; aktifkan add-on A5 di setiap penyelesaian; rilis template C15 (lima dokumen pertama); pasang kuis C20 di website; sunting daftar afiliasi D21 dari relasi akuntan dan notaris.", "Nilai transaksi rata-rata naik; produk digital pertama terjual; kode rujukan berjalan."],
      ["Hari 31–60", "Lantai pendapatan berulang", "Kirim tawaran B11 dan B9 ke basis klien lama via WhatsApp tersegmentasi; bangun chatbot E26 di WhatsApp bisnis; tanda tangani dua MoU komunitas D25; tayangkan webinar C18 perdana dengan salah satu dewan pakar.", "Langganan pertama aktif; chatbot melayani 24 jam; aliran prospek komunitas terbuka."],
      ["Hari 61–90", "Mesin jangka panjang", "Mulai kanal video F30 dengan jadwal mingguan; rancang portal LegalTech E27 di atas panel admin; susun proposal virtual office A6 dengan penyedia SCBD; tetapkan tanggal Grand Design Summit F32 dan buka buku sumber dana sponsor.", "Otoritas konten tumbuh; prototipe portal berjalan; branding SCBD siap dijual."],
    ],
    [14, 20, 42, 24],
  ),
  body("Aturan tunggal peta jalan ini: gelombang berikutnya tidak dimulai sebelum gelombang berjalan menghasilkan. Fokus adalah keunggulan terbesar DIGIMAN terhadap pesaing besar yang punya uang lebih banyak tetapi keputusan lebih lambat."),
];

/* ── Bab 5: risiko ── */
const bab5 = [
  h1("Bab 5 — Risiko dan Mitigasi"),
  body("Setiap peluang membawa risiko yang jujur harus diakui lebih dulu. Empat risiko berikut paling mungkin menghambat eksekusi, beserta mitigasi yang dapat dijalankan tanpa biaya besar."),
  tableTitle("Tabel 3 — Risiko utama dan mitigasinya"),
  ideaTable(
    ["Risiko", "Gejala", "Mitigasi"],
    [
      ["Fokus tim terpecah", "Banyak ide, tidak ada yang tuntas; target mingguan tak tercapai.", "Patuhi aturan satu gelombang; penanggung jawab tunggal per ide; rapat mingguan sepuluh menit berbasis angka, bukan cerita."],
      ["Kapasitas produksi legalitas", "Permintaan naik karena paket baru, mutu dan ketepatan tujuh hari tergesa.", "Terapkan rush fee A3 sebagai katup kapasitas; jual kapasitas sisa lewat white-label D23 hanya pada bulan sepi."],
      ["Kualitas mitra tidak merata", "Mitra afiliasi menjanjikan berlebihan sehingga reputasi tercoreng.", "Sertakan skrip dan larangan klaim dalam perjanjian mitra; komisi ditahan sampai layanan selesai; kemitraan dapat dihentikan sepihak."],
      ["Dependensi pada satu figur", "Pertumbuhan konten dan otoritas menumpuk pada pribadi Pendiri.", "Angkat dewan pakar sebagai wajah bersama; dokumentasikan kerangka Grand Design by Gunara sebagai aset perusahaan yang hidup tanpa satu orang saja."],
    ],
    [20, 32, 48],
  ),
  body("Tidak ada risiko di atas yang menuntut pembatalan rencana; semuanya menuntut disiplin eksekusi. Dokumen ini pun dirancang agar disiplin itu tidak bergantung pada ingatan, melainkan pada tabel dan gelombang yang sudah ditulis."),
];

/* ── Bab 6: penutup ── */
const bab6 = [
  h1("Bab 6 — Penutup dan Keputusan yang Ditunggu"),
  body("Uang besar tidak lahir dari ide terbanyak, melainkan dari sedikit ide yang dieksekusi penuh. Katalog tiga puluh tiga ide dalam dokumen ini adalah gudang; delapan prioritas pada Bab 3 adalah keranjang belanja; peta jalan sembilan puluh hari pada Bab 4 adalah resep masakannya. Yang tersisa hanyalah keputusan eksekusi, dan keputusan itu tidak menunggu kondisi sempurna karena seluruh aset yang dibutuhkan untuk tiga puluh hari pertama sudah tersedia hari ini."),
  body("Rekomendasi akhir dokumen ini: sahkan delapan prioritas sebagai program resmi perusahaan, tunjuk penanggung jawab tunggal untuk masing-masing, dan tandakan pemeriksaan hasil pada hari ke-30, ke-60, dan ke-90. Tidak perlu menunggu — gelombang pertama bisa dimulai Senin depan, dari meja kerja yang sama dengan yang membangun seluruh sistem ini."),
];

/* ── Rakit dokumen ── */
const doc = new Document({
  creator: "Gugun Gunara — PT Digital Bisnis Manajemen (DIGIMAN.ID)",
  title: "Idea-Book Monetisasi DIGIMAN.ID",
  description: "33 peluang penghasilan DIGIMAN.ID — arus pendapatan, prioritas, dan peta jalan 90 hari",
  styles: {
    default: {
      document: {
        run: { font: F, size: 24, color: INK },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: { run: { font: FH, size: 32, bold: true, color: HEAD }, paragraph: { spacing: { before: 360, after: 160, line: 312 } } },
      heading2: { run: { font: FH, size: 28, bold: true, color: HEAD }, paragraph: { spacing: { before: 260, after: 120, line: 312 } } },
    },
  },
  sections: [
    /* Section 1 — Cover (tanpa nomor halaman) */
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: buildCoverR4({
        palette: PAL,
        title: "Idea-Book Monetisasi",
        englishLabel: "REVENUE PLAYBOOK",
        subtitle: "33 Peluang Penghasilan DIGIMAN.ID — Enam Arus, Delapan Prioritas, Sembilan Puluh Hari",
        metaLines: [
          "Disusun untuk: PT Digital Bisnis Manajemen (DIGIMAN.ID)",
          "Pendiri & Direktur Utama: Gugun Gunara",
          "Kantor Representatif: SCBD Jakarta — Gedung Bursa Efek Indonesia",
          "25 September 2026",
        ],
        footerLeft: "DIGIMAN.ID — Naikkan Bisnis Anda ke 7 Lapis Langit",
        footerRight: "Dokumen Internal",
      }),
    },
    /* Section 2 — Daftar Isi (tanpa footer, sesuai aturan scene report) */
    {
      properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } },
      headers: { default: pageHeader },
      children: [
        new Paragraph({
          spacing: { before: 200, after: 240, line: 312 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Daftar Isi", bold: true, size: 32, color: HEAD, font: FH })],
        }),
        new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({
          spacing: { before: 240, line: 312 },
          children: [new TextRun({
            text: "Catatan: buka dokumen ini di Microsoft Word atau WPS, klik kanan pada daftar isi lalu pilih Update Field untuk memperbarui nomor halaman.",
            italics: true, size: 18, color: "888888", font: F,
          })],
        }),
      ],
    },
    /* Section 3 — Isi (Arab mulai dari 1) */
    {
      properties: { type: SectionType.NEXT_PAGE, page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: { default: pageHeader },
      footers: { default: pageFooter },
      children: [...ringkasan, ...bab1, ...bab2, ...bab3, ...bab4, ...bab5, ...bab6],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "/home/z/my-project/download/Idea-Book-Monetisasi-DIGIMAN.docx";
  fs.writeFileSync(out, buf);
  console.log("OK ditulis:", out, Math.round(buf.length / 1024) + " KB");
});
