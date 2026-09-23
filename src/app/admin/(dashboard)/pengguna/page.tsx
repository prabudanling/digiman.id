"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Loader2, Plus, ShieldCheck, Pencil, Trash2, X, Crown, PenLine, Eye } from "lucide-react";
import { PageHeader, AdminCard, btnGold, inputCls, FieldLabel } from "@/components/admin/admin-ui";

interface U {
  id: string;
  username: string;
  name: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string; desc: string }> = {
  SUPERADMIN: { label: "Super Admin", icon: Crown, cls: "border-gold/40 bg-gold/10 text-gold-light", desc: "Akses penuh: konten, tampilan, SEO, pengguna, backup" },
  EDITOR: { label: "Editor", icon: PenLine, cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200", desc: "Kelola konten, media & pesan. Tidak bisa ubah pengaturan sistem" },
  VIEWER: { label: "Pengamat", icon: Eye, cls: "border-sky-400/40 bg-sky-400/10 text-sky-200", desc: "Hanya melihat — semua tombol tulis tersembunyi" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{ mode: "add" } | { mode: "edit"; user: U } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        setUsers(json.users ?? []);
      } else {
        setMsg({ ok: false, text: "Hanya Super Admin dapat mengelola pengguna." });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (u: U) => {
    if (!confirm(`Hapus akun "${u.username}"?`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    setMsg(res.ok ? { ok: true, text: `Akun "${u.username}" dihapus.` } : { ok: false, text: json.error || "Gagal menghapus." });
    load();
  };

  return (
    <div>
      <PageHeader
        icon={<Users className="h-6 w-6 text-gold" />}
        title="Pengguna & Peran"
        desc="Kelola siapa yang boleh masuk panel admin dan apa yang boleh mereka lakukan — 3 tingkat peran, proteksi otomatis di server."
        action={
          <button onClick={() => setDialog({ mode: "add" })} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ${btnGold}`}>
            <Plus className="h-4 w-4" /> Tambah Pengguna
          </button>
        }
      />

      {msg && (
        <p role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200" : "border-red-400/30 bg-red-950/30 text-red-300"}`}>
          {msg.text}
        </p>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {Object.entries(ROLE_META).map(([key, m]) => (
          <div key={key} className="rounded-2xl border border-emerald-400/12 bg-[#071a14]/70 p-4">
            <p className={`mb-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${m.cls}`}>
              <m.icon className="h-3 w-3" /> {m.label}
            </p>
            <p className="text-xs leading-relaxed text-emerald-50/50">{m.desc}</p>
          </div>
        ))}
      </div>

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-400/12 text-xs uppercase tracking-wider text-emerald-50/40">
                  <th className="pb-3 pr-4 font-semibold">Pengguna</th>
                  <th className="pb-3 pr-4 font-semibold">Peran</th>
                  <th className="pb-3 pr-4 font-semibold">Login Terakhir</th>
                  <th className="pb-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const m = ROLE_META[u.role] ?? ROLE_META.VIEWER;
                  return (
                    <tr key={u.id} className="border-b border-emerald-400/6 last:border-0">
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-xs text-emerald-50/45">@{u.username}</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${m.cls}`}>
                          <m.icon className="h-3 w-3" /> {m.label}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-emerald-50/55">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Belum pernah"}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setDialog({ mode: "edit", user: u })} aria-label={`Edit ${u.username}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 text-emerald-100/70 transition-colors hover:border-gold/40 hover:text-gold-light">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => remove(u)} aria-label={`Hapus ${u.username}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/25 bg-red-950/20 text-red-300/80 transition-colors hover:border-red-400/60">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {dialog && <UserDialog dialog={dialog} onClose={() => setDialog(null)} onDone={(ok, text) => { setMsg({ ok, text }); setDialog(null); load(); }} />}
    </div>
  );
}

function UserDialog({
  dialog,
  onClose,
  onDone,
}: {
  dialog: { mode: "add" } | { mode: "edit"; user: U };
  onClose: () => void;
  onDone: (ok: boolean, text: string) => void;
}) {
  const isEdit = dialog.mode === "edit";
  const u = isEdit ? dialog.user : null;
  const [form, setForm] = useState({ username: u?.username ?? "", name: u?.name ?? "", role: u?.role ?? "EDITOR", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(isEdit ? `/api/admin/users/${u!.id}` : "/api/admin/users", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? { name: form.name, role: form.role, ...(form.password ? { password: form.password } : {}) }
            : form
        ),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        onDone(true, isEdit ? `Akun "${form.username}" diperbarui.` : `Akun "${form.username}" dibuat.`);
      } else {
        setErr(json.error || "Gagal menyimpan.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit pengguna" : "Tambah pengguna"}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border border-emerald-400/25 bg-[#071a14] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <ShieldCheck className="h-5 w-5 text-gold" /> {isEdit ? `Edit @${u!.username}` : "Tambah Pengguna"}
          </h2>
          <button onClick={onClose} aria-label="Tutup" className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 text-emerald-100/60 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {!isEdit && (
            <div>
              <FieldLabel hint="huruf kecil, angka, titik, garis">Username</FieldLabel>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "") })} className={inputCls} placeholder="mis. sari.editor" required />
            </div>
          )}
          <div>
            <FieldLabel>Nama Tampilan</FieldLabel>
            <input value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="mis. Sari Dewi" required />
          </div>
          <div>
            <FieldLabel>Peran</FieldLabel>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
              <option value="SUPERADMIN">Super Admin — akses penuh</option>
              <option value="EDITOR">Editor — konten & pesan</option>
              <option value="VIEWER">Pengamat — hanya lihat</option>
            </select>
          </div>
          <div>
            <FieldLabel hint={isEdit ? "kosongkan bila tidak diganti" : "minimal 8 karakter"}>
              {isEdit ? "Password Baru" : "Password"}
            </FieldLabel>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} minLength={isEdit ? 0 : 8} required={!isEdit} />
          </div>
          {err && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-2.5 text-sm text-red-300">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-full border border-emerald-400/20 px-5 py-2.5 text-sm font-semibold text-emerald-100/70 hover:text-white">
              Batal
            </button>
            <button type="submit" disabled={busy} className={`rounded-full px-6 py-2.5 text-sm ${btnGold} disabled:opacity-60`}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Simpan" : "Buat Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
