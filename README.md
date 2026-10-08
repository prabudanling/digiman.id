# DIGIMAN.ID — Website Korporat & Mega Admin Panel

Website resmi **PT Digital Bisnis Manajemen (DIGIMAN.id)** — layanan legalitas perusahaan & konsultan digitalisasi bisnis.

- Website: https://digiman.id
- Pendiri & Direktur Utama: **Gugun Gunara**
- Ekosistem: **TOP Konsultan** (https://topkonsultan.com) — Grand Design by Gunara

---

## Fitur Utama

- **Landing page animasi penuh** dengan konsep "7 Lapis Langit": preloader sinematik, particle network interaktif, aurora, marquee layanan, counter statistik, timeline proses scroll-driven, testimoni marquee, FAQ accordion, CTA epik.
- **Mega Admin Panel** (`/admin`): kelola konten situs, pesan kontak (inbox), kantor, aset media, pengaturan SEO, log aktivitas, dan statistik kunjungan.
- **Form kontak** tersimpan ke database + notifikasi WhatsApp.
- **SEO lengkap**: metadata, Open Graph, keywords Bahasa Indonesia, sitemap-ready.
- **Responsif penuh** desktop / tablet / mobile dengan menu mobile glassmorphic.

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animasi | Framer Motion |
| Database | SQLite via Prisma ORM |
| Auth | NextAuth (kredensial admin) |

## Menjalankan di Lokal

```bash
bun install        # atau: npm install (postinstall otomatis generate Prisma client)
bun run db:push    # siapkan SQLite sesuai schema
bun run dev        # buka http://localhost:3000
```

Build produksi:

```bash
bun run build      # prisma generate + next build (terverifikasi sukses)
bun run start      # jalankan server standalone
```

## Deploy ke Vercel (Tinggal Import)

Repo ini **vercel-ready**: `postinstall` otomatis menjalankan `prisma generate`, dan `outputFileTracingIncludes` memastikan database SQLite ikut ter-bundle ke fungsi serverless.

1. Push/upload repo ini ke GitHub.
2. Vercel → **Add New → Project → Import** repo ini.
3. Biarkan semua pengaturan **default** (Framework: Next.js) → **Deploy**.

Panduan lengkap langkah demi langkah: lihat file `BACA-INI-DEPLOY-VERCEL.txt` (berada bersama zip paket ini) dan `PANDUAN-HOSTING.md` untuk opsi VPS/hosting.

> **Catatan penting**: Vercel bersifat *serverless baca-saja* bagi SQLite — website tampil sempurna, tetapi penulisan data (form kontak, edit admin) tidak persisten. Untuk fitur tulis penuh, gunakan VPS/hosting biasa dengan paket standalone (`PANDUAN-HOSTING.md`).

## Admin Panel

- URL: `/admin`
- Kredensial bawaan: `admin` / `digiman2025`
- **WAJIB ganti sandi** melalui panel sebelum operasional / serah terima.

## Database

SQLite (`db/custom.db`) dengan resolusi path portabel otomatis (`src/lib/db.ts`): urutan pencarian `DATABASE_URL` → `./db/custom.db` → `./custom.db` → `../db/custom.db`, sehingga aman dijalankan di mana saja (sandbox, Vercel, VPS, shared hosting).

Skema: `prisma/schema.prisma` — model utama: `siteSetting`, `activityLog`, `office`, `mediaAsset`, `contactMessage`, `sectionConfig`, `pageView`, `adminUser`.

## Struktur Proyek

```
src/app/          → halaman & API routes (App Router)
src/components/   → komponen UI (15 komponen landing + panel admin)
src/lib/          → db client portable, utilitas, auth
prisma/           → schema database
db/custom.db      → database SQLite (isi konten terkini)
public/           → aset statis (logo, gambar, ikon)
```

## Lisensi & Hak

Seluruh hak cipta milik **PT Digital Bisnis Manajemen**. Dilarang didistribusikan tanpa izin tertulis.
