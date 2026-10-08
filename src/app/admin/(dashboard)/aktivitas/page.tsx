"use client";

import { useCallback, useEffect, useState } from "react";
import { History, Loader2, LogIn, LogOut, Plus, Pencil, Trash2, Settings, Download, Upload, Search } from "lucide-react";
import { PageHeader, AdminCard, inputCls } from "@/components/admin/admin-ui";

interface Log {
  id: string;
  action: string;
  detail: string;
  username: string;
  createdAt: string;
}

const ACTIONS: { key: string; label: string; icon: React.ComponentType<{ className?: string }>; cls: string }[] = [
  { key: "LOGIN", label: "Login", icon: LogIn, cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/8" },
  { key: "LOGOUT", label: "Logout", icon: LogOut, cls: "text-emerald-200/70 border-emerald-400/20 bg-transparent" },
  { key: "CREATE", label: "Buat", icon: Plus, cls: "text-gold-light border-gold/35 bg-gold/8" },
  { key: "UPDATE", label: "Ubah", icon: Pencil, cls: "text-sky-200 border-sky-400/30 bg-sky-400/8" },
  { key: "DELETE", label: "Hapus", icon: Trash2, cls: "text-red-300 border-red-400/30 bg-red-400/8" },
  { key: "SETTINGS", label: "Setelan", icon: Settings, cls: "text-amber-200 border-amber-400/30 bg-amber-400/8" },
  { key: "EXPORT", label: "Ekspor", icon: Download, cls: "text-teal-200 border-teal-400/30 bg-teal-400/8" },
  { key: "IMPORT", label: "Impor", icon: Upload, cls: "text-orange-200 border-orange-400/30 bg-orange-400/8" },
];

function meta(action: string) {
  return ACTIONS.find((a) => a.key === action) ?? { label: action, icon: History, cls: "text-emerald-100/70 border-emerald-400/20" };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f: string, query: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "300" });
      if (f) params.set("filter", f);
      if (query) params.set("q", query);
      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      const json = await res.json();
      setLogs(json.logs ?? []);
      setTodayCount(json.todayCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(filter, q), 250);
    return () => clearTimeout(t);
  }, [filter, q, load]);

  return (
    <div>
      <PageHeader
        icon={<History className="h-6 w-6 text-gold" />}
        title="Log Aktivitas"
        desc="Audit trail lengkap seluruh panel — siapa melakukan apa dan kapan. Bukti transparansi untuk serah terima ke tim PBB."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold text-gold-light">
            {todayCount} aktivitas hari ini
          </span>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter("")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${filter === "" ? "border border-gold/40 bg-gradient-to-r from-yellow-300/15 to-transparent text-gold-light" : "border border-emerald-400/15 text-emerald-50/55 hover:text-white"}`}
          >
            Semua
          </button>
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => setFilter(filter === a.key ? "" : a.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${filter === a.key ? "border border-gold/40 bg-gradient-to-r from-yellow-300/15 to-transparent text-gold-light" : "border border-emerald-400/15 text-emerald-50/55 hover:text-white"}`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-50/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari detail / username…" className={`${inputCls} pl-9`} />
        </div>
      </div>

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
        ) : logs.length === 0 ? (
          <p className="py-16 text-center text-sm text-emerald-50/50">Tidak ada aktivitas yang cocok.</p>
        ) : (
          <ol className="relative space-y-0 border-l border-emerald-400/12 pl-6">
            {logs.map((l) => {
              const m = meta(l.action);
              return (
                <li key={l.id} className="relative pb-6 last:pb-0">
                  <span className={`absolute -left-[2.15rem] flex h-6 w-6 items-center justify-center rounded-full border ${m.cls}`} style={{ backgroundColor: "#071a14" }}>
                    <m.icon className="h-3 w-3" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <p className="text-sm text-emerald-50/85">
                      <span className="font-bold text-white">@{l.username}</span> · {l.detail}
                    </p>
                    <span className="text-[10px] text-emerald-50/40" title={new Date(l.createdAt).toLocaleString("id-ID")}>
                      {timeAgo(l.createdAt)}
                    </span>
                  </div>
                  <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${m.cls}`}>
                    {m.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </AdminCard>
    </div>
  );
}
