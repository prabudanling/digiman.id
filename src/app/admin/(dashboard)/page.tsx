"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { PageHeader, AdminCard } from "@/components/admin/admin-ui";

interface DashData {
  stats: { team: number; services: number; testimonials: number; faqs: number };
  settings: { waDisplay: string; email: string; hasLogo: boolean; updatedAt: string } | null;
}

const CARDS = [
  { key: "team", label: "Anggota Struktur", icon: Users, href: "/admin/struktur", color: "text-emerald-300" },
  { key: "services", label: "Layanan Aktif", icon: Briefcase, href: "/admin/layanan", color: "text-gold-light" },
  { key: "testimonials", label: "Testimoni", icon: MessageSquareQuote, href: "/admin/testimoni", color: "text-emerald-300" },
  { key: "faqs", label: "Pertanyaan FAQ", icon: CircleHelp, href: "/admin/faq", color: "text-gold-light" },
] as const;

const QUICK = [
  { href: "/admin/pengaturan", label: "Ubah Kontak & Logo", icon: Settings, desc: "WhatsApp, email, alamat, logo perusahaan" },
  { href: "/admin/struktur", label: "Kelola Direksi", icon: Network, desc: "Tambah anggota, unggah foto & jabatan" },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data.");
      setData(await res.json());
    } catch {
      setError("Tidak dapat terhubung ke server. Coba muat ulang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updated = data?.settings?.updatedAt ? new Date(data.settings.updatedAt) : null;

  return (
    <div>
      <PageHeader
        icon={<LayoutDashboard className="h-6 w-6 text-emerald-300" />}
        title="Dashboard"
        desc="Ringkasan konten website DIGIMAN.ID. Semua perubahan di panel ini langsung tayang di halaman publik."
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
                      <p className="font-display text-4xl font-bold text-white">
                        {data.stats[c.key]}
                      </p>
                      <p className="mt-1 text-sm font-medium text-emerald-50/55">{c.label}</p>
                    </AdminCard>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Kontak aktif */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6"
            >
              <AdminCard>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/60">Kontak Aktif Saat Ini</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <span className="font-semibold text-emerald-100">📱 {data.settings?.waDisplay ?? "-"}</span>
                      <span className="font-semibold text-emerald-100">✉️ {data.settings?.email ?? "-"}</span>
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
                        Terakhir diperbarui: {updated.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
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

            {/* Aksi cepat */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {QUICK.map((q, i) => (
                <motion.div
                  key={q.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                >
                  <Link href={q.href} className="group block">
                    <AdminCard className="flex items-center gap-5 transition-all group-hover:border-gold/35">
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
          </>
        )
      )}
    </div>
  );
}
