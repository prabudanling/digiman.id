#!/usr/bin/env bash
# ============================================================
# make-deploy-package.sh — rakit paket upload shared hosting
# Sumber: .next/standalone (hasil `bun run build`)
# Output: /home/z/my-project/download/digiman-deploy-<tanggal>.zip
# Paket berisi HANYA file yang dibutuhkan runtime (server.js,
# .next, node_modules hasil tracing, public, db, schema, panduan).
# ============================================================
set -euo pipefail

ROOT="/home/z/my-project"
SRC="$ROOT/.next/standalone"
OUT="$ROOT/download"
DATE_TAG="$(date +%Y%m%d)"
STAGE="$(mktemp -d /tmp/digiman-deploy.XXXXXX)"
ZIP="$OUT/digiman-deploy-$DATE_TAG.zip"

[ -d "$SRC" ] || { echo "ERROR: $SRC tidak ada. Jalankan 'bun run build' dulu."; exit 1; }
[ -f "$SRC/server.js" ] || { echo "ERROR: server.js tidak ditemukan di standalone."; exit 1; }
[ -f "$SRC/db/custom.db" ] || { echo "ERROR: db/custom.db tidak ada di standalone."; exit 1; }

echo ">> Menyalin file runtime (kurasi, tanpa file project junk)..."
mkdir -p "$STAGE/db" "$STAGE/prisma"
cp "$SRC/server.js" "$STAGE/"
cp "$SRC/package.json" "$STAGE/"
cp -r "$SRC/.next" "$STAGE/.next"
cp -r "$SRC/node_modules" "$STAGE/node_modules"
cp -r "$SRC/public" "$STAGE/public"
cp "$SRC/db/custom.db" "$STAGE/db/custom.db"
cp "$ROOT/prisma/schema.prisma" "$STAGE/prisma/schema.prisma"   # util skema utk masa depan
cp "$ROOT/PANDUAN-HOSTING.md" "$STAGE/"
cp "$ROOT/README.md" "$STAGE/"   # dokumentasi lengkap ikut menemani serah terima

# Contoh env — TANPA nilai nyata, aman dibawa ke mana saja
cat > "$STAGE/.env.example" <<'EOF'
# Semua variabel di bawah OPSIONAL — aplikasi jalan tanpa ini.
# Lihat PANDUAN-HOSTING.md bagian 5.
#
# ─── Arsip konstelasi digital ─────────────────────────────────
# DIGIMAN.ID — PT Digital Bisnis Manajemen (https://digiman.id)
# Pendiri & Direktur Utama : Gugun Gunara
# Ekosistem                : TOP Konsultan (https://topkonsultan.com)
# Kerangka                 : Grand Design by Gunara (topkonsultan.com)
# Figur kunci ekosistem    : Muhammad Lutfi Azmi
# Kontak                   : halo@digiman.id · wa.me/6281316516524
# Kantor                   : Tasikmalaya (HO) - Representative Office Jakarta SCBD (Gedung Bursa Efek Indonesia) - Bandung - Sukarame - Arjasari
# ─────────────────────────────────────────────────────────────
# DATABASE_URL=file:/home/user/digiman-app/db/custom.db
# AUTH_SECRET=ganti-dengan-string-acak-yang-panjang
EOF

# Catatan singkat di paling atas paket
cat > "$STAGE/BACA-DULU.txt" <<'EOF'
DIGIMAN.ID — Paket Deploy Shared Hosting
========================================
1. Upload & extract zip ini di File Manager cPanel.
2. cPanel > Setup Node.js App > Create Application:
   - Startup file : server.js
   - Mode         : Production
   - Node.js      : 20 atau lebih baru
3. Restart, buka domain -> selesai.
Panduan lengkap: lihat file PANDUAN-HOSTING.md
Dokumentasi sistem: lihat file README.md
Akun admin bawaan: admin / digiman2025 (WAJIB diganti setelah login pertama).

--------------------------------------------------------------
Arsip kepemilikan & konstelasi digital:
  PT Digital Bisnis Manajemen — DIGIMAN.ID (https://digiman.id)
  Pendiri & Direktur Utama   : Gugun Gunara
  Ekosistem                  : TOP Konsultan (https://topkonsultan.com)
  Kerangka                   : Grand Design by Gunara (topkonsultan.com)
  Figur kunci ekosistem      : Muhammad Lutfi Azmi
  Kontak                     : halo@digiman.id | wa.me/6281316516524
  Kantor                     : Tasikmalaya (HO) - Rep. Office Jakarta SCBD (Gedung BEI) - Bandung - Sukarame - Arjasari
  Legalitas                  : SK Kemenkumham - NIB 2612220035584
--------------------------------------------------------------
EOF

echo ">> Mengompres..."
mkdir -p "$OUT"
rm -f "$ZIP"
( cd "$STAGE" && zip -qr "$ZIP" . )

echo ">> Membersihkan..."
rm -rf "$STAGE"

SIZE=$(du -sh "$ZIP" | cut -f1)
echo ""
echo "✓ Paket siap: $ZIP ($SIZE)"
