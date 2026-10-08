"use client";

import { useEffect, useState } from "react";
import { DatabaseBackup, Download, Upload, Loader2, ShieldAlert, CheckCircle2, FileJson } from "lucide-react";
import { PageHeader, AdminCard, btnGold, inputCls } from "@/components/admin/admin-ui";

interface TableInfo {
  name: string;
  count: number;
  note: string;
}

export default function BackupPage() {
  const [stats, setStats] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      const s = json.stats ?? {};
      setStats([
        { name: "Pengaturan Situs", count: 1, note: "kontak, hero, SEO, sosial media" },
        { name: "Struktur Perusahaan", count: s.team ?? 0, note: "direksi & komisaris" },
        { name: "Layanan", count: s.services ?? 0, note: "katalog + kategori" },
        { name: "Testimoni", count: s.testimonials ?? 0, note: "ulasan klien" },
        { name: "FAQ", count: s.faqs ?? 0, note: "pertanyaan populer" },
        { name: "Kantor", count: s.offices ?? 0, note: "HQ + cabang" },
        { name: "Media", count: json.mediaCount ?? 0, note: "gambar terpusat" },
        { name: "Section Tampilan", count: json.sectionCount ?? 0, note: "urutan beranda" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const exportJson = async () => {
    setMsg(null);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) {
        setMsg({ ok: false, text: "Gagal membuat berkas backup." });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digiman-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg({ ok: true, text: "Backup berhasil diunduh. Simpan file dengan aman." });
    } catch {
      setMsg({ ok: false, text: "Gagal mengunduh backup." });
    }
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setFileData(String(reader.result));
    reader.onerror = () => setMsg({ ok: false, text: "Gagal membaca file." });
    reader.readAsText(file);
  };

  const restore = async () => {
    if (!fileData) return;
    setImporting(true);
    setMsg(null);
    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(fileData);
      } catch {
        setMsg({ ok: false, text: "File bukan JSON valid." });
        return;
      }
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "PULIHKAN", data: parsed }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({ ok: true, text: `Berhasil! ${json.restored} baris data dipulihkan. Muat ulang halaman admin untuk melihat data baru.` });
        setFileData(null);
        setFileName("");
        setConfirmText("");
        load();
      } else {
        setMsg({ ok: false, text: json.error || "Gagal memulihkan." });
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<DatabaseBackup className="h-6 w-6 text-gold" />}
        title="Backup & Pulihkan"
        desc="Seluruh konten situs bisa diunduh jadi satu file JSON dan dipulihkan kapan pun — aman untuk serah terima & pemindahan hosting."
      />

      {msg && (
        <p role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-400/30 bg-emerald-950/40 text-emerald-200" : "border-red-400/30 bg-red-950/30 text-red-300"}`}>
          {msg.text}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Export */}
        <AdminCard>
          <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg font-bold text-white">
            <Download className="h-5 w-5 text-gold" /> Unduh Backup
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-emerald-50/55">
            Satu file JSON berisi seluruh konten: pengaturan, struktur, layanan, testimoni, FAQ, kantor, media, dan tata letak. Tidak menyertakan password admin (aman).
          </p>
          <ul className="mb-6 space-y-2">
            {stats.map((t) => (
              <li key={t.name} className="flex items-center justify-between rounded-xl border border-emerald-400/10 bg-[#0a1613] px-4 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-emerald-50/85">{t.name}</p>
                  <p className="text-[10px] text-emerald-50/40">{t.note}</p>
                </div>
                <span className="rounded-full border border-gold/30 bg-gold/8 px-2.5 py-0.5 font-display text-xs font-bold text-gold-light">
                  {loading ? "…" : t.count}
                </span>
              </li>
            ))}
          </ul>
          <button onClick={exportJson} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm ${btnGold}`}>
            <FileJson className="h-4 w-4" /> Unduh Backup JSON
          </button>
        </AdminCard>

        {/* Import */}
        <AdminCard>
          <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg font-bold text-white">
            <Upload className="h-5 w-5 text-gold" /> Pulihkan dari Backup
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-emerald-50/55">
            Konten saat ini akan <strong className="text-gold-light">diganti seluruhnya</strong> dengan isi file backup. Akun admin & log tidak terpengaruh.
          </p>
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-950/20 px-4 py-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <p className="text-xs leading-relaxed text-amber-200/80">
              Pertama-tama unduh backup kondisi sekarang sebagai cadangan. Pemulihan tidak bisa dibatalkan.
            </p>
          </div>

          <label className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-400/25 bg-[#0a1613] px-4 py-8 text-center transition-colors hover:border-gold/50">
            <Upload className="mb-2 h-5 w-5 text-emerald-300/50" />
            <p className="text-sm font-semibold text-emerald-50/70">{fileName || "Pilih file backup .json"}</p>
            <input type="file" accept=".json,application/json" hidden onChange={pickFile} />
          </label>

          {fileData && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-emerald-100/70">
                Ketik <span className="rounded bg-[#0a1613] px-1.5 py-0.5 font-mono text-gold-light">PULIHKAN</span> untuk konfirmasi
              </label>
              <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className={inputCls} placeholder="PULIHKAN" />
              <button
                onClick={restore}
                disabled={importing || confirmText !== "PULIHKAN"}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm ${btnGold} disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {importing ? "Memulihkan…" : "Mulai Pemulihan"}
              </button>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
