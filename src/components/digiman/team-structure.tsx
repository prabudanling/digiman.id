"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Network, UserRound } from "lucide-react";

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  division: string | null;
  photo: string | null;
  order: number;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Avatar({ member, size = 128 }: { member: TeamMemberItem; size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded-full p-[3px]"
      style={{
        width: size,
        height: size,
        background: "conic-gradient(from 180deg, #f2c14e, #34d399, #ffe9a8, #0d9488, #f2c14e)",
        boxShadow: "0 0 34px rgba(242,193,78,0.35)",
      }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0a1613]">
        {member.photo ? (
           
          <img src={member.photo} alt={`Foto ${member.name}`} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display font-bold text-gold-light" style={{ fontSize: size * 0.34 }}>
            {initials(member.name) || <UserRound className="h-1/3 w-1/3 text-emerald-300/60" />}
          </span>
        )}
      </div>
    </div>
  );
}

/** Section Struktur Perusahaan — data dikelola via Panel Admin (/admin/struktur). */
export default function TeamStructure({ members }: { members: TeamMemberItem[] }) {
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

        {!head ? (
          <p className="mx-auto max-w-md rounded-3xl border border-dashed border-emerald-400/25 bg-emerald-400/[0.03] px-8 py-10 text-center text-sm text-emerald-50/50">
            Struktur organisasi akan segera diperbarui.
          </p>
        ) : (
          <div className="relative">
            {/* Kepala organisasi */}
            <AnimatePresence mode="wait">
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
            </AnimatePresence>

            {/* Konektor */}
            {rest.length > 0 && (
              <>
                <div className="mx-auto h-12 w-px bg-gradient-to-b from-gold/60 to-emerald-400/30" aria-hidden />
                <div className="relative mx-auto hidden h-px w-[72%] bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent sm:block" aria-hidden />
              </>
            )}

            {/* Anggota lainnya */}
            {rest.length > 0 && (
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}
