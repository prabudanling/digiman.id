"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquareQuote,
  CircleHelp,
  ArrowRight,
  Settings,
  Network,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HeartPulse,
  Activity,
  LogIn,
  LogOut as LogOutIcon,
  Plus,
  Pencil,
  Trash2,
  Wrench,
  ExternalLink,
  Type,
  Eye,
  Inbox,
  ImageIcon,
  UserRoundCog,
  TrendingUp,
  Globe,
} from "lucide-react";
import { PageHeader, AdminCard } from "@/components/admin/admin-ui";

interface HealthCheck {
  label: string;
  ok: boolean;
}
interface DashData {
  stats: { team: number; services: number; testimonials: number; faqs: number };
  health: { score: number; done: number; total: number; checks: HealthCheck[] };
  settings: { waDisplay: string; email: string; hasLogo: boolean; updatedAt: string } | null;
}
interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  username: string;
  createdAt: string;
}
interface AnalyticsData {
  daily: { day: string; count: number; mobile: number }[];
  totals: { days: number; views: number; views30: number; mobileShare: number; unread: number; mediaCount: number; userCount: number };
  topPaths: { path: string; count: number }[];
  topReferrers: { source: string; count: number }[];
}

const CARDS = [
  { key: "team", label: "Anggota Struktur", icon: Users, href: "/admin/struktur", color: "text-emerald-300" },
  { key: "services", label: "Layanan Aktif", icon: Briefcase, href: "/admin/layanan", color: "text-gold-light" },
  { key: "testimonials", label: "Testimoni", icon: MessageSquareQuote, href: "/admin/testimoni", color: "text-emerald-300" },
  { key: "faqs", label: "Pertanyaan FAQ", icon: CircleHelp, href: "/admin/faq", color: "text-gold-light" },
] as const;

const QUICK = [
  { href: "/admin/beranda", label: "Edit Beranda (Hero)", icon: Type, desc: "Headline, subjudul & kata berputar" },
  { href: "/admin/pengaturan", label: "Ubah Kontak & Logo", icon: Settings, desc: "WhatsApp, email, alamat, logo perusahaan" },
  { href: "/admin/struktur", label: "Kelola Direksi", icon: Network, desc: "Tambah anggota, unggah foto & jabatan" },
];

const ACTION_META: Record<string, { label: string; icon: typeof LogIn; cls: string }> = {
  LOGIN: { label: "Masuk", icon: LogIn, cls: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/25" },
  LOGOUT: { label: "Keluar", icon: LogOutIcon, cls: "text-emerald-50/55 bg-emerald-400/5 ring-emerald-400/15" },
  CREATE: { label: "Tambah", icon: Plus, cls: "text-teal-300 bg-teal-400/10 ring-teal-400/25" },
  UPDATE: { label: "Ubah", icon: Pencil, cls: "text-gold-light bg-yellow-300/10 ring-gold/25" },
  DELETE: { label: "Hapus", icon: Trash2, cls: "text-red-300 bg-red-400/10 ring-red-400/25" },
  SETTINGS: { label: "Setelan", icon: Wrench, cls: "text-teal-200 bg-teal-400/10 ring-teal-400/20" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d === 1) return "kemarin";
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/** Ring skor kesehatan situs — animasi SVG ala WordPress Site Health. */
function HealthRing({ score }: { score: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="url(#healthGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - score / 100) }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f2c14e" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="font-display text-3xl font-bold text-white"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/50">dari 100</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [logs, setLogs] = useState<ActivityItem[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("Selamat datang kembali");
  const [todayLabel, setTodayLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, actRes, anRes] = await Promise.all([
        fetch("/api/admin/stats", { cache: "no-store" }),
        fetch("/api/admin/activity", { cache: "no-store" }),
        fetch("/api/admin/analytics?days=14", { cache: "no-store" }),
      ]);
      if (!statsRes.ok) throw new Error("Gagal memuat data.");
      setData(await statsRes.json());
      if (anRes.ok) setAnalytics(await anRes.json());
      if (actRes.ok) {
        const act = await actRes.json();
        setLogs(Array.isArray(act.logs) ? act.logs : []);
        setTodayCount(Number(act.todayCount) || 0);
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Coba muat ulang.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Salam & tanggal dihitung setelah mount (aman dari hydration mismatch)
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.user?.name && setUserName(j.user.name))
      .catch(() => {});
    const h = new Date().getHours();
    setGreeting(h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam");
    setTodayLabel(
      new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  const updated = data?.settings?.updatedAt ? new Date(data.settings.updatedAt) : null;

  return (
    <div>
      <PageHeader
        icon={<LayoutDashboard className="h-6 w-6 text-emerald-300" />}
        title="Dashboard"
        desc="Pusat kendali konten website DIGIMAN.ID — semua perubahan di panel ini langsung tayang di halaman publik."
        action={
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/50 px-4 py-2.5 text-xs font-semibold text-emerald-100/75 transition-colors hover:border-gold/40 hover:text-gold-light"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Muat Ulang
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/25 bg-red-950/30 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Banner sambutan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-r from-emerald-900/60 via-[#071a14]/80 to-[#071a14]/60 p-6 sm:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">
                {greeting}
                {userName ? `, ${userName.split(" ")[0]}` : ""}
              </p>
              <p className="mt-1 text-xs text-emerald-50/50">
                {todayLabel || "\u00A0"} · Semua sistem berjalan normal
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-950/60 px-4 py-2.5 text-xs font-semibold text-emerald-100/80 transition-colors hover:border-gold/40 hover:text-gold-light"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Lihat Website
            </a>
          </div>
        </div>
      </motion.div>

      {loading && !data ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-emerald-400/5" />
          ))}
        </div>
      ) : (
        data && (
          <>
            {/* Kartu statistik */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CARDS.map((c, i) => (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                >
                  <Link href={c.href} className="group block">
                    <AdminCard className="transition-all group-hover:border-gold/35 group-hover:shadow-[0_10px_40px_-16px_rgba(242,193,78,0.25)]">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950/70 ring-1 ring-emerald-400/25 transition-transform duration-300 group-hover:scale-110">
                          <c.icon className={`h-5 w-5 ${c.color}`} />
                        </span>
                        <ArrowRight className="h-4 w-4 text-emerald-50/25 transition-all group-hover:translate-x-1 group-hover:text-gold" />
                      </div>
                      <p className="font-display text-4xl font-bold text-white">{data.stats[c.key]}</p>
                      <p className="mt-1 text-sm font-medium text-emerald-50/55">{c.label}</p>
                    </AdminCard>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Ringkasan cepat: pengunjung, leads, media, pengguna */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {analytics && (
                <>
                  <MiniStat icon={Eye} label="Kunjungan 14 hari" value={String(analytics.totals.views)} sub={`${analytics.totals.mobileShare}% dari ponsel`} href="/admin" delay={0.1} />
                  <MiniStat icon={Globe} label="Kunjungan 30 hari" value={String(analytics.totals.views30)} sub="total pageview" href="/admin" delay={0.16} />
                  <Link href="/admin/pesan" className="group block">
                    <AdminCard className="transition-all group-hover:border-gold/35">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950/70 ring-1 ring-gold/30 transition-transform duration-300 group-hover:scale-110">
                          <Inbox className="h-5 w-5 text-gold-light" />
                        </span>
                        {analytics.totals.unread > 0 && (
                          <span className="rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-2.5 py-1 text-[10px] font-bold text-emerald-950">{analytics.totals.unread} BARU</span>
                        )}
                      </div>
                      <p className="font-display text-4xl font-bold text-white">{analytics.totals.unread}</p>
                      <p className="mt-1 text-sm font-medium text-emerald-50/55">Leads Belum Dibaca</p>
                    </AdminCard>
                  </Link>
                  <div className="grid grid-cols-2 gap-5">
                    <MiniStat icon={ImageIcon} label="Media" value={String(analytics.totals.mediaCount)} sub="aset gambar" href="/admin/media" delay={0.22} compact />
                    <MiniStat icon={UserRoundCog} label="Pengguna" value={String(analytics.totals.userCount)} sub="akun admin" href="/admin/pengguna" delay={0.28} compact />
                  </div>
                </>
              )}
            </div>

            {/* Grafik pengunjung + sumber lalu lintas */}
            {analytics && (
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-2">
                  <AdminCard className="h-full">
                    <div className="mb-5 flex items-center gap-2.5">
                      <TrendingUp className="h-4.5 w-4.5 text-gold" />
                      <h2 className="font-display text-lg font-bold text-white">Kunjungan 14 Hari Terakhir</h2>
                    </div>
                    <VisitorChart daily={analytics.daily} />
                  </AdminCard>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.5 }}>
                  <AdminCard className="h-full">
                    <div className="mb-4 flex items-center gap-2.5">
                      <Globe className="h-4.5 w-4.5 text-gold" />
                      <h2 className="font-display text-lg font-bold text-white">Sumber Kunjungan</h2>
                    </div>
                    {analytics.topReferrers.length === 0 ? (
                      <p className="py-6 text-center text-xs text-emerald-50/40">Belum ada data sumber — semua kunjungan langsung.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {analytics.topReferrers.map((r) => (
                          <li key={r.source} className="flex items-center justify-between rounded-xl border border-emerald-400/10 bg-[#0a1613] px-3.5 py-2.5">
                            <span className="truncate text-xs font-semibold text-emerald-50/75">{r.source}</span>
                            <span className="ml-3 shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold-light">{r.count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {analytics.topPaths.length > 0 && (
                      <>
                        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-emerald-50/40">Halaman Terpopuler</p>
                        <ul className="space-y-1.5">
                          {analytics.topPaths.slice(0, 3).map((p) => (
                            <li key={p.path} className="flex items-center justify-between text-xs text-emerald-50/60">
                              <span className="truncate font-mono">{p.path}</span>
                              <span className="ml-2 text-gold-light">{p.count}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </AdminCard>
                </motion.div>
              </div>
            )}

            {/* Site Health + Aktivitas */}
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {/* Kesehatan Situs */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="lg:col-span-2"
              >
                <AdminCard className="h-full">
                  <div className="mb-5 flex items-center gap-2.5">
                    <HeartPulse className="h-4.5 w-4.5 text-gold" />
                    <h2 className="font-display text-lg font-bold text-white">Kesehatan Situs</h2>
                    <span
                      className={`ml-auto rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${
                        data.health.score >= 75
                          ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25"
                          : data.health.score >= 50
                            ? "bg-yellow-300/10 text-gold-light ring-gold/25"
                            : "bg-red-400/10 text-red-300 ring-red-400/25"
                      }`}
                    >
                      {data.health.score >= 75 ? "Baik" : data.health.score >= 50 ? "Perlu Perhatian" : "Kritis"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <HealthRing score={data.health.score} />
                    <ul className="grid w-full gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {data.health.checks.map((c, i) => (
                        <motion.li
                          key={c.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 + i * 0.05, duration: 0.35 }}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          {c.ok ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 shrink-0 text-red-400/80" />
                          )}
                          <span className={c.ok ? "text-emerald-50/75" : "text-red-200/80"}>{c.label}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </AdminCard>
              </motion.div>

              {/* Aktivitas Terbaru */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5 }}
              >
                <AdminCard className="flex h-full flex-col">
                  <div className="mb-4 flex items-center gap-2.5">
                    <Activity className="h-4.5 w-4.5 text-gold" />
                    <h2 className="font-display text-lg font-bold text-white">Aktivitas</h2>
                    {todayCount > 0 && (
                      <span className="ml-auto rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-bold text-gold-light ring-1 ring-gold/25">
                        {todayCount} hari ini
                      </span>
                    )}
                  </div>
                  {logs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-emerald-50/40">Belum ada aktivitas tercatat.</p>
                  ) : (
                    <ul className="-mr-2 max-h-72 space-y-1.5 overflow-y-auto pr-2 [scrollbar-width:thin]">
                      {logs.map((log, i) => {
                        const meta = ACTION_META[log.action] ?? ACTION_META.UPDATE;
                        return (
                          <motion.li
                            key={log.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 + i * 0.05, duration: 0.35 }}
                            className="flex items-start gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-emerald-400/5"
                          >
                            <span
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ${meta.cls}`}
                            >
                              <meta.icon className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] leading-snug text-emerald-50/80" title={log.detail}>
                                {log.detail}
                              </p>
                              <p className="mt-0.5 text-[11px] text-emerald-50/35">
                                {meta.label} · @{log.username} · {timeAgo(log.createdAt)}
                              </p>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  )}
                </AdminCard>
              </motion.div>
            </div>

            {/* Aksi cepat */}
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {QUICK.map((q, i) => (
                <motion.div
                  key={q.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                >
                  <Link href={q.href} className="group block h-full">
                    <AdminCard className="flex h-full items-center gap-5 transition-all group-hover:border-gold/35">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300/15 to-emerald-400/10 ring-1 ring-gold/30">
                        <q.icon className="h-5 w-5 text-gold-light" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white">{q.label}</p>
                        <p className="mt-0.5 truncate text-xs text-emerald-50/50">{q.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-emerald-50/25 transition-all group-hover:translate-x-1 group-hover:text-gold" />
                    </AdminCard>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Kontak aktif */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.5 }}
              className="mt-6"
            >
              <AdminCard>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/60">
                      Kontak Aktif Saat Ini
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-100">
                        <Wrench className="h-3.5 w-3.5 text-emerald-300/70" /> {data.settings?.waDisplay ?? "-"}
                      </span>
                      <span className="font-semibold text-emerald-100">{data.settings?.email ?? "-"}</span>
                      <span className="flex items-center gap-1.5 text-emerald-50/60">
                        {data.settings?.hasLogo ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Logo kustom terpasang
                          </>
                        ) : (
                          "Logo bawaan emas"
                        )}
                      </span>
                    </div>
                    {updated && (
                      <p className="mt-2 text-[11px] text-emerald-50/35">
                        Terakhir diperbarui:{" "}
                        {updated.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/admin/pengaturan"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2.5 text-sm font-bold text-emerald-950 transition-all hover:brightness-110"
                  >
                    <Settings className="h-4 w-4" /> Ubah Pengaturan
                  </Link>
                </div>
              </AdminCard>
            </motion.div>
          </>
        )
      )}
    </div>
  );
}

/** Kartu statistik mini (pengunjung, media, pengguna) */
function MiniStat({
  icon: Icon,
  label,
  value,
  sub,
  href,
  delay,
  compact,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  href: string;
  delay: number;
  compact?: boolean;
}) {
  const inner = (
    <AdminCard
      className={`transition-all hover:border-gold/35 ${
        compact ? "p-4 sm:p-4" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`flex ${compact ? "h-9 w-9" : "h-11 w-11"} items-center justify-center rounded-2xl bg-emerald-950/70 ring-1 ring-emerald-400/25`}>
          <Icon className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-emerald-300`} />
        </span>
        {!compact && <ArrowRight className="h-4 w-4 text-emerald-50/20" />}
      </div>
      <p className={`font-display font-bold text-white ${compact ? "text-2xl" : "text-3xl"}`}>{value}</p>
      <p className={`mt-0.5 ${compact ? "text-[11px]" : "text-sm"} font-medium text-emerald-50/55`}>
        {label} <span className="font-normal text-emerald-50/35">· {sub}</span>
      </p>
    </AdminCard>
  );
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
      <Link href={href} className="group block h-full">
        {inner}
      </Link>
    </motion.div>
  );
}

/** Grafik batang kunjungan harian (SVG murni, animasi tinggi) */
function VisitorChart({ daily }: { daily: { day: string; count: number; mobile: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  const W = 700;
  const H = 160;
  const n = daily.length;
  const gap = 6;
  const bw = (W - gap * (n - 1)) / n;

  return (
    <div>
      <div className="flex items-end gap-1" role="img" aria-label="Grafik kunjungan harian 14 hari terakhir">
        {daily.map((d, i) => {
          const h = Math.max(3, (d.count / max) * H);
          const mh = d.count > 0 ? Math.max(2, (d.mobile / max) * H) : 0;
          const label = new Date(d.day + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" });
          return (
            <div key={d.day} className="group relative flex-1" title={`${label}: ${d.count} kunjungan`}>
              <div className="relative overflow-hidden rounded-t-md bg-emerald-400/8" style={{ height: H }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-emerald-500/50 to-emerald-300/70"
                />
                {mh > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: mh }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: "easeOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-gold/60 to-gold/80"
                  />
                )}
              </div>
              <p className="mt-1.5 truncate text-center text-[9px] text-emerald-50/35">{i % 2 === 0 ? label.split(" ")[0] : ""}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-emerald-50/50">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-emerald-500/50 to-emerald-300/70" /> Total kunjungan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-gold/60 to-gold/80" /> Dari ponsel
        </span>
        <span className="ml-auto">Maksimum: {max}/hari</span>
      </div>
    </div>
  );
}
