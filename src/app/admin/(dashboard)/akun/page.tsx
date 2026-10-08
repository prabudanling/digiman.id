"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, Loader2, Save, ShieldCheck, KeyRound, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader, AdminCard, FieldLabel, inputCls, btnEmerald } from "@/components/admin/admin-ui";

export default function AkunPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async () => {
    if (!currentPassword) {
      setMsg({ ok: false, text: "Masukkan password saat ini untuk konfirmasi." });
      return;
    }
    if (newPassword && newPassword !== confirmPw) {
      setMsg({ ok: false, text: "Konfirmasi password baru tidak cocok." });
      return;
    }
    if (!newUsername && !newName && !newPassword) {
      setMsg({ ok: false, text: "Tidak ada perubahan yang akan disimpan." });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newUsername, newName, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Gagal memperbarui akun." });
        return;
      }

      if (newPassword || newUsername) {
        // Sesi lama tidak lagi relevan — paksa login ulang
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      setMsg({ ok: true, text: "Nama akun berhasil diperbarui." });
      setCurrentPassword("");
    } catch {
      setMsg({ ok: false, text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<UserRound className="h-6 w-6 text-emerald-300" />}
        title="Akun Admin"
        desc="Kelola kredensial login panel admin. Disarankan mengganti password bawaan setelah login pertama."
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <AdminCard>
          <h2 className="font-display mb-5 flex items-center gap-2 text-lg font-bold text-white">
            <KeyRound className="h-4.5 w-4.5 text-gold" /> Perbarui Kredensial
          </h2>

          <div className="space-y-4">
            <div>
              <FieldLabel hint="Wajib diisi untuk setiap perubahan">Password Saat Ini</FieldLabel>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputCls}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel hint="Kosongkan jika tidak diubah">Username Baru</FieldLabel>
                <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="admin" autoComplete="off" className={inputCls} />
              </div>
              <div>
                <FieldLabel hint="Nama tampilan di panel">Nama Baru</FieldLabel>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Administrator Digiman" autoComplete="off" className={inputCls} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel hint="Min. 6 karakter, kosongkan jika tidak diubah">Password Baru</FieldLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel>Ulangi Password Baru</FieldLabel>
                <Input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>
            </div>

            <Button onClick={save} disabled={saving} className={btnEmerald}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan Akun
            </Button>
          </div>
        </AdminCard>

        <AdminCard className="h-fit">
          <h2 className="font-display mb-3 flex items-center gap-2 text-base font-bold text-white">
            <ShieldCheck className="h-4 w-4 text-gold" /> Tips Keamanan
          </h2>
          <ul className="space-y-3 text-xs leading-relaxed text-emerald-50/55">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Ganti password bawaan <span className="font-mono text-emerald-200">digiman2025</span> segera setelah login pertama.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Gunakan kombinasi huruf besar-kecil, angka, dan simbol minimal 10 karakter.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Mengganti username atau password akan mengakhiri sesi — Anda diminta login ulang.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Jangan bagikan kredensial ke siapa pun, termasuk pihak yang mengaku sebagai tim Digiman.
            </li>
          </ul>
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-gold/25 bg-yellow-300/[0.06] px-3.5 py-3 text-[11px] leading-relaxed text-gold-light/90">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Jika lupa password, admin teknis dapat meresetnya langsung dari database.
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
