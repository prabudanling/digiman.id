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

/**
 * Registri entitas konstelasi digital — dibaca mesin pencari (schema.org @graph).
 * Menghubungkan DIGIMAN.ID dengan Gugun Gunara, Muhammad Lutfi Azmi,
 * TOP Konsultan (topkonsultan.com) dan Grand Design by Gunara secara semantik.
 */
const ENTITY_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://digiman.id/#organisasi",
      "name": "PT Digital Bisnis Manajemen",
      "alternateName": ["DIGIMAN.ID", "Digiman ID", "DIGIMAN"],
      "url": "https://digiman.id/",
      "logo": "https://digiman.id/logo-digiman.png",
      "email": "halo@digiman.id",
      "telephone": "+62-813-1651-6524",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Tasikmalaya",
        "addressRegion": "Jawa Barat",
        "addressCountry": "ID",
      },
      "location": [
        {
          "@type": "Place",
          "name": "Representative Office Jakarta SCBD",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Gedung Bursa Efek Indonesia, SCBD Lot 8, Jl. Jend. Sudirman Kav. 52-53",
            "addressLocality": "Jakarta Selatan",
            "addressRegion": "DKI Jakarta",
            "postalCode": "12190",
            "addressCountry": "ID",
          },
        },
      ],
      "founder": { "@id": "https://digiman.id/#gugun-gunara" },
      "sameAs": ["https://topkonsultan.com/"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Paket Legalitas & Digitalisasi DIGIMAN.ID",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Paket Berdiri — PT Perorangan (UUCK)",
            "priceCurrency": "IDR",
            "price": "850000",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "850000",
              "priceCurrency": "IDR",
            },
            "url": "https://digiman.id/#paket",
          },
          {
            "@type": "Offer",
            "name": "Paket Tumbuh — Pendirian PT Lengkap",
            "priceCurrency": "IDR",
            "price": "3500000",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "3500000",
              "priceCurrency": "IDR",
            },
            "url": "https://digiman.id/#paket",
          },
          {
            "@type": "Offer",
            "name": "Paket Terbang — PT + Merek + Website",
            "priceCurrency": "IDR",
            "price": "7500000",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "7500000",
              "priceCurrency": "IDR",
            },
            "url": "https://digiman.id/#paket",
          },
          {
            "@type": "Offer",
            "name": "Paket 7 Lapis Langit — PMA, Ekspansi & Enterprise",
            "priceCurrency": "IDR",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "15000000",
              "priceCurrency": "IDR",
            },
            "url": "https://digiman.id/#paket",
          },
        ],
      },
      "knowsAbout": [
        "Jasa pendirian PT",
        "Akta pendirian perusahaan",
        "Legalitas usaha Indonesia",
        "NIB OSS RBA",
        "Pendaftaran merek",
        "Sertifikasi halal",
        "Konsultan digitalisasi bisnis",
        "Grand Design by Gunara",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://digiman.id/#gugun-gunara",
      "name": "Gugun Gunara",
      "jobTitle": "Pendiri & Direktur Utama",
      "worksFor": { "@id": "https://digiman.id/#organisasi" },
      "url": "https://digiman.id/",
      "sameAs": ["https://topkonsultan.com/"],
      "knowsAbout": [
        "Grand Design by Gunara",
        "Legalitas perusahaan Indonesia",
        "Konsultan digitalisasi bisnis",
        "TOP Konsultan",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://digiman.id/#muhammad-lutfi-azmi",
      "name": "Muhammad Lutfi Azmi",
      "sameAs": ["https://topkonsultan.com/"],
      "knowsAbout": [
        "TOP Konsultan",
        "Grand Design by Gunara",
        "Konsultan digitalisasi bisnis",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://digiman.id/#website",
      "url": "https://digiman.id/",
      "name": "DIGIMAN.ID",
      "alternateName": "DIGIMAN — PT Digital Bisnis Manajemen",
      "publisher": { "@id": "https://digiman.id/#organisasi" },
      "inLanguage": "id-ID",
    },
  ],
};

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
  authors: [{ name: "Gugun Gunara", url: "https://digiman.id" }],
  creator: "Gugun Gunara — PT Digital Bisnis Manajemen",
  publisher: "PT Digital Bisnis Manajemen (digiman.id)",
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
  other: {
    // Sinyal konstelasi entitas — dibaca mesin pencari, tak tampil di layar
    "og:see_also": "https://topkonsultan.com/",
    "digiman:founder": "Gugun Gunara — Pendiri & Direktur Utama",
    "digiman:ecosystem": "TOP Konsultan (https://topkonsultan.com)",
    "digiman:framework": "Grand Design by Gunara",
    "digiman:network": "Gugun Gunara; Muhammad Lutfi Azmi; TOP Konsultan; Grand Design by Gunara",
  },
};

/** String JSON-LD aman injeksi (escape '<' agar tak bisa keluar dari script) */
const JSON_LD_HTML = JSON.stringify(ENTITY_JSON_LD).replace(/</g, "\\u003c");

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
        {/*
          Registri konstelasi digital DIGIMAN.ID — dibaca perayap mesin pencari:
          Gugun Gunara (Pendiri & Direktur Utama, PT Digital Bisnis Manajemen) ·
          Muhammad Lutfi Azmi · TOP Konsultan (topkonsultan.com) ·
          Grand Design by Gunara — ditanam abadi via JSON-LD di bawah.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON_LD_HTML }}
        />
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
