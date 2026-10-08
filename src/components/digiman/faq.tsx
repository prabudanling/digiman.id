"use client";

/**
 * FAQ — accordion custom bebas-hydration-error.
 *
 * Mengapa bukan Radix Accordion?
 * Radix memakai React useId() untuk id trigger/panel. Pada sebagian
 * environment (ekstensi browser, auto-translate, bundle dev berbeda dgn
 * SSR), urutan useId bisa menyimpang antara HTML server dan hydration
 * sehingga React melempar error "aria-controls / id didn't match".
 *
 * Solusi: id DETERMINISTIK eksplisit (faq-trigger-N / faq-panel-N) yang
 * identik di server & client — mustahil mismatch — plus animasi tinggi
 * via CSS grid-template-rows (0fr -> 1fr) yang mulus tanpa pengukuran JS.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";
import { faqC } from "@/lib/i18n";

export interface FaqItem {
  slug: string | null;
  q: string;
  a: string;
}

export default function Faq({ faqs: propFaqs }: { faqs?: FaqItem[] }) {
  const { dict, locale } = useI18n();
  const faqs = (propFaqs ?? []).map((f) => ({ ...f, ...faqC(f, dict, locale) }));
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // JSON-LD FAQPage (SEO): pakai konten asli DB (Bahasa Indonesia) — bukan konten terjemahan runtime
  const jsonLd = propFaqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: propFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <section id="faq" className="section-padding relative py-24 sm:py-32">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            {dict.faq.kicker}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {dict.faq.heading.split(" ").slice(0, -2).join(" ")} {" "}
            <span className="gradient-text-emerald">{dict.faq.heading.split(" ").slice(-2).join(" ")}</span>
          </h2>
          <p className="mt-5 leading-relaxed text-emerald-50/60">
            {dict.faq.sub}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="space-y-4">
            {faqs.map((f, i) => {
              const open = openIdx === i;
              const triggerId = `faq-trigger-${i}`;
              const panelId = `faq-panel-${i}`;
              return (
                <div
                  key={i}
                  className={`glass overflow-hidden rounded-2xl border px-6 transition-colors duration-300 ${
                    open ? "border-gold/30" : "border-transparent"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIdx(open ? null : i)}
                      className="group flex w-full items-center justify-between gap-4 rounded-md py-5 text-left font-semibold text-white outline-none transition-colors hover:text-gold-light focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d0a]"
                    >
                      <span className="flex min-w-0 items-baseline">
                        <span className="mr-3 shrink-0 font-display text-sm text-emerald-400/60 transition-colors group-hover:text-gold/80">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">{f.q}</span>
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-emerald-300 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          open ? "rotate-180 text-gold" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="grid transition-[grid-template-rows,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr", visibility: open ? "visible" : "hidden" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="border-t border-emerald-400/10 pb-6 pt-4 leading-relaxed text-emerald-50/65">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
