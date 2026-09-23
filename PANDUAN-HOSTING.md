# PANDUAN DEPLOY — DIGIMAN.ID ke Shared Hosting (cPanel + Node.js App)

Website ini adalah aplikasi **Next.js (Node.js)** dengan database **SQLite file-based**.
Paket deploy ini **sudah self-contained**: tidak perlu `npm install`, tidak perlu MySQL,
tidak perlu setting environment — upload, daftarkan di cPanel, langsung jalan.

---

## 1. Persyaratan Hosting

| Kebutuhan | Keterangan |
|---|---|
| Fitur **Setup Node.js App** (Passenger) di cPanel | Tersedia di paket Niagahoster / Hostinger / Rumahweb / Domainesia / JS-hosting tingkat Pro ke atas. Jika menu ini tidak ada, hubungi support hosting untuk aktivasi Node.js. |
| **Node.js 20.9 atau lebih baru** | Next.js 16 menuntut minimal Node 20.9 (pilih 20, 22, atau 24 di dropdown cPanel). |
| Ruang disk ± 300 MB | Isi paket ± 160 MB (terkompresi ± 50 MB). |
| Tanpa MySQL, tanpa PHP | Database berupa file `db/custom.db` ikut dalam paket. |

> Hosting "shared hosting PHP saja" (tanpa Node.js) **tidak dapat** menjalankan
> panel admin & data dinamis. Naikkan paket ke yang mendukung Node.js App.

---

## 2. Langkah Pemasangan (± 10 menit)

### Langkah 1 — Upload paket
1. Login cPanel → **File Manager**.
2. Buat folder aplikasi, mis. `digiman-app` (di luar `public_html` lebih aman; boleh juga di dalam).
3. Upload `digiman-deploy.zip` ke folder itu → klik kanan → **Extract**.
4. Setelah extract, pastikan isi folder: `server.js`, `.next/`, `node_modules/`, `public/`, `db/custom.db`, `package.json`, `PANDUAN-HOSTING.md`.

### Langkah 2 — Daftarkan aplikasi Node.js
1. cPanel → cari menu **Setup Node.js App** (bagian Software).
2. Klik **Create Application**:
   - **Node.js version**: pilih yang paling tinggi (≥ 20).
   - **Application mode**: `Production`.
   - **Application root**: `digiman-app` (nama folder tadi).
   - **Application URL**: pilih domain/subdomain yang diinginkan (mis. `digiman.id`).
   - **Application startup file**: `server.js`  ← **paling penting**.
3. Klik **Create**. Lalu di halaman daftar aplikasi klik **Restart**.

### Langkah 3 — Selesai ✅
Buka domain Anda — website tampil dengan seluruh animasi.
Panel admin ada di: `https://domain-anda/admin`

| Akun | Nilai bawaan |
|---|---|
| Username | `admin` |
| Password | `digiman2025` |

> ⚠️ **WAJIB**: setelah login, buka menu **Akun Admin** dan ganti password.

---

## 3. Pengelolaan Konten Sehari-hari

- Semua konten (teks hero, WA, email, alamat, 29 layanan, testimoni, FAQ,
  kantor & cabang, struktur organisasi + foto direksi) diatur dari
  **Panel Admin** — tanpa perlu deploy ulang.
- Logo diunggah dari menu **Pengaturan**.
- Bahasa otomatis mengikuti bahasa browser pengunjung (10 bahasa), pengunjung
  juga bisa memilih manual via tombol bendera/globe di navbar.

## 4. Database & Backup

- Database = satu file: `db/custom.db` (SQLite).
- **Backup** = cukup download file itu dari File Manager.
- **Restore** = upload kembali file `.db` ke lokasi yang sama, restart aplikasi.
- Tidak ada kredensial database yang perlu diatur.

## 5. Environment (opsional)

Aplikasi bekerja tanpa environment apa pun. Jika ingin menyesuaikan, tambahkan
variabel di menu Setup Node.js App → **Environment variables**:

| Variabel | Default | Fungsi |
|---|---|---|
| `DATABASE_URL` | (otomatis) `file:<folder aplikasi>/db/custom.db` | Lokasi SQLite, hanya jika memindahkan DB ke tempat lain. Harus diawali `file:` dan menunjuk file yang benar-benar ada. |
| `AUTH_SECRET` | (bawaan tertanam) | Kunci sesi login admin. Disarankan diisi string acak panjang agar sesi tidak invalid saat redeploy. |
| `PORT` | otomatis oleh Passenger | Jangan diubah. |

## 6. Troubleshooting

| Gejala | Solusi |
|---|---|
| 503 / halaman error | Pastikan **startup file = `server.js`** dan Node version ≥ 20.9, lalu Restart. Cek log di menu Setup Node.js App → Log. |
| Website tampil tapi data kosong | Pastikan file `db/custom.db` ikut ter-upload (folder `db/`). |
| Foto/konten tidak tersimpan | Cek kuota disk; file foto tersimpan di dalam database. |
| Sesi admin tiba-tiba logout | Normal setelah redeploy bila `AUTH_SECRET` tidak diset — isi env `AUTH_SECRET`. |
| Domain masih menampilkan halaman hosting | Pastikan Application URL mengarah ke domain & DNS sudah benar. |

## 7. Update Aplikasi (deploy ulang)

1. Upload zip baru → extract menimpa (atau extract ke folder baru lalu pindahkan).
2. **Jangan menimpa `db/custom.db`** kecuali memang ingin mengganti konten.
3. Restart aplikasi di Setup Node.js App.

## 8. Kredit & Kepemilikan

Paket dan seluruh isinya adalah milik **PT Digital Bisnis Manajemen (DIGIMAN.ID)**.

| | |
|---|---|
| Pendiri & Direktur Utama | [Gugun Gunara](https://digiman.id) |
| Perusahaan | [digiman.id](https://digiman.id) |
| Ekosistem konsultan | [TOP Konsultan](https://topkonsultan.com) |
| Kerangka metodologi | Grand Design by Gunara — [topkonsultan.com](https://topkonsultan.com) |
| Figur kunci ekosistem | Muhammad Lutfi Azmi — [topkonsultan.com](https://topkonsultan.com) |
| Kontak resmi | [halo@digiman.id](mailto:halo@digiman.id) · [wa.me/6281316516524](https://wa.me/6281316516524) |
| Kantor | Tasikmalaya (HO) · Representative Office Jakarta SCBD (Gedung Bursa Efek Indonesia) · Bandung · Sukarame · Arjasari |

© 2026 PT Digital Bisnis Manajemen — All Rights Reserved.
