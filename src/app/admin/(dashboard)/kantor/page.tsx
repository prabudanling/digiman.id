"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Loader2,
  Save,
  X,
  Plus,
  Pencil,
  Trash2,
  Building,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald, EmptyState } from "@/components/admin/admin-ui";

interface Office {
  id: string;
  type: string;
  label: string;
  address: string;
  order: number;
}

export default function KantorPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<"HEAD" | "BRANCH">("BRANCH");
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/offices", { cache: "no-store" });
      const data = await res.json();
      setOffices(data.offices ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setType("BRANCH");
    setLabel("");
    setAddress("");
  };

  const startEdit = (o: Office) => {
    setEditingId(o.id);
    setType(o.type === "HEAD" ? "HEAD" : "BRANCH");
    setLabel(o.label);
    setAddress(o.address);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!label.trim() || !address.trim()) {
      setMsg({ ok: false, text: "Label dan alamat wajib diisi." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, type, label, address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan.");
      setMsg({
        ok: true,
        text: editingId ? "Kantor diperbarui — langsung tayang di website." : "Kantor ditambahkan — langsung tayang di website.",
      });
      resetForm();
      await load();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/admin/offices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus.");
      await load();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Gagal menghapus." });
    } finally {
      setRemovingId(null);
    }
  };

  const move = async (o: Office, dir: -1 | 1) => {
    setMovingId(o.id);
    try {
      await fetch("/api/admin/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: o.id, type: o.type, label: o.label, address: o.address, order: o.order + dir }),
      });
      await load();
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<MapPin className="h-6 w-6 text-emerald-300" />}
        title="Kantor & Cabang"
        desc="Kelola head office dan branch office — daftar ini tayang di section Kantor dan footer website."
      />

      {msg && (
        <div
          className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
            msg.ok
              ? "border-emerald-400/25 bg-emerald-950/40 text-emerald-200"
              : "border-red-400/25 bg-red-950/30 text-red-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AdminCard>
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300/15 to-emerald-400/10 ring-1 ring-gold/30">
              {editingId ? <Pencil className="h-4 w-4 text-gold-light" /> : <Plus className="h-4 w-4 text-gold-light" />}
            </span>
            <h2 className="font-display text-lg font-bold text-white">
              {editingId ? "Edit Kantor" : "Tambah Kantor Baru"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="ml-auto flex items-center gap-1 rounded-lg border border-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100/70 hover:text-white"
              >
                <X className="h-3 w-3" /> Batal
              </button>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <FieldLabel hint="Head Office = kantor pusat (disorot emas)">Jenis Kantor</FieldLabel>
              <div className="flex gap-2">
                {(["HEAD", "BRANCH"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      type === t
                        ? "border-gold/50 bg-yellow-300/10 text-gold-light"
                        : "border-emerald-400/20 bg-emerald-950/40 text-emerald-50/60 hover:text-white"
                    }`}
                  >
                    {t === "HEAD" ? <Building className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    {t === "HEAD" ? "Head Office" : "Branch Office"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel hint="mis. Head Office — Tasikmalaya">Label / Nama Kantor</FieldLabel>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Branch Office I — Bandung" className={inputCls} />
            </div>
          </div>

          <div className="mt-5">
            <FieldLabel hint="Alamat lengkap dengan kota, provinsi & kode pos">Alamat Lengkap</FieldLabel>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Jln. Muararajeun Lama No.26, Bandung, Jawa Barat 40122"
              className="w-full rounded-xl border border-emerald-400/20 bg-[#0a1613] px-4 py-3 text-sm text-emerald-50 placeholder:text-emerald-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={save}
              disabled={saving}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60 ${btnEmerald}`}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Simpan Perubahan" : "Tambah Kantor"}
            </button>
          </div>
        </AdminCard>
      </motion.div>

      {/* Daftar kantor */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-white">
          Daftar Kantor <span className="text-sm font-medium text-emerald-50/45">({offices.length})</span>
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-emerald-50/50">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : offices.length === 0 ? (
          <EmptyState title="Belum ada kantor" desc="Tambahkan head office pertama Anda melalui form di atas." />
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {offices.map((o, i) => (
                <motion.li
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminCard className="flex flex-wrap items-center gap-4 !p-5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        o.type === "HEAD"
                          ? "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_20px_rgba(242,193,78,0.35)]"
                          : "bg-emerald-950/70 ring-1 ring-emerald-400/25"
                      }`}
                    >
                      {o.type === "HEAD" ? (
                        <Building className="h-5 w-5 text-emerald-950" />
                      ) : (
                        <MapPin className="h-5 w-5 text-emerald-300" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-bold text-white">
                        {o.label}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${
                            o.type === "HEAD"
                              ? "bg-yellow-300/10 text-gold-light ring-gold/30"
                              : "bg-emerald-400/8 text-emerald-200/80 ring-emerald-400/25"
                          }`}
                        >
                          {o.type === "HEAD" ? "HQ" : "Cabang"}
                        </span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-emerald-50/50">{o.address}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => move(o, -1)}
                        disabled={i === 0 || movingId === o.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 text-emerald-100/60 hover:text-white disabled:opacity-30"
                        aria-label="Naikkan urutan"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => move(o, 1)}
                        disabled={i === offices.length - 1 || movingId === o.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 text-emerald-100/60 hover:text-white disabled:opacity-30"
                        aria-label="Turunkan urutan"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => startEdit(o)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 text-gold-light hover:bg-yellow-300/10"
                        aria-label={`Edit ${o.label}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(o.id)}
                        disabled={removingId === o.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/25 text-red-300/80 hover:bg-red-950/40 disabled:opacity-40"
                        aria-label={`Hapus ${o.label}`}
                      >
                        {removingId === o.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </AdminCard>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
