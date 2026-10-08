"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareQuote,
  Loader2,
  Save,
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald, EmptyState } from "@/components/admin/admin-ui";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  order: number;
  visible: boolean;
}

const emptyForm = {
  id: null as string | null,
  name: "",
  role: "",
  text: "",
  rating: 5,
  visible: true,
};

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
      const data = await res.json();
      setTestimonials(data.testimonials ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (t: Testimonial) => {
    setForm({ id: t.id, name: t.name, role: t.role, text: t.text, rating: t.rating, visible: t.visible });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.text.trim()) {
      setMsg({ ok: false, text: "Nama, peran, dan isi testimoni wajib diisi." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gagal menyimpan." });
        return;
      }
      setMsg({ ok: true, text: form.id ? "Testimoni diperbarui & tayang." : "Testimoni baru ditambahkan & tayang." });
      setForm(emptyForm);
      await load();
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t: Testimonial) => {
    if (!window.confirm(`Hapus testimoni dari ${t.name}?`)) return;
    setRemovingId(t.id);
    try {
      await fetch(`/api/admin/testimonials/${t.id}`, { method: "DELETE" });
      if (form.id === t.id) setForm(emptyForm);
      await load();
    } finally {
      setRemovingId(null);
    }
  };

  const toggleVisible = async (t: Testimonial) => {
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, name: t.name, role: t.role, text: t.text, rating: t.rating, visible: !t.visible }),
    });
    await load();
  };

  return (
    <div>
      <PageHeader
        icon={<MessageSquareQuote className="h-6 w-6 text-emerald-300" />}
        title="Testimoni"
        desc="Testimoni klien tampil dalam marquee dua baris di section Testimoni. Testimoni tersembunyi tidak muncul di website."
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
          {form.id ? "Edit Testimoni" : "Tambah Testimoni Baru"}
        </h2>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Nama Klien</FieldLabel>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="mis. Rendra Wijaya" className={inputCls} />
            </div>
            <div>
              <FieldLabel hint="Jabatan + perusahaan">Peran</FieldLabel>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Founder, Kopi Nusantara Rasa" className={inputCls} />
            </div>
          </div>
          <div>
            <FieldLabel>Isi Testimoni</FieldLabel>
            <Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} placeholder="Cerita pengalaman klien…" className={inputCls} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <FieldLabel>Rating</FieldLabel>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    aria-label={`Rating ${n} bintang`}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star className={`h-6 w-6 ${n <= form.rating ? "fill-gold text-gold" : "text-emerald-50/20"}`} />
                  </button>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 self-end">
              <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
              <span className="text-sm font-medium text-emerald-100/80">Tampilkan di website</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={saving} className={btnEmerald}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {form.id ? "Simpan Perubahan" : "Tambah Testimoni"}
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
          Daftar Testimoni <span className="text-sm font-medium text-emerald-50/45">({testimonials.length})</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : testimonials.length === 0 ? (
          <EmptyState title="Belum ada testimoni" desc="Tambahkan testimoni pertama melalui formulir di atas." />
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-400/15 bg-[#0a1613]/70 px-4 py-4 sm:flex-nowrap ${
                    !t.visible ? "opacity-55" : ""
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 font-display text-sm font-bold text-emerald-950">
                    {t.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
                      {t.name}
                      {!t.visible && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 px-2.5 py-0.5 text-[10px] font-bold text-emerald-50/50">
                          Tersembunyi
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-emerald-50/50">{t.role}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-emerald-50/40">&ldquo;{t.text}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="mr-1 flex items-center gap-0.5" aria-label={`Rating ${t.rating} dari 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-gold text-gold" : "text-emerald-50/20"}`} />
                      ))}
                    </div>
                    <button
                      onClick={() => toggleVisible(t)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-emerald-300/50 hover:text-white"
                      aria-label={t.visible ? `Sembunyikan testimoni ${t.name}` : `Tampilkan testimoni ${t.name}`}
                    >
                      {t.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(t)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-gold/50 hover:text-gold"
                      aria-label={`Edit testimoni ${t.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(t)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 text-red-300/80 transition-colors hover:border-red-400/50 hover:text-red-300"
                      aria-label={`Hapus testimoni ${t.name}`}
                    >
                      {removingId === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
