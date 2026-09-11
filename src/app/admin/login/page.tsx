"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk. Coba lagi.");
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong w-full max-w-md rounded-[2rem] border-emerald-400/20 p-8 sm:p-10"
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#071410]/80 ring-1 ring-gold/45 shadow-[0_0_40px_rgba(242,193,78,0.3)]">
          { }
          <img src="/logo-emblem.png" alt="Logo PT Digital Bisnis Manajemen" className="h-16 w-16 object-contain" />
        </span>
        <h1 className="font-display text-2xl font-bold text-white">
          Panel Admin <span className="text-gold">DIGIMAN.ID</span>
        </h1>
        <p className="mt-2 text-sm text-emerald-50/55">
          Area terbatas — masuk untuk mengelola konten website.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-emerald-100/70">
            Username
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            autoComplete="username"
            autoFocus
            className="h-12 border-emerald-400/20 bg-[#0a1613] text-emerald-50 placeholder:text-emerald-50/30"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-emerald-100/70">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-12 border-emerald-400/20 bg-[#0a1613] pr-12 text-emerald-50 placeholder:text-emerald-50/30"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-50/45 transition-colors hover:text-gold"
              aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-400/25 bg-red-950/30 px-4 py-2.5 text-sm text-red-300"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={loading || !username || !password}
          className="h-12 w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-base font-bold text-emerald-950 hover:brightness-110 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          Masuk ke Panel
        </Button>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-emerald-50/35">
        <ShieldCheck className="h-3.5 w-3.5" />
        Sesi aman terenkripsi — berlaku 7 hari per perangkat.
      </p>
      <a
        href="/"
        className="mt-3 block text-center text-xs font-semibold text-emerald-100/50 transition-colors hover:text-gold-light"
      >
        ← Kembali ke website
      </a>
    </motion.form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04100c] px-4 noise-overlay">
      <div className="absolute inset-0 starfield opacity-60" aria-hidden />
      <div
        aria-hidden
        className="animate-aurora absolute -top-24 left-[12%] h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="animate-aurora-rev absolute bottom-[-8%] right-[8%] h-[420px] w-[420px] rounded-full bg-yellow-500/10 blur-[130px]"
      />
      <div className="relative z-10 w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
