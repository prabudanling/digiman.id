"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DICTIONARIES, isLocale, LOCALE_META, type Dictionary, type Locale } from "@/lib/i18n";

interface I18nCtx {
  locale: Locale;
  dict: Dictionary;
  setLocale: (l: Locale) => void;
}

const Ctx = createContext<I18nCtx>({
  locale: "id",
  dict: DICTIONARIES.id,
  setLocale: () => {},
});

const STORAGE_KEY = "digiman-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  // Muat preferensi tersimpan / bahasa browser setelah mount (aman hydration:
  // render pertama selalu "id", lalu disinkronkan via callback asinkron)
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      let next: Locale = "id";
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && isLocale(saved)) {
          next = saved;
        } else {
          const nav = navigator.language?.slice(0, 2).toLowerCase() ?? "id";
          if (isLocale(nav)) next = nav;
        }
      } catch {
        /* abaikan */
      }
      if (next !== "id") setLocaleState(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sinkronkan <html lang> & arah teks (RTL untuk Arab)
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_META[locale].dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* abaikan */
    }
  }, []);

  const value = useMemo<I18nCtx>(() => ({ locale, dict: DICTIONARIES[locale], setLocale }), [locale, setLocale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
