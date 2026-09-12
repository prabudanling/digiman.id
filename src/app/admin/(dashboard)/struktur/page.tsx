"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Loader2,
  Save,
  X,
  Plus,
  Pencil,
  Trash2,
  Crown,
  ArrowUp,
  ArrowDown,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/image-upload";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald, EmptyState } from "@/components/admin/admin-ui";

interface Member {
  id: string;
  name: string;
  role: string;
  division: string | null;
  photo: string | null;
  order: number;
}

const PRESETS = ["Direktur Utama", "Komisaris Utama", "Komisaris", "Direktur", "Manajer Operasional", "Kepala Divisi"];

function initials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export default function StrukturPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/team", { cache: "no-store" });
      const data = await res.json();
      setMembers(data.members ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setDivision("");
    setPhoto(null);
  };

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setDivision(m.division ?? "");
    setPhoto(m.photo);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!name.trim() || !role.trim()) {
      setMsg({ ok: false, text: "Nama dan jabatan wajib diisi." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          role,
          division,
          photo: editingId && photo === null ? undefined : photo,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gagal menyimpan." });
        return;
      }
      setMsg({ ok: true, text: editingId ? "Perubahan tersimpan & tayang." : "Anggota baru ditambahkan & tayang." });
      resetForm();
      await load();
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m: Member) => {
    if (!window.confirm(`Hapus ${m.name} (${m.role}) dari struktur?`)) return;
    setRemovingId(m.id);
    try {
      await fetch(`/api/admin/team/${m.id}`, { method: "DELETE" });
      if (editingId === m.id) resetForm();
      await load();
    } finally {
      setRemovingId(null);
    }
  };

  const move = async (m: Member, direction: "up" | "down") => {
    setMovingId(m.id);
    try {
      await fetch(`/api/admin/team/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      await load();
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<Network className="h-6 w-6 text-emerald-300" />}
        title="Struktur Perusahaan"
        desc="Kelola direksi & komisaris yang tampil di section Struktur. Urutan pertama otomatis menjadi kartu Pimpinan Tertinggi."
      />

      {msg && (
        <div
          className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
            msg.ok
              ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200"
              : "border-red-400/25 bg-red-950/30 text-red-300"
          }`}
          role="status"
        >
          {msg.text}
        </div>
      )}

      {/* Form tambah/edit */}
      <AdminCard className="mb-8">
        <h2 className="font-display mb-5 flex items-center gap-2 text-lg font-bold text-white">
          {editingId ? <Pencil className="h-4.5 w-4.5 text-gold" /> : <Plus className="h-4.5 w-4.5 text-gold" />}
          {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
        </h2>

        {/* Preset jabatan */}
        <div className="mb-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                if (!editingId) setName("");
                setRole(p);
              }}
              className="rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-100/80 transition-colors hover:border-gold/50 hover:bg-yellow-300/10 hover:text-gold-light"
            >
              + {p}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-emerald-400/15 bg-[#06150f]/80 p-5 sm:flex-row">
          <ImageUpload value={photo} onChange={setPhoto} size={120} label="Unggah Foto" />
          <div className="flex w-full flex-col gap-3">
            <div>
              <FieldLabel>Nama Lengkap</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Gugun Gunara" className={inputCls} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel>Jabatan</FieldLabel>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="mis. Direktur Utama" className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Opsional">Divisi / Keterangan</FieldLabel>
                <Input value={division} onChange={(e) => setDivision(e.target.value)} placeholder="mis. Pemegang Saham Tunggal" className={inputCls} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={save} disabled={saving} className={btnEmerald}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? "Simpan Perubahan" : "Tambah ke Struktur"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm} className="border-emerald-400/25 bg-transparent text-emerald-100/70 hover:text-white">
                  <X className="h-4 w-4" /> Batal
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Daftar anggota */}
      <AdminCard>
        <h2 className="font-display mb-1 text-lg font-bold text-white">
          Daftar Anggota <span className="text-sm font-medium text-emerald-50/45">({members.length})</span>
        </h2>
        <p className="mb-5 text-xs text-emerald-50/45">
          Gunakan tombol panah untuk mengatur urutan — posisi pertama tampil sebagai Pimpinan Tertinggi.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            title="Belum ada anggota struktur"
            desc="Tambahkan Direktur Utama, Komisaris, dan anggota lainnya melalui formulir di atas."
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {members.map((m, i) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3.5 sm:flex-nowrap ${
                    i === 0
                      ? "border-gold/35 bg-gradient-to-r from-yellow-300/[0.07] to-transparent"
                      : "border-emerald-400/15 bg-[#0a1613]/70"
                  }`}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-emerald-950 ring-1 ring-emerald-400/20">
                    {m.photo ? (
                       
                      <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-display text-xs font-bold text-gold-light">
                        {initials(m.name) || <UserRound className="h-4 w-4 text-emerald-300/50" />}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-bold text-white">
                      {m.name}
                      {i === 0 && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gold/40 bg-yellow-300/10 px-2.5 py-0.5 text-[10px] font-bold text-gold-light">
                          <Crown className="h-3 w-3" /> Teratas
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-emerald-50/50">
                      {m.role}
                      {m.division ? ` · ${m.division}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => move(m, "up")}
                      disabled={i === 0 || movingId === m.id}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-emerald-300/50 hover:text-white disabled:opacity-30"
                      aria-label={`Naikkan urutan ${m.name}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(m, "down")}
                      disabled={i === members.length - 1 || movingId === m.id}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-emerald-300/50 hover:text-white disabled:opacity-30"
                      aria-label={`Turunkan urutan ${m.name}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => startEdit(m)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-gold/50 hover:text-gold"
                      aria-label={`Edit ${m.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(m)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 text-red-300/80 transition-colors hover:border-red-400/50 hover:text-red-300"
                      aria-label={`Hapus ${m.name}`}
                    >
                      {removingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
