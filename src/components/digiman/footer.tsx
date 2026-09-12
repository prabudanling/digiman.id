"use client";

import { MapPin, Phone, Mail, FileBadge, Landmark, Lock, Clock, Instagram, Linkedin, Building } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";
import type { OfficeItem } from "@/lib/site-data";

interface FooterProps {
  logoUrl?: string | null;
  waNumber?: string;
  waDisplay?: string;
  email?: string;
  addressFull?: string;
  hours?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  offices?: OfficeItem[];
}

/** Ikon TikTok inline (lucide tidak menyediakan). */
function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer({
  logoUrl,
  waNumber = "6281333397223",
  waDisplay = "+62 813-3339-7223",
  email = "halo@digiman.id",
  addressFull = "Andalusia Garden Cluster Granada No.11, Mangkubumi, Tasikmalaya, 46181, Jawa Barat",
  hours = "Senin–Jumat 09.00–17.00 WIB",
  instagram = "",
  linkedin = "",
  tiktok = "",
  offices = [],
}: FooterProps) {
  const { dict } = useI18n();

  const socials = [
    { name: "Instagram", url: instagram, Icon: Instagram },
    { name: "LinkedIn", url: linkedin, Icon: Linkedin },
    { name: "TikTok", url: tiktok, Icon: TikTokIcon },
  ].filter((s) => s.url);

  const companyLinks = [
    { label: dict.nav.seven, href: "#tujuh-langit" },
    { label: dict.nav.services, href: "#layanan" },
    { label: dict.nav.process, href: "#proses" },
    { label: dict.nav.testimonials, href: "#testimoni" },
    { label: dict.nav.faq, href: "#faq" },
    { label: dict.footer.contactTitle, href: "#kontak" },
  ];

  const officeList =
    offices.length > 0
      ? offices.slice().sort((a, b) => a.order - b.order)
      : [{ type: "HEAD", label: dict.offices.hq, address: addressFull, order: 1 }];

  return (
    <footer className="relative mt-auto border-t border-emerald-400/12 bg-[#040a08]">
      <div className="section-padding mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[minmax(0,4fr)_minmax(0,2.4fr)_minmax(0,2.2fr)_minmax(0,3fr)_minmax(0,3.4fr)]">
          {/* Brand */}
          <div>
            <a href="#beranda" className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071410]/70 ring-1 ring-gold/45">
                <img
                  src={logoUrl || "/logo-emblem.png"}
                  alt="Logo PT Digital Bisnis Manajemen"
                  className="h-9 w-9 object-contain"
                />
              </span>
              <span className="font-display text-xl font-bold text-white">
                DIGIMAN<span className="text-gold">.ID</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-emerald-50/55">{dict.footer.about}</p>
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

          {/* Layanan */}
          <nav aria-label={dict.footer.serviceTitle}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">
              {dict.footer.serviceTitle}
            </h3>
            <ul className="space-y-3">
              {dict.footer.links.map((s) => (
                <li key={s}>
                  <a href="#layanan" className="text-sm text-emerald-50/55 transition-colors hover:text-emerald-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navigasi */}
          <nav aria-label={dict.footer.quickTitle}>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">
              {dict.footer.quickTitle}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-emerald-50/55 transition-colors hover:text-emerald-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kantor */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">
              {dict.footer.officeTitle}
            </h3>
            <ul className="space-y-4 text-sm text-emerald-50/55">
              {officeList.map((o) => (
                <li key={o.label} className="flex items-start gap-3">
                  {o.type === "HEAD" ? (
                    <Building className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  ) : (
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                  <span>
                    <span className={`block text-xs font-bold ${o.type === "HEAD" ? "text-gold-light" : "text-emerald-100/80"}`}>
                      {o.label}
                    </span>
                    {o.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold-light">
              {dict.footer.contactTitle}
            </h3>
            <ul className="space-y-4 text-sm text-emerald-50/55">
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-emerald-200"
                >
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                  {waDisplay} (WhatsApp)
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 transition-colors hover:text-emerald-200">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  <span className="block text-xs font-bold text-emerald-100/80">{dict.offices.hoursLabel}</span>
                  {hours}
                </span>
              </li>
            </ul>
            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ name, url, Icon }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-950/40 text-emerald-100/70 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold-light"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-emerald-400/10 pt-8 sm:flex-row">
          <p className="text-xs text-emerald-50/40">{dict.footer.rights.replace("2026", String(new Date().getFullYear()))}</p>
          <div className="flex items-center gap-5">
            <p className="text-xs text-emerald-50/40">Made with precision in Tasikmalaya & Bandung, Indonesia.</p>
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-50/30 transition-colors hover:text-gold-light"
              aria-label="Masuk panel admin"
            >
              <Lock className="h-3 w-3" />
              {dict.footer.admin}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
