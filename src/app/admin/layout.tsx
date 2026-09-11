import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Admin — DIGIMAN.ID",
  description: "Panel administrasi konten website PT Digital Bisnis Manajemen.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
