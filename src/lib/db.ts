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
  // model baru (mis. siteSetting) tidak ada → buat client segar.
  if (existing) {
    const hasNewModels = (existing as unknown as Record<string, unknown>).siteSetting !== undefined
    if (hasNewModels) return existing
  }
  const fresh = createClient()
  globalForPrisma.prisma = fresh
  return fresh
}

export const db = getClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
