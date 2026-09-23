import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DIGIMAN.ID — Naikkan Bisnis Anda ke 7 Lapis Langit Legalitas & Digitalisasi",
  description:
    "PT Digital Bisnis Manajemen (DIGIMAN.ID) — Jasa pembuatan akta pendirian perusahaan (PT, CV, PT PMA) dan seluruh legalitas usaha di Indonesia: NIB, OSS, NPWP, Merek, Halal, hingga konsultan digitalisasi bisnis. Cepat, transparan, didampingi 46 dewan pakar.",
  keywords: [
    "jasa pendirian pt",
    "akta pendirian perusahaan",
    "legalitas usaha indonesia",
    "pendirian cv",
    "pt pma",
    "nib oss rba",
    "pendaftaran merek",
    "sertifikasi halal",
    "konsultan digitalisasi bisnis",
    "digiman.id",
  ],
  authors: [{ name: "PT Digital Bisnis Manajemen" }],
  metadataBase: new URL("https://digiman.id"),
  icons: {
    icon: "/favicon-digiman.png",
  },
  openGraph: {
    title: "DIGIMAN.ID — 7 Lapis Langit Legalitas Bisnis Indonesia",
    description:
      "Satu pintu dari akta pendirian sampai transformasi digital. Didampingi 46 dewan pakar lintas bidang.",
    url: "https://digiman.id",
    siteName: "DIGIMAN.ID",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGIMAN.ID — 7 Lapis Langit Legalitas Bisnis",
    description: "Jasa legalitas perusahaan & konsultan digitalisasi #1 di Indonesia.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050d0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headScripts = await getHeadScripts();
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Skrip analytics/pixel custom dari Panel Admin > SEO Lanjutan */}
        {headScripts ? (
          <script
            id="digiman-custom-head"
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: headScripts }}
          />
        ) : null}
      </head>
      <body className={`${jakarta.variable} ${grotesk.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

/** Baca kode skrip kustom dari DB (aman gagal: fallback string kosong) */
async function getHeadScripts(): Promise<string> {
  try {
    const { getSiteData } = await import("@/lib/site-data");
    const { settings } = await getSiteData();
    return settings.headScripts || "";
  } catch {
    return "";
  }
}
