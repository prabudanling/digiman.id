"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Network,
  Briefcase,
  MessageSquareQuote,
  CircleHelp,
  UserRound,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: Settings },
  { href: "/admin/struktur", label: "Struktur Perusahaan", icon: Network },
  { href: "/admin/layanan", label: "Layanan", icon: Briefcase },
  { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote },
  { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
  { href: "/admin/akun", label: "Akun Admin", icon: UserRound },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { username: string; name: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const sidebar = (
    <div className="flex h-full flex-col bg-[#03130e]">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-emerald-400/10 px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071410] ring-1 ring-gold/45">
          { }
          <img src="/logo-emblem.png" alt="Logo Digiman" className="h-8 w-8 object-contain" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-bold leading-tight text-white">
            DIGIMAN<span className="text-gold">.ID</span>
          </p>
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/70">
            <ShieldCheck className="h-3 w-3" /> Panel Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Menu admin">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "border border-gold/30 bg-gradient-to-r from-yellow-300/12 to-transparent text-gold-light"
                  : "border border-transparent text-emerald-50/60 hover:bg-emerald-400/8 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-4.5 w-4.5 shrink-0 ${active ? "text-gold" : "text-emerald-300/60 group-hover:text-emerald-200"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="space-y-2 border-t border-emerald-400/10 px-4 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/50 px-3 py-2.5 text-xs font-semibold text-emerald-100/80 transition-colors hover:border-gold/40 hover:text-gold-light"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Lihat Website
        </a>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-950/20 px-3 py-2.5 text-xs font-semibold text-red-300/80 transition-colors hover:border-red-400/45 hover:text-red-300 disabled:opacity-60"
        >
          <LogOut className="h-3.5 w-3.5" /> {loggingOut ? "Keluar…" : "Keluar"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04100c]">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-emerald-400/10 lg:block">
        {sidebar}
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-emerald-400/10 bg-[#03130e]/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100"
          aria-label={open ? "Tutup menu admin" : "Buka menu admin"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <p className="font-display text-sm font-bold text-white">
          DIGIMAN<span className="text-gold">.ID</span> <span className="text-emerald-300/70">Admin</span>
        </p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/20 font-display text-xs font-bold text-gold-light ring-1 ring-gold/30">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
      </header>

      {/* Sidebar mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-emerald-400/15 shadow-2xl">{sidebar}</aside>
        </div>
      )}

      {/* Konten */}
      <main className="min-h-screen lg:ml-64">
        {/* Bar user desktop */}
        <div className="sticky top-0 z-30 hidden items-center justify-end gap-4 border-b border-emerald-400/10 bg-[#04100c]/90 px-8 py-3.5 backdrop-blur-md lg:flex">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100/60 transition-colors hover:text-gold-light"
          >
            <ExternalLink className="h-3.5 w-3.5" /> digiman.id
          </a>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold leading-tight text-white">{user.name}</p>
              <p className="text-[10px] text-emerald-50/45">@{user.username}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/20 font-display text-xs font-bold text-gold-light ring-1 ring-gold/30">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
