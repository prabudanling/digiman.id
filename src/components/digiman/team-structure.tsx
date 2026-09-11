"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Camera,
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  Save,
  Network,
  CheckCircle2,
  UserRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;
  name: string;
  role: string;
  division: string | null;
  photo: string | null;
  order: number;
}

const PRESETS = ["Komisaris Utama", "Komisaris", "Direktur", "Manajer Operasional", "Kepala Divisi"];

async function fileToDataUrl(file: File, max = 640): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Avatar({ member, size = 128, ring = true }: { member: Member; size?: number; ring?: boolean }) {
  return (
    <div
      className={`relative shrink-0 rounded-full ${ring ? "p-[3px]" : ""}`}
      style={{
        width: size,
        height: size,
        background: ring
          ? "conic-gradient(from 180deg, #f2c14e, #34d399, #ffe9a8, #0d9488, #f2c14e)"
          : undefined,
        boxShadow: ring ? "0 0 34px rgba(242,193,78,0.35)" : undefined,
      }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0a1613]">
        {member.photo ? (
           
          <img src={member.photo} alt={`Foto ${member.name}`} className="h-full w-full object-cover" />
        ) : (
          <span
            className="font-display font-bold text-gold-light"
            style={{ fontSize: size * 0.34 }}
          >
            {initials(member.name) || <UserRound className="h-1/3 w-1/3 text-emerald-300/60" />}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TeamStructure() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/team", { cache: "no-store" });
      const data = await res.json();
      setMembers(data.members ?? []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [head, ...rest] = members;

  return (
    <section id="struktur" className="section-padding relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute left-1/2 top-24 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-gold/6 blur-[130px]"
      />
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-yellow-300/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold-light">
            <Network className="h-3.5 w-3.5" />
            Struktur Perusahaan
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Para <span className="gradient-text-gold font-display">Kapten</span> Pendakian
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-emerald-50/60 sm:text-lg">
            Struktur resmi PT Digital Bisnis Manajemen (Perseroan Perorangan) — sesuai Akta
            Pendirian & SK Kemenkumham AHU-059566.AH.01.30.Tahun 2022.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : (
          <div className="relative">
            {/* Kepala organisasi */}
            <AnimatePresence mode="wait">
              {head && (
                <motion.div
                  key={head.id}
                  initial={{ opacity: 0, y: 36, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto w-fit text-center"
                >
                  <div className="card-glow glass group relative mx-auto w-fit rounded-[2rem] px-10 py-8 sm:px-14">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 shadow-lg">
                      Pimpinan Tertinggi
                    </span>
                    <div className="mx-auto w-fit transition-transform duration-500 group-hover:scale-105">
                      <Avatar member={head} size={150} />
                    </div>
                    <h3 className="font-display mt-5 text-2xl font-bold text-white sm:text-3xl">{head.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-yellow-300/10 px-4 py-1.5 text-sm font-bold text-gold-light">
                        <Crown className="h-3.5 w-3.5" />
                        {head.role}
                      </span>
                      {head.division && (
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/5 px-4 py-1.5 text-xs font-medium text-emerald-100/75">
                          {head.division}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Konektor */}
            {rest.length > 0 && (
              <>
                <div className="mx-auto h-12 w-px bg-gradient-to-b from-gold/60 to-emerald-400/30" aria-hidden />
                <div className="relative mx-auto hidden h-px w-[72%] bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent sm:block" aria-hidden />
              </>
            )}

            {/* Anggota lainnya */}
            {rest.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
                    className="card-glow glass group rounded-3xl p-7 text-center"
                  >
                    <div className="mx-auto w-fit transition-transform duration-500 group-hover:scale-105">
                      <Avatar member={m} size={104} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">{m.name}</h3>
                    <span className="mt-1.5 inline-block rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3.5 py-1 text-xs font-semibold text-emerald-200/85">
                      {m.role}
                    </span>
                    {m.division && <p className="mt-1.5 text-xs text-emerald-50/45">{m.division}</p>}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setAdminOpen(true)}
                className="mx-auto mt-10 flex w-full max-w-xl cursor-pointer flex-col items-center gap-3 rounded-3xl border border-dashed border-emerald-400/30 bg-emerald-400/[0.03] px-8 py-9 text-center transition-colors hover:border-gold/50 hover:bg-yellow-300/[0.04]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-600/10 ring-1 ring-emerald-400/40">
                  <Plus className="h-6 w-6 text-emerald-300" />
                </span>
                <span className="font-semibold text-emerald-100/85">
                  Tambah Komisaris Utama, Direktur, Manajer & lainnya
                </span>
                <span className="text-xs text-emerald-50/45">
                  Klik untuk membuka panel kelola struktur — unggah foto & isi jabatan
                </span>
              </motion.button>
            )}

            {/* Tombol kelola */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setAdminOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-950/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/70 backdrop-blur-md transition-all hover:border-gold/50 hover:text-gold-light"
              >
                <Pencil className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
                Kelola Struktur & Foto
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminDialog
        open={adminOpen}
        onOpenChange={setAdminOpen}
        members={members}
        onChanged={load}
      />
    </section>
  );
}

function AdminDialog({
  open,
  onOpenChange,
  members,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  members: Member[];
  onChanged: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setDivision("");
    setPhoto(null);
    setFeedback(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setDivision(m.division ?? "");
    setPhoto(m.photo);
    setFeedback(null);
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("File harus berupa gambar (JPG/PNG).");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
      setFeedback(null);
    } catch {
      setFeedback("Gagal membaca gambar. Coba file lain.");
    }
  };

  const save = async () => {
    if (!name.trim() || !role.trim()) {
      setFeedback("Nama dan jabatan wajib diisi.");
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/team", {
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
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Gagal menyimpan.");
      }
      setFeedback("ok");
      resetForm();
      onChanged();
      setTimeout(() => setFeedback(null), 2200);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m: Member) => {
    if (!window.confirm(`Hapus ${m.name} (${m.role}) dari struktur?`)) return;
    setRemovingId(m.id);
    try {
      await fetch(`/api/team?id=${m.id}`, { method: "DELETE" });
      onChanged();
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[88vh] max-w-xl overflow-y-auto rounded-3xl border-emerald-400/25 p-7 sm:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-xl font-bold text-white">
            Kelola Struktur Organisasi
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-emerald-50/55">
            Tambah anggota, unggah foto, lalu simpan. Perubahan langsung tampil di halaman.
          </DialogDescription>
        </DialogHeader>

        {/* Preset jabatan */}
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setEditingId(null);
                setName("");
                setRole(p);
                setDivision("");
                setPhoto(null);
                setFeedback(null);
              }}
              className="rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-100/80 transition-colors hover:border-gold/50 hover:bg-yellow-300/10 hover:text-gold-light"
            >
              + {p}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="mt-5 flex gap-5 rounded-2xl border border-emerald-400/15 bg-[#071410]/70 p-5">
          <div className="shrink-0">
            <div
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Unggah foto"
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-emerald-400/35 bg-emerald-950/40 transition-colors hover:border-gold/60"
            >
              {photo ? (
                 
                <img src={photo} alt="Pratinjau foto" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-emerald-100/50">
                  <Camera className="h-6 w-6 transition-colors group-hover:text-gold" />
                  <span className="text-[10px] font-medium">Unggah Foto</span>
                </span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickFile}
            />
          </div>

          <div className="flex w-full flex-col gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap (mis. Gugun Gunara)"
              className="border-emerald-400/20 bg-[#0a1613] text-emerald-50 placeholder:text-emerald-50/30"
            />
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Jabatan (mis. Direktur Utama)"
              className="border-emerald-400/20 bg-[#0a1613] text-emerald-50 placeholder:text-emerald-50/30"
            />
            <Input
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              placeholder="Divisi / keterangan (opsional)"
              className="border-emerald-400/20 bg-[#0a1613] text-emerald-50 placeholder:text-emerald-50/30"
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-500 font-bold text-emerald-950 hover:brightness-110"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? "Simpan Perubahan" : "Tambah ke Struktur"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-emerald-400/25 bg-transparent text-emerald-100/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {feedback && (
              <p className={`text-xs font-medium ${feedback === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                {feedback === "ok" ? "Tersimpan & langsung tayang." : feedback}
              </p>
            )}
          </div>
        </div>

        {/* Daftar anggota */}
        <div className="mt-5 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/50">
            Anggota saat ini ({members.length})
          </p>
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-[#0a1613]/70 px-4 py-3"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-950">
                {m.photo ? (
                   
                  <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-display text-xs font-bold text-gold-light">
                    {initials(m.name)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{m.name}</p>
                <p className="truncate text-xs text-emerald-50/50">{m.role}</p>
              </div>
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
                {removingId === m.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
          {feedback === "ok" && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Struktur berhasil diperbarui.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
