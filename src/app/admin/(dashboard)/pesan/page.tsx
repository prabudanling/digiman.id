"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, Star, Archive, ArchiveRestore, Trash2, Loader2, MailOpen, Mail, MessageCircle, CheckCheck } from "lucide-react";
import { PageHeader, AdminCard } from "@/components/admin/admin-ui";

interface Msg {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: string;
  starred: boolean;
  createdAt: string;
}

type Filter = "all" | "new" | "starred" | "archived";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function MessagesPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [counts, setCounts] = useState({ new: 0, inbox: 0, starred: 0, archived: 0 });
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Msg | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f: Filter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?filter=${f}`);
      const json = await res.json();
      setMsgs(json.messages ?? []);
      setCounts(json.counts ?? { new: 0, inbox: 0, starred: 0, archived: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const patch = async (m: Msg, data: { status?: string; starred?: boolean }) => {
    const res = await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      if (json.message) setSelected((s) => (s && s.id === json.message.id ? json.message : s));
      load(filter);
    }
  };

  const openMsg = async (m: Msg) => {
    setSelected(m);
    if (m.status === "NEW") await patch(m, { status: "READ" });
  };

  const remove = async (m: Msg) => {
    if (!confirm(`Hapus pesan dari "${m.name}"? Tindakan ini permanen.`)) return;
    await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
    setSelected(null);
    load(filter);
  };

  const waLink = (m: Msg) => {
    const digits = m.phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
    const text = encodeURIComponent(
      `Halo ${m.name}, terima kasih telah menghubungi DIGIMAN.ID. Kami menerima pertanyaan Anda${m.service ? ` mengenai ${m.service}` : ""}. Bagaimana kami bisa membantu lebih lanjut?`
    );
    return `https://wa.me/${digits}?text=${text}`;
  };

  const TABS: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: counts.inbox },
    { key: "new", label: "Belum Dibaca", count: counts.new },
    { key: "starred", label: "Berbintang", count: counts.starred },
    { key: "archived", label: "Arsip", count: counts.archived },
  ];

  return (
    <div>
      <PageHeader
        icon={<Inbox className="h-6 w-6 text-gold" />}
        title="Kotak Masuk"
        desc="Leads dari formulir konsultasi di beranda masuk otomatis ke sini. Balas via WhatsApp dengan satu klik."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold text-gold-light">
            <CheckCheck className="h-3.5 w-3.5" /> {counts.new} belum dibaca
          </span>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              filter === t.key
                ? "border border-gold/40 bg-gradient-to-r from-yellow-300/15 to-transparent text-gold-light"
                : "border border-emerald-400/15 text-emerald-50/55 hover:text-white"
            }`}
          >
            {t.label} <span className="ml-1 opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Daftar pesan */}
        <AdminCard className="max-h-[70vh] overflow-y-auto digiman-scroll">
          {loading ? (
            <div className="flex items-center justify-center py-14"><Loader2 className="h-7 w-7 animate-spin text-gold" /></div>
          ) : msgs.length === 0 ? (
            <div className="py-14 text-center">
              <Inbox className="mx-auto mb-3 h-10 w-10 text-emerald-50/20" />
              <p className="text-sm text-emerald-50/50">Tidak ada pesan di tab ini.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {msgs.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => openMsg(m)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                      selected?.id === m.id
                        ? "border-gold/45 bg-gold/8"
                        : "border-emerald-400/12 bg-[#0a1613] hover:border-emerald-400/35"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-white">
                        {m.status === "NEW" && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="Belum dibaca" />}
                        <span className="truncate">{m.name}</span>
                        {m.starred && <Star className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" />}
                      </p>
                      <span className="shrink-0 text-[10px] text-emerald-50/40">{timeAgo(m.createdAt)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-emerald-50/55">{m.message}</p>
                    {m.service && (
                      <span className="mt-1.5 inline-block rounded-full border border-emerald-400/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-200/80">
                        {m.service}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* Detail pesan */}
        <AdminCard className="max-h-[70vh] overflow-y-auto digiman-scroll">
          {selected ? (
            <div>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{selected.name}</h2>
                  <p className="mt-0.5 text-xs text-emerald-50/50">
                    {selected.phone}{selected.email ? ` · ${selected.email}` : ""} · {timeAgo(selected.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => patch(selected, { starred: !selected.starred })} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${selected.starred ? "border-gold/50 bg-gold/10 text-gold-light" : "border-emerald-400/20 text-emerald-100/70 hover:border-gold/40"}`}>
                    <Star className={`h-3.5 w-3.5 ${selected.starred ? "fill-gold text-gold" : ""}`} /> {selected.starred ? "Berbintang" : "Bintangi"}
                  </button>
                  <button onClick={() => patch(selected, { status: selected.status === "ARCHIVED" ? "READ" : "ARCHIVED" })} className="flex items-center gap-1.5 rounded-xl border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-100/70 transition-colors hover:border-gold/40">
                    {selected.status === "ARCHIVED" ? <><ArchiveRestore className="h-3.5 w-3.5" /> Pulihkan</> : <><Archive className="h-3.5 w-3.5" /> Arsipkan</>}
                  </button>
                  <button onClick={() => patch(selected, { status: selected.status === "NEW" ? "READ" : "NEW" })} className="flex items-center gap-1.5 rounded-xl border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-100/70 transition-colors hover:border-gold/40">
                    {selected.status === "NEW" ? <><MailOpen className="h-3.5 w-3.5" /> Tandai dibaca</> : <><Mail className="h-3.5 w-3.5" /> Tandai belum</>}
                  </button>
                  <button onClick={() => remove(selected)} className="flex items-center gap-1.5 rounded-xl border border-red-400/30 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:border-red-400/60">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>

              {selected.service && (
                <p className="mb-3 inline-block rounded-full border border-gold/30 bg-gold/8 px-3 py-1 text-xs font-semibold text-gold-light">
                  Minat: {selected.service}
                </p>
              )}
              <div className="rounded-2xl border border-emerald-400/15 bg-[#0a1613] p-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-50/80">{selected.message}</p>
              </div>

              <a href={waLink(selected)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-display text-sm font-bold text-emerald-950 transition-all hover:brightness-110">
                <MessageCircle className="h-4 w-4" /> Balas via WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center py-14 text-center">
              <Mail className="mb-3 h-10 w-10 text-emerald-50/20" />
              <p className="text-sm text-emerald-50/50">Pilih pesan di sebelah kiri untuk membacanya.</p>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
