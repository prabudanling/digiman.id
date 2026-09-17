import path from 'node:path'
import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Resolusi lokasi file SQLite saat RUNTIME (wajib agar portable):
 * .env saat dev memakai path absolut mesin ini (file:/home/z/...), yang pasti
 * salah di shared hosting. Urutan pencarian:
 *   1. DATABASE_URL env (jika file-nya benar-benar ada)
 *   2. ./db/custom.db  relatif thd folder aplikasi (cwd)  <- pola deploy paket
 *   3. ./custom.db     (kalau db ditaruh sejajar server.js)
 *   4. ../db/custom.db (kalau cwd adalah subfolder)
 * Semua path diubah ke ABSOLUT agar Prisma & standalone build konsisten.
 */
function resolveDatabaseUrl(): string {
  const candidates: string[] = []
  const envUrl = process.env.DATABASE_URL
  if (envUrl && envUrl.startsWith('file:')) candidates.push(envUrl)
  candidates.push('file:' + path.join(process.cwd(), 'db', 'custom.db'))
  candidates.push('file:' + path.join(process.cwd(), 'custom.db'))
  candidates.push('file:' + path.join(process.cwd(), '..', 'db', 'custom.db'))

  for (const url of candidates) {
    const raw = url.slice(5)
    const abs = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw)
    try {
      if (fs.existsSync(abs) && fs.statSync(abs).size > 0) return 'file:' + abs
    } catch {
      /* coba kandidat berikutnya */
    }
  }
  // Tidak ada file DB ditemukan — arahkan ke lokasi standar (Prisma akan
  // membuat file baru; admin bisa isi konten via panel).
  return 'file:' + path.join(process.cwd(), 'db', 'custom.db')
}

const databaseUrl = resolveDatabaseUrl()

function createClient() {
  return new PrismaClient({
    // Query logging hanya untuk dev; produksi cukup error (log hosting bersih)
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
    datasourceUrl: databaseUrl,
  })
}

function getClient(): PrismaClient {
  const existing = globalForPrisma.prisma
  // Deteksi instance lama hasil hot-reload yang dibuat sebelum skema diperbarui:
  // model/kolom baru tidak dikenal (mis. activityLog, heroHeadline) → buat client segar.
  // PENTING: setiap menambah model baru di schema.prisma, daftarkan juga di sini.
  const REQUIRED_MODELS = ['siteSetting', 'activityLog', 'office'] as const
  if (existing) {
    const probe = existing as unknown as Record<string, unknown>
    const hasAllModels = REQUIRED_MODELS.every((m) => probe[m] !== undefined)
    if (hasAllModels) return existing
  }
  const fresh = createClient()
  globalForPrisma.prisma = fresh
  return fresh
}

export const db = getClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
