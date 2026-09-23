/**
 * Sistem multi-bahasa DIGIMAN.ID — 10 bahasa teratas dunia.
 * Locale "id" adalah sumber kebenaran (konten dikelola admin via DB).
 * Locale lain memakai kamus statis; kunci yang hilang otomatis fallback ke "id".
 */

export const LOCALES = ["id", "en", "zh", "es", "hi", "ar", "fr", "pt", "ru", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<Locale, { name: string; native: string; dir: "ltr" | "rtl" }> = {
  id: { name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr" },
  en: { name: "English", native: "English", dir: "ltr" },
  zh: { name: "Chinese", native: "中文", dir: "ltr" },
  es: { name: "Spanish", native: "Español", dir: "ltr" },
  hi: { name: "Hindi", native: "हिन्दी", dir: "ltr" },
  ar: { name: "Arabic", native: "العربية", dir: "rtl" },
  fr: { name: "French", native: "Français", dir: "ltr" },
  pt: { name: "Portuguese", native: "Português", dir: "ltr" },
  ru: { name: "Russian", native: "Русский", dir: "ltr" },
  ja: { name: "Japanese", native: "日本語", dir: "ltr" },
};

export interface SvcContent {
  title: string;
  desc: string;
  price: string;
  items: string[];
}

export interface Dictionary {
  nav: {
    home: string;
    seven: string;
    services: string;
    paket: string;
    structure: string;
    process: string;
    testimonials: string;
    faq: string;
    cta: string;
  };
  preloader: { tagline: string };
  hero: {
    headline: string;
    sub: string;
    startFrom: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustOfficial: string;
    trustRating: string;
    trustSpeed: string;
    scroll: string;
    waGreeting: string;
    words: string[];
  };
  stats: {
    clients: { label: string; note: string };
    experts: { label: string; note: string };
    layers: { label: string; note: string };
    success: { label: string; note: string };
  };
  marquee: string[];
  seven: {
    kicker: string;
    headingA: string;
    headingB: string;
    sub: string;
    peakBadge: string;
    layers: { title: string; tagline: string; desc: string; items: string[] }[];
  };
  services: {
    kicker: string;
    headingA: string;
    headingB: string;
    sub: string;
    all: string;
    categories: Record<string, string>;
    consult: string;
    featured: string;
  };
  paket: {
    kicker: string;
    headingA: string;
    headingB: string;
    sub: string;
    popular: string;
    durationLabel: string;
    days: string;
    ctaTier: string;
    ctaTierCustom: string;
    note: string;
    tiers: {
      name: string;
      entity: string;
      price: string;
      priceNote: string;
      desc: string;
      features: string[];
    }[];
    addons: {
      kicker: string;
      headingA: string;
      headingB: string;
      sub: string;
      items: { name: string; price: string; icon: string }[];
    };
    calc: {
      kicker: string;
      headingA: string;
      headingB: string;
      sub: string;
      step1: string;
      step1Hint: string;
      step2: string;
      step2Hint: string;
      step3: string;
      step3Hint: string;
      entities: Record<string, string>;
      addons: Record<string, string>;
      timelines: Record<string, string>;
      resultKicker: string;
      resultTitle: string;
      resultEmpty: string;
      restart: string;
      investment: string;
      duration: string;
      recommended: string;
      breakdown: string;
      ctaWa: string;
      note: string;
      waIntro: string;
      waEntity: string;
      waAddons: string;
      waTimeline: string;
      waClose: string;
    };
  };
  why: {
    kicker: string;
    headingA: string;
    headingB: string;
    expertTitle: string;
    expertDesc: string;
    expertMore: string;
    chips: string[];
    reasons: { title: string; desc: string }[];
  };
  process: {
    kicker: string;
    headingA: string;
    headingB: string;
    sub: string;
    steps: { title: string; desc: string; tag: string }[];
  };
  team: { kicker: string; heading: string; sub: string };
  offices: {
    kicker: string;
    heading: string;
    sub: string;
    hq: string;
    branch: string;
    hoursLabel: string;
  };
  testi: { kicker: string; heading: string; sub: string };
  faq: {
    kicker: string;
    heading: string;
    sub: string;
    closing: string;
    closingCta: string;
  };
  cta: {
    kicker: string;
    headingA: string;
    headingB: string;
    sub: string;
    ctaWa: string;
    respTime: string;
    waMessage: string;
  };
  footer: {
    about: string;
    quickTitle: string;
    serviceTitle: string;
    contactTitle: string;
    officeTitle: string;
    rights: string;
    admin: string;
    links: string[];
  };
  floating: { wa: string; top: string };
  switcher: { label: string };
  content: {
    services: Record<string, SvcContent>;
    faqs: Record<string, { q: string; a: string }>;
    testi: Record<string, { text: string }>;
  };
}
