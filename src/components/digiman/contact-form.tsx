"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, ShieldCheck, MessageSquareText } from "lucide-react";
import { useI18n } from "@/components/i18n/locale-provider";

const inputCls =
  "w-full rounded-xl border border-emerald-400/25 bg-[#081712]/80 px-4 py-3 text-sm text-emerald-50 placeholder:text-emerald-50/35 outline-none transition-all focus:border-gold/50 focus:ring-2 focus:ring-gold/25";

/**
 * Formulir Konsultasi (leads) — pesan masuk ke Panel Admin > Pesan.
 * Bisa dimatikan dari admin: Pengaturan > Formulir Konsultasi.
 */
export default function ContactForm({ services }: { services: string[] }) {
  const { locale } = useI18n();
  const id = locale === "id" || locale === "en" ? locale : "id";
  const t = STR[id];

  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || t.fail);
        setStatus("error");
        return;
      }
      setStatus("done");
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    } catch {
      setError(t.fail);
      setStatus("error");
    }
  };

  return (
    <section id="kontak-form" className="relative overflow-hidden py-24">
      {/* latar aksen aurora lembut */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-56 w-96 rounded-full bg-gold/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] border border-emerald-400/15 bg-[#071a14]/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-10"
        >
          <div className="mb-8 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-light">
              <MessageSquareText className="h-3.5 w-3.5" /> {t.badge}
            </span>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{t.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/60">{t.sub}</p>
          </div>

          {status === "done" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-6 py-10 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              <p className="font-display text-lg font-bold text-white">{t.okTitle}</p>
              <p className="max-w-sm text-sm text-emerald-50/60">{t.okSub}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-xs font-semibold text-gold-light underline-offset-4 hover:underline"
              >
                {t.again}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
              <div className="sm:col-span-1">
                <label htmlFor="cf-name" className="mb-1.5 block text-xs font-semibold text-emerald-100/70">{t.name} *</label>
                <input id="cf-name" className={inputCls} value={form.name} maxLength={100}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.phName} required />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="cf-phone" className="mb-1.5 block text-xs font-semibold text-emerald-100/70">{t.wa} *</label>
                <input id="cf-phone" className={inputCls} value={form.phone} maxLength={25} inputMode="tel"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812 3456 7890" required />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="cf-email" className="mb-1.5 block text-xs font-semibold text-emerald-100/70">{t.email}</label>
                <input id="cf-email" type="email" className={inputCls} value={form.email} maxLength={120}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@perusahaan.id" />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="cf-service" className="mb-1.5 block text-xs font-semibold text-emerald-100/70">{t.service}</label>
                <select id="cf-service" className={inputCls} value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}>
                  <option value="">{t.serviceAny}</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="cf-message" className="mb-1.5 block text-xs font-semibold text-emerald-100/70">{t.msg} *</label>
                <textarea id="cf-message" rows={4} className={inputCls} value={form.message} maxLength={2000}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.phMsg} required />
              </div>

              {status === "error" && (
                <p role="alert" className="sm:col-span-2 rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="sm:col-span-2 flex flex-col items-center gap-3">
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-8 py-3.5 font-display text-sm font-bold text-emerald-950 shadow-[0_10px_30px_-10px_rgba(242,193,78,0.6)] transition-opacity disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> {t.sending}</>
                  ) : (
                    <><Send className="h-4 w-4" /> {t.send}</>
                  )}
                </motion.button>
                <p className="flex items-center gap-1.5 text-xs text-emerald-50/45">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300/70" /> {t.privacy}
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

const STR = {
  id: {
    badge: "Gratis Konsultasi",
    title: "Ceritakan Kebutuhan Bisnis Anda",
    sub: "Isi formulir ini — tim kami membalas maksimal 1×24 jam kerja. Pesan Anda langsung masuk ke tim internal kami, bukan bot.",
    name: "Nama Lengkap",
    wa: "Nomor WhatsApp",
    email: "Email (opsional)",
    service: "Layanan yang Diminati",
    serviceAny: "— Belum tahu / Konsultasi dulu —",
    msg: "Pesan Anda",
    phName: "mis. Budi Santoso",
    phMsg: "mis. Saya ingin mendirikan PT untuk usaha kuliner, kira-kira berapa biaya dan berapa lama?",
    send: "Kirim Pesan",
    sending: "Mengirim…",
    okTitle: "Pesan Terkirim!",
    okSub: "Terima kasih! Tim DIGIMAN akan menghubungi Anda via WhatsApp maksimal 1×24 jam kerja.",
    again: "Kirim pesan lain",
    fail: "Gagal mengirim pesan. Coba lagi atau hubungi kami via WhatsApp.",
    privacy: "Data Anda aman & hanya digunakan untuk keperluan konsultasi.",
  },
  en: {
    badge: "Free Consultation",
    title: "Tell Us Your Business Needs",
    sub: "Fill in this form — our team replies within 1×24 business hours. Your message goes straight to our internal team, not a bot.",
    name: "Full Name",
    wa: "WhatsApp Number",
    email: "Email (optional)",
    service: "Service of Interest",
    serviceAny: "— Not sure yet / Just consulting —",
    msg: "Your Message",
    phName: "e.g. John Doe",
    phMsg: "e.g. I want to establish a limited company for my F&B business. How much does it cost?",
    send: "Send Message",
    sending: "Sending…",
    okTitle: "Message Sent!",
    okSub: "Thank you! The DIGIMAN team will contact you via WhatsApp within 1×24 business hours.",
    again: "Send another message",
    fail: "Failed to send. Try again or reach us via WhatsApp.",
    privacy: "Your data is safe & only used for consultation purposes.",
  },
};
