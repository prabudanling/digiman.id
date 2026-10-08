import type { ReactNode } from "react";

/** Kelas input konsisten untuk seluruh panel admin */
export const inputCls =
  "border-emerald-400/20 bg-[#0a1613] text-emerald-50 placeholder:text-emerald-50/30 focus-visible:ring-gold/40";

export const btnGold =
  "bg-gradient-to-r from-yellow-300 to-amber-400 text-emerald-950 font-bold hover:brightness-110";

export const btnEmerald =
  "bg-gradient-to-r from-emerald-400 to-teal-500 text-emerald-950 font-bold hover:brightness-110";

export function PageHeader({
  icon,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-600/10 ring-1 ring-emerald-400/35">
          {icon}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-emerald-50/55">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-emerald-400/12 bg-[#071a14]/70 p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] sm:p-7 ${className}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-100/70">{children}</label>
      {hint && <p className="mt-0.5 text-[11px] text-emerald-50/40">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-400/25 bg-emerald-400/[0.03] px-8 py-12 text-center">
      <p className="font-semibold text-emerald-100/85">{title}</p>
      <p className="mt-1.5 text-sm text-emerald-50/50">{desc}</p>
    </div>
  );
}
