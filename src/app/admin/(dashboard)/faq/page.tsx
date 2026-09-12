"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleHelp,
  Loader2,
  Save,
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald, EmptyState } from "@/components/admin/admin-ui";

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
}

const emptyForm = {
  id: null as string | null,
  question: "",
  answer: "",
  visible: true,
};

export default function FaqAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/faqs", { cache: "no-store" });
      const data = await res.json();
      setFaqs(data.faqs ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (f: Faq) => {
    setForm({ id: f.id, question: f.question, answer: f.answer, visible: f.visible });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setMsg({ ok: false, text: "Pertanyaan dan jawaban wajib diisi." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gagal menyimpan." });
        return;
      }
      setMsg({ ok: true, text: form.id ? "FAQ diperbarui & tayang." : "FAQ baru ditambahkan & tayang." });
      setForm(emptyForm);
      await load();
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (f: Faq) => {
    if (!window.confirm("Hapus FAQ ini?")) return;
    setRemovingId(f.id);
    try {
      await fetch(`/api/admin/faqs/${f.id}`, { method: "DELETE" });
      if (form.id === f.id) setForm(emptyForm);
      await load();
    } finally {
      setRemovingId(null);
    }
  };

  const toggleVisible = async (f: Faq) => {
    await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: f.id, question: f.question, answer: f.answer, visible: !f.visible }),
    });
    await load();
  };

  return (
    <div>
      <PageHeader
        icon={<CircleHelp className="h-6 w-6 text-emerald-300" />}
        title="FAQ"
        desc="Pertanyaan yang sering diajukan — tampil dalam accordion di section FAQ website."
      />

      {msg && (
        <div
          className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
            msg.ok ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200" : "border-red-400/25 bg-red-950/30 text-red-300"
          }`}
          role="status"
        >
          {msg.text}
        </div>
      )}

      {/* Form */}
      <AdminCard className="mb-8">
        <h2 className="font-display mb-5 flex items-center gap-2 text-lg font-bold text-white">
          {form.id ? <Pencil className="h-4.5 w-4.5 text-gold" /> : <Plus className="h-4.5 w-4.5 text-gold" />}
          {form.id ? "Edit FAQ" : "Tambah FAQ Baru"}
        </h2>

        <div className="space-y-4">
          <div>
            <FieldLabel>Pertanyaan</FieldLabel>
            <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="mis. Berapa biaya pendirian PT?" className={inputCls} />
          </div>
          <div>
            <FieldLabel>Jawaban</FieldLabel>
            <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} placeholder="Tulis jawaban lengkap di sini…" className={inputCls} />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
            <span className="text-sm font-medium text-emerald-100/80">Tampilkan di website</span>
          </label>
          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={saving} className={btnEmerald}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {form.id ? "Simpan Perubahan" : "Tambah FAQ"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={() => setForm(emptyForm)} className="border-emerald-400/25 bg-transparent text-emerald-100/70 hover:text-white">
                <X className="h-4 w-4" /> Batal
              </Button>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Daftar */}
      <AdminCard>
        <h2 className="font-display mb-5 text-lg font-bold text-white">
          Daftar FAQ <span className="text-sm font-medium text-emerald-50/45">({faqs.length})</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : faqs.length === 0 ? (
          <EmptyState title="Belum ada FAQ" desc="Tambahkan pertanyaan pertama melalui formulir di atas." />
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {faqs.map((f, i) => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-4 rounded-2xl border border-emerald-400/15 bg-[#0a1613]/70 px-4 py-4 ${
                    !f.visible ? "opacity-55" : ""
                  }`}
                >
                  <span className="font-display mt-0.5 shrink-0 text-sm text-emerald-400/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
                      {f.question}
                      {!f.visible && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 px-2.5 py-0.5 text-[10px] font-bold text-emerald-50/50">
                          Tersembunyi
                        </span>
                      )}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-emerald-50/45">{f.answer}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => toggleVisible(f)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-emerald-300/50 hover:text-white"
                      aria-label={f.visible ? "Sembunyikan FAQ ini" : "Tampilkan FAQ ini"}
                    >
                      {f.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(f)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-gold/50 hover:text-gold"
                      aria-label="Edit FAQ ini"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(f)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 text-red-300/80 transition-colors hover:border-red-400/50 hover:text-red-300"
                      aria-label="Hapus FAQ ini"
                    >
                      {removingId === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
