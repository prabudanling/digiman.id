"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Loader2,
  Save,
  X,
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Building2,
  Users,
  Globe2,
  Stamp,
  Lightbulb,
  Rocket,
  FileCheck2,
  ScrollText,
  BadgeCheck,
  Landmark,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Cpu,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald, EmptyState } from "@/components/admin/admin-ui";

interface Service {
  id: string;
  slug: string | null;
  title: string;
  desc: string;
  price: string;
  features: string; // JSON
  icon: string;
  category: string;
  featured: boolean;
  order: number;
  visible: boolean;
}

const ICONS: Record<string, typeof Building2> = {
  Building2, Users, Globe2, Stamp, Lightbulb, Rocket,
  FileCheck2, ScrollText, BadgeCheck, Landmark, Briefcase,
  ShieldCheck, Scale, HeartHandshake, Cpu, BarChart3,
  FileBadge, Store, Handshake, Network, MapPin, FileSignature,
  Copyright, Award, Medal, Receipt, Calculator, HeartPulse,
  Plane, FileText, Archive, MonitorSmartphone, Sparkles,
};

const CATEGORIES: { value: string; label: string }[] = [
  { value: "pendirian", label: "Pendirian Badan Usaha" },
  { value: "perizinan", label: "Perizinan & Legalitas" },
  { value: "ki", label: "Kekayaan Intelektual" },
  { value: "sertifikasi", label: "Sertifikasi & Standar" },
  { value: "pajak", label: "Perpajakan" },
  { value: "ketenagakerjaan", label: "Ketenagakerjaan" },
  { value: "korporasi", label: "Korporasi & Legal" },
  { value: "digital", label: "Digitalisasi" },
];

const emptyForm = {
  id: null as string | null,
  title: "",
  desc: "",
  price: "",
  featuresText: "",
  icon: "Building2",
  category: "pendirian",
  featured: false,
  visible: true,
};

export default function LayananPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      const data = await res.json();
      setServices(data.services ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (s: Service) => {
    let feats: string[] = [];
    try {
      feats = JSON.parse(s.features);
    } catch {
      feats = [];
    }
    setForm({
      id: s.id,
      title: s.title,
      desc: s.desc,
      price: s.price,
      featuresText: feats.join("\n"),
      icon: s.icon,
      category: s.category || "pendirian",
      featured: s.featured,
      visible: s.visible,
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    const features = form.featuresText.split("\n").map((f) => f.trim()).filter(Boolean);
    if (!form.title.trim() || !form.desc.trim() || features.length === 0) {
      setMsg({ ok: false, text: "Judul, deskripsi, dan minimal 1 fitur (satu baris = satu fitur) wajib diisi." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          title: form.title,
          desc: form.desc,
          price: form.price || "Konsultasi custom",
          features,
          icon: form.icon,
          category: form.category,
          featured: form.featured,
          visible: form.visible,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gagal menyimpan." });
        return;
      }
      setMsg({ ok: true, text: form.id ? "Layanan diperbarui & tayang." : "Layanan baru ditambahkan & tayang." });
      setForm(emptyForm);
      await load();
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: Service) => {
    if (!window.confirm(`Hapus layanan "${s.title}"?`)) return;
    setRemovingId(s.id);
    try {
      await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
      if (form.id === s.id) setForm(emptyForm);
      await load();
    } finally {
      setRemovingId(null);
    }
  };

  const toggleVisible = async (s: Service) => {
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: s.id, title: s.title, desc: s.desc, price: s.price,
        features: JSON.parse(s.features || "[]"),
        icon: s.icon, category: s.category, featured: s.featured, visible: !s.visible,
      }),
    });
    await load();
  };

  return (
    <div>
      <PageHeader
        icon={<Briefcase className="h-6 w-6 text-emerald-300" />}
        title="Layanan"
        desc="Kartu-kartu layanan di section “Semua Legalitas, Satu Atap”. Satu baris di kolom fitur = satu poin centang."
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
          {form.id ? "Edit Layanan" : "Tambah Layanan Baru"}
        </h2>

        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Judul Layanan</FieldLabel>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="mis. Pendirian Yayasan" className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Kosongkan untuk “Konsultasi custom”">Harga</FieldLabel>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Mulai Rp 2 jt" className={inputCls} />
              </div>
            </div>
            <div>
              <FieldLabel hint="Menentukan tab/filter kategori di halaman publik">Kategori</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: c.value })}
                    aria-pressed={form.category === c.value}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      form.category === c.value
                        ? "border-gold/50 bg-yellow-300/10 text-gold-light"
                        : "border-emerald-400/20 bg-emerald-950/40 text-emerald-50/60 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Deskripsi Singkat</FieldLabel>
              <Textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={2} placeholder="Satu-dua kalimat yang menjelaskan layanan…" className={inputCls} />
            </div>
            <div>
              <FieldLabel hint="Satu baris = satu poin centang di kartu">Daftar Fitur</FieldLabel>
              <Textarea
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                rows={4}
                placeholder={"Akta notaris\nSK Kemenkumham\nNPWP & NIB"}
                className={inputCls}
              />
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <label className="flex cursor-pointer items-center gap-3">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <span className="text-sm font-medium text-emerald-100/80">
                  <Star className="mr-1.5 inline h-3.5 w-3.5 text-gold" />
                  Tandai Terpopuler
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
                <span className="text-sm font-medium text-emerald-100/80">Tampilkan di website</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={save} disabled={saving} className={btnEmerald}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {form.id ? "Simpan Perubahan" : "Tambah Layanan"}
              </Button>
              {form.id && (
                <Button variant="outline" onClick={() => setForm(emptyForm)} className="border-emerald-400/25 bg-transparent text-emerald-100/70 hover:text-white">
                  <X className="h-4 w-4" /> Batal
                </Button>
              )}
            </div>
          </div>

          {/* Pilih ikon */}
          <div>
            <FieldLabel hint="Ikon di kartu layanan">Pilih Ikon</FieldLabel>
            <div className="grid grid-cols-4 gap-2 rounded-2xl border border-emerald-400/15 bg-[#06150f]/80 p-3">
              {Object.entries(ICONS).map(([nama, Ikon]) => (
                <button
                  key={nama}
                  type="button"
                  onClick={() => setForm({ ...form, icon: nama })}
                  aria-label={nama}
                  aria-pressed={form.icon === nama}
                  className={`flex h-11 items-center justify-center rounded-xl border transition-all ${
                    form.icon === nama
                      ? "border-gold/60 bg-yellow-300/12 text-gold-light shadow-[0_0_18px_rgba(242,193,78,0.25)]"
                      : "border-emerald-400/15 text-emerald-100/55 hover:border-emerald-300/40 hover:text-white"
                  }`}
                >
                  <Ikon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Daftar */}
      <AdminCard>
        <h2 className="font-display mb-5 text-lg font-bold text-white">
          Daftar Layanan <span className="text-sm font-medium text-emerald-50/45">({services.length})</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : services.length === 0 ? (
          <EmptyState title="Belum ada layanan" desc="Tambahkan layanan pertama melalui formulir di atas." />
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {services.map((s) => {
                const Ikon = ICONS[s.icon] ?? Building2;
                let feats: string[] = [];
                try {
                  feats = JSON.parse(s.features);
                } catch {
                  feats = [];
                }
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-4 sm:flex-nowrap ${
                      s.featured
                        ? "border-gold/35 bg-gradient-to-r from-yellow-300/[0.07] to-transparent"
                        : "border-emerald-400/15 bg-[#0a1613]/70"
                    } ${!s.visible ? "opacity-55" : ""}`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-950/70 ring-1 ring-emerald-400/25">
                      <Ikon className="h-5 w-5 text-emerald-300" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
                        {s.title}
                        {s.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-950">
                            Terpopuler
                          </span>
                        )}
                        {!s.visible && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 px-2.5 py-0.5 text-[10px] font-bold text-emerald-50/50">
                            Tersembunyi
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-emerald-50/50">
                        {s.price} · {feats.length} fitur · {s.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleVisible(s)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-emerald-300/50 hover:text-white"
                        aria-label={s.visible ? `Sembunyikan ${s.title}` : `Tampilkan ${s.title}`}
                      >
                        {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(s)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-gold/50 hover:text-gold"
                        aria-label={`Edit ${s.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(s)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 text-red-300/80 transition-colors hover:border-red-400/50 hover:text-red-300"
                        aria-label={`Hapus ${s.title}`}
                      >
                        {removingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
