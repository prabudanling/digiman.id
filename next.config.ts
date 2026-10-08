import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Vercel/serverless: ikutkan SQLite + skema Prisma dalam bundle fungsi
  // agar beranda & panel admin tetap bisa membaca konten saat live.
  outputFileTracingIncludes: {
    "/**": ["./db/custom.db", "./prisma/schema.prisma"],
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Panel admin: file upload base64 via route handler
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
