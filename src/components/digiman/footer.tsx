"use client";

import { Rocket } from "lucide-react";

const serviceLinks = [
  "Pendirian PT & CV",
  "PT PMA (Modal Asing)",
  "NIB, OSS & Izin Sektor",
  "Pendaftaran Merek & HKI",
  "Sertifikasi Halal & SNI",
  "Digitalisasi Bisnis",
];

const companyLinks = [
  { label: "7 Langit Legalitas", href: "#tujuh-langit" },
  { label: "Layanan", href: "#layanan" },
  { label: "Alur Kerja", href: "#proses" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-emerald-400/12 bg-[#040a08]">
      <div className="section-padding mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,3fr)]">
          {/* Brand */}
          <div>
            <a href="#beranda" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600">
                <Rocket className="h-5 w-5 text-emerald-950" strokeWidth={2.4} />
              </span>
              <span className="font-display text-xl font-bold text-white">
                DIGIMAN<span className="text-gold">.ID</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-emerald-50/55">
              <strong className="text-emerald-100/85">PT Digital Bisnis Manajemen</strong> — jasa konsultan
              pembuatan akta pendirian perusahaan, pengurusan seluruh legalitas usaha di Indonesia, dan
              konsultan manajemen digitalisasi. Dari akta di lantai dasar, sampai otomasi di langit ketujuh.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/5 px-4 py-2 text-xs font-semibold text-emerald-200/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Resmi terdaftar & berbadan hukum Indonesia
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Layanan">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">Layanan</h3>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a
                    href="#layanan"
                    className="text-sm text-emerald-50/55 transition-colors hover:text-emerald-200"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Perusahaan">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">Perusahaan</h3>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-emerald-50/55 transition-colors hover:text-emerald-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-emerald-400/10 pt-8 sm:flex-row">
          <p className="text-xs text-emerald-50/40">
            © {new Date().getFullYear()} PT Digital Bisnis Manajemen — DIGIMAN.ID. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-xs text-emerald-50/40">
            Dibangun dengan presisi di Indonesia, untuk pendakian bisnis Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
