"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Settings, Network, Briefcase, MessageSquareQuote, CircleHelp,
  UserRound, ExternalLink, LogOut, Menu, X, ShieldCheck, Type, MapPin,
  ImageIcon, Inbox, LayoutTemplate, Search, Users, History, DatabaseBackup,
  Command, ChevronRight,
} from "lucide-react";

/** Definisi nav bergrup — tampil sesuai peran */
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  roles?: string[]; // kosong = semua peran
  badge?: "unread";
}
const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Dasbor",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    group: "Konten Website",
    items: [
      { href: "/admin/beranda", label: "Beranda (Hero)", icon: Type, roles: ["SUPERADMIN", "EDITOR"] },
      { href: "/admin/layanan", label: "Layanan", icon: Briefcase, roles: ["SUPERADMIN", "EDITOR"] },
      { href: "/admin/struktur", label: "Struktur Perusahaan", icon: Network, roles: ["SUPERADMIN", "EDITOR"] },
      { href: "/admin/kantor", label: "Kantor & Cabang", icon: MapPin, roles: ["SUPERADMIN", "EDITOR"] },
      { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote, roles: ["SUPERADMIN", "EDITOR"] },
      { href: "/admin/faq", label: "FAQ", icon: CircleHelp, roles: ["SUPERADMIN", "EDITOR"] },
    ],
  },
  {
    group: "Media & Pesan",
    items: [
      { href: "/admin/media", label: "Pusat Media", icon: ImageIcon, roles: ["SUPERADMIN", "EDITOR"] },
      { href: "/admin/pesan", label: "Kotak Masuk", icon: Inbox, roles: ["SUPERADMIN", "EDITOR"], badge: "unread" },
    ],
  },
  {
    group: "Tampilan & SEO",
    items: [
      { href: "/admin/tampilan", label: "Tata Letak Section", icon: LayoutTemplate, roles: ["SUPERADMIN"] },
      { href: "/admin/seo", label: "Pusat SEO", icon: Search, roles: ["SUPERADMIN"] },
    ],
  },
  {
    group: "Sistem",
    items: [
      { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: Settings, roles: ["SUPERADMIN"] },
      { href: "/admin/pengguna", label: "Pengguna & Peran", icon: Users, roles: ["SUPERADMIN"] },
      { href: "/admin/backup", label: "Backup & Pulihkan", icon: DatabaseBackup, roles: ["SUPERADMIN"] },
      { href: "/admin/aktivitas", label: "Log Aktivitas", icon: History },
    ],
  },
  {
    group: "Akun",
    items: [{ href: "/admin/akun", label: "Akun Saya", icon: UserRound }],
  },
];

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  EDITOR: "Editor",
  VIEWER: "Pengamat",
};

export default function AdminShell({
  user,
  children,
}: {
  user: { username: string; name: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unread, setUnread] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const role = user.role || "SUPERADMIN";

  // Badge kotak masuk: ambil jumlah pesan baru + refresh saat pindah halaman/fokus
  useEffect(() => {
    let alive = true;
    const load = () => {
      fetch("/api/admin/messages?filter=new")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (alive && j?.counts) setUnread(j.counts.new ?? 0);
        })
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, 60_000);
    window.addEventListener("focus", load);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, [pathname]);

  // Shortcut global Ctrl/Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  const groups = useMemo(
    () =>
      NAV_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((it) => !it.roles || it.roles.includes(role)),
      })).filter((g) => g.items.length > 0),
    [role]
  );

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const sidebar = (
    <div className="flex h-full flex-col bg-[#03130e]">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-emerald-400/10 px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071410] ring-1 ring-gold/45">
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

      {/* Nav bergrup */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4 digiman-scroll" aria-label="Menu admin">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-50/30">
              {g.group}
            </p>
            <div className="space-y-0.5">
              {g.items.map((item) => {
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
                    <span className="flex-1">{item.label}</span>
                    {item.badge === "unread" && unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-1.5 text-[10px] font-bold text-emerald-950">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="space-y-2 border-t border-emerald-400/10 px-4 py-4">
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/50 px-3 py-2.5 text-xs font-semibold text-emerald-100/80 transition-colors hover:border-gold/40 hover:text-gold-light"
        >
          <Command className="h-3.5 w-3.5" /> Pencarian Cepat
          <kbd className="rounded border border-emerald-400/25 bg-[#071410] px-1.5 py-0.5 font-mono text-[9px] text-emerald-300/70">
            Ctrl K
          </kbd>
        </button>
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
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 text-emerald-100"
          aria-label="Pencarian cepat"
        >
          <Command className="h-4 w-4" />
        </button>
      </header>

      {/* Sidebar mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-emerald-400/15 shadow-2xl">{sidebar}</aside>
        </div>
      )}

      {/* Command palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        groups={groups}
        unread={unread}
        onLogout={logout}
      />

      {/* Konten */}
      <main className="min-h-screen lg:ml-64">
        {/* Bar user desktop */}
        <div className="sticky top-0 z-30 hidden items-center justify-end gap-4 border-b border-emerald-400/10 bg-[#04100c]/90 px-8 py-3.5 backdrop-blur-md lg:flex">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-[#071a14]/80 px-3.5 py-1.5 text-xs text-emerald-50/55 transition-colors hover:border-gold/40 hover:text-gold-light"
          >
            <Search className="h-3.5 w-3.5" /> Cari menu…
            <kbd className="rounded border border-emerald-400/25 bg-[#071410] px-1.5 py-0.5 font-mono text-[9px]">Ctrl K</kbd>
          </button>
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
              <p className="flex items-center justify-end gap-1 text-[10px] text-emerald-50/45">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-1.5 py-px font-semibold text-gold-light">
                  {ROLE_LABEL[role] ?? role}
                </span>
                @{user.username}
              </p>
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

/** Command palette ala VS Code/Linear — navigasi instan tanpa mouse */
function CommandPalette({
  open,
  onClose,
  groups,
  unread,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  groups: { group: string; items: NavItem[] }[];
  unread: number;
  onLogout: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const actions = useMemo(
    () => [
      { label: "Lihat Website (tab baru)", href: "/", external: true, group: "Aksi" },
      { label: "Keluar dari panel admin", action: "logout", group: "Aksi" },
    ],
    []
  );

  const flat = useMemo(() => {
    const items: { label: string; group: string; href: string; icon: NavItem["icon"]; external?: boolean; action?: string; badge?: number }[] = [];
    for (const g of groups) {
      for (const it of g.items) {
        items.push({
          label: it.label,
          group: g.group,
          href: it.href,
          icon: it.icon,
          badge: it.badge === "unread" && unread > 0 ? unread : undefined,
        });
      }
    }
    for (const a of actions) items.push({ ...a, icon: a.external ? ExternalLink : LogOut });
    return items;
  }, [groups, actions, unread]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flat;
    return flat.filter((it) => it.label.toLowerCase().includes(q) || it.group.toLowerCase().includes(q));
  }, [flat, query]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const run = useCallback(
    (item: (typeof results)[number]) => {
      onClose();
      if (item.action === "logout") {
        onLogout();
        return;
      }
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(item.href);
    },
    [onClose, onLogout, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Pencarian cepat admin">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#071a14] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3 border-b border-emerald-400/15 px-4 py-3.5">
          <Search className="h-4.5 w-4.5 text-emerald-300/60" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(results.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter" && results[idx]) {
                e.preventDefault();
                run(results[idx]);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Ketik nama halaman… (Layanan, Pesan, SEO, Pengguna…)"
            className="flex-1 bg-transparent text-sm text-emerald-50 placeholder:text-emerald-50/30 outline-none"
            aria-label="Ketik nama halaman"
          />
          <kbd className="rounded border border-emerald-400/25 bg-[#071410] px-1.5 py-0.5 font-mono text-[9px] text-emerald-300/60">ESC</kbd>
        </div>
        <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2 digiman-scroll">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-emerald-50/40">Tidak ada hasil untuk “{query}”.</p>
          ) : (
            results.map((it, i) => (
              <button
                key={`${it.group}-${it.label}`}
                onClick={() => run(it)}
                onMouseEnter={() => setIdx(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                  i === idx ? "bg-gradient-to-r from-yellow-300/12 to-transparent text-gold-light" : "text-emerald-50/70"
                }`}
              >
                <it.icon className={`h-4 w-4 shrink-0 ${i === idx ? "text-gold" : "text-emerald-300/50"}`} />
                <span className="flex-1">{it.label}</span>
                {it.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-1.5 text-[10px] font-bold text-emerald-950">
                    {it.badge}
                  </span>
                ) : null}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-50/30">{it.group}</span>
                <ChevronRight className={`h-3.5 w-3.5 ${i === idx ? "text-gold/70" : "text-transparent"}`} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
