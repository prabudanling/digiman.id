import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  return new PrismaClient({
    log: ['query'],
  })
}

function getClient(): PrismaClient {
  const existing = globalForPrisma.prisma
  // Deteksi instance lama hasil hot-reload yang dibuat sebelum skema diperbarui:
  // model/kolom baru tidak dikenal (mis. activityLog, heroHeadline) → buat client segar.
  // PENTING: setiap menambah model baru di schema.prisma, daftarkan juga di sini.
  const REQUIRED_MODELS = ['siteSetting', 'activityLog'] as const
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
