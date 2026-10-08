/**
 * Runtime i18n: menggabungkan semua kamus dengan fallback berlapis.
 * Locale apa pun di-merge DI ATAS kamus Indonesia, sehingga kunci yang
 * hilang/ gagal diterjemahkan otomatis memakai Bahasa Indonesia — UI tak
 * pernah rusak walau satu bahasa belum lengkap.
 */
import idDict from "./dict-id";
import enDict from "./dict-en";
import zhJson from "./locales/zh.json";
import esJson from "./locales/es.json";
import hiJson from "./locales/hi.json";
import arJson from "./locales/ar.json";
import frJson from "./locales/fr.json";
import ptJson from "./locales/pt.json";
import ruJson from "./locales/ru.json";
import jaJson from "./locales/ja.json";
import type { Dictionary, Locale } from "./types";
import { LOCALES } from "./types";

export * from "./types";

function deepMerge(base: unknown, over: unknown): Record<string, unknown> {
  if (Array.isArray(over)) return over as unknown as Record<string, unknown>;
  if (over && typeof over === "object") {
    const out: Record<string, unknown> = { ...((base ?? {}) as Record<string, unknown>) };
    for (const k of Object.keys(over as Record<string, unknown>)) {
      out[k] = deepMerge((base as Record<string, unknown>)?.[k], (over as Record<string, unknown>)[k]);
    }
    return out;
  }
  return (over ?? base) as Record<string, unknown>;
}

const RAW: Record<Locale, unknown> = {
  id: idDict,
  en: enDict,
  zh: zhJson,
  es: esJson,
  hi: hiJson,
  ar: arJson,
  fr: frJson,
  pt: ptJson,
  ru: ruJson,
  ja: jaJson,
};

export const DICTIONARIES = Object.fromEntries(
  LOCALES.map((l) => [l, deepMerge(idDict, RAW[l]) as unknown as Dictionary])
) as Record<Locale, Dictionary>;

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** Konten layanan sesuai bahasa; slug tak dikenal → konten DB (Indonesia). */
export function svc(
  item: { slug?: string | null; title: string; desc: string; price: string; items: string[] },
  dict: Dictionary,
  locale: Locale
) {
  if (locale === "id" || !item.slug) return { title: item.title, desc: item.desc, price: item.price, items: item.items };
  const c = dict.content.services[item.slug];
  return c ? { ...c } : { title: item.title, desc: item.desc, price: item.price, items: item.items };
}

/** Konten FAQ sesuai bahasa. */
export function faqC(item: { slug?: string | null; q: string; a: string }, dict: Dictionary, locale: Locale) {
  if (locale === "id" || !item.slug) return { q: item.q, a: item.a };
  const c = dict.content.faqs[item.slug];
  return c ? { ...c } : { q: item.q, a: item.a };
}

/** Konten testimoni sesuai bahasa. */
export function testiC(item: { slug?: string | null; text: string }, dict: Dictionary, locale: Locale) {
  if (locale === "id" || !item.slug) return { text: item.text };
  const c = dict.content.testi[item.slug];
  return c ? { ...c } : { text: item.text };
}
