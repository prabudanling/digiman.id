"use client";

import { MapPin, Phone, Mail, FileBadge, Landmark } from "lucide-react";

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
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[minmax(0,4.5fr)_minmax(0,2.5fr)_minmax(0,2.5fr)_minmax(0,3.5fr)]">
          {/* Brand */}
          <div>
            <a href="#beranda" className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071410]/70 ring-1 ring-gold/45">
                { }
                <img src="/logo-emblem.png" alt="Logo PT Digital Bisnis Manajemen" className="h-9 w-9 object-contain" />
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
            <div className="mt-5 space-y-2 text-xs text-emerald-50/50">
              <p className="flex items-center gap-2">
                <Landmark className="h-3.5 w-3.5 shrink-0 text-gold/80" />
                SK Kemenkumham: <span className="text-emerald-100/75">AHU-059566.AH.01.30.Tahun 2022</span>
              </p>
              <p className="flex items-center gap-2">
                <FileBadge className="h-3.5 w-3.5 shrink-0 text-gold/80" />
                NIB (OSS-RBA): <span className="text-emerald-100/75">2612220035584</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                Berbadan hukum resmi sejak 26 Desember 2022
              </p>
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

          {/* Perusahaan */}
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

          {/* Kontak */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">Kantor & Kontak</h3>
            <ul className="space-y-4 text-sm text-emerald-50/55">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  Jl. Muararajeun Lama No.26, Kel. Cihaur Geulis, Kec. Cibeunying Kaler,
                  Kota Bandung, Jawa Barat 40122
                </span>
              </li>
              <li>
                <a
                  href="https://wa.me/6281333397223"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-emerald-200"
                >
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                  +62 813-3339-7223 (WhatsApp)
                </a>
              </li>
              <li>
                <a
                  href="mailto:halo@digiman.id"
                  className="flex items-center gap-3 transition-colors hover:text-emerald-200"
                >
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                  halo@digiman.id
                </a>
              </li>
            </ul>
          </div>
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
