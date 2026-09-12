"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  return (
    <section id="faq" className="section-padding relative py-24 sm:py-32">
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
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass overflow-hidden rounded-2xl border-none px-6"
              >
                <AccordionTrigger className="py-5 text-left font-semibold text-white hover:text-gold-light hover:no-underline [&>svg]:text-emerald-300">
                  <span className="mr-3 font-display text-sm text-emerald-400/60">{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 leading-relaxed text-emerald-50/65">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
