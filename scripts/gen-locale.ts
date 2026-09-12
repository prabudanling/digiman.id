/**
 * Generator terjemahan multi-bahasa via LLM (z-ai-web-dev-sdk).
 * Sumber: src/lib/i18n/dict-id.ts (Indonesia), konteks kualitas: dict-en.ts
 * Output: src/lib/i18n/locales/<locale>.json (ter-merge, resumable per chunk)
 * Pemakaian: bun scripts/gen-locale.ts zh  (atau es|hi|ar|fr|pt|ru|ja)
 */
import ZAI from "z-ai-web-dev-sdk";
import { writeFileSync, readFileSync, existsSync } from "fs";
import idDict from "../src/lib/i18n/dict-id";

const TARGET = process.argv[2] ?? "";
const VALID = ["zh", "es", "hi", "ar", "fr", "pt", "ru", "ja"];
if (!VALID.includes(TARGET)) {
  console.error(`Locale tidak valid. Pakai salah satu: ${VALID.join(", ")}`);
  process.exit(1);
}
const OUT = `src/lib/i18n/locales/${TARGET}.json`;

const LANG_NAME: Record<string, string> = {
  zh: "Simplified Chinese (简体中文)",
  es: "Spanish (Español)",
  hi: "Hindi (हिन्दी)",
  ar: "Modern Standard Arabic (العربية)",
  fr: "French (Français)",
  pt: "Brazilian Portuguese (Português)",
  ru: "Russian (Русский)",
  ja: "Japanese (日本語)",
};

/** Ambil subset kamus by path untuk dikirim ke LLM. */
function subset(dict: any, paths: string[]): any {
  const out: any = {};
  for (const p of paths) {
    const keys = p.split(".");
    let src = dict, dst = out;
    for (let i = 0; i < keys.length - 1; i++) {
      src = src?.[keys[i]];
      dst = dst[keys[i]] ??= {};
    }
    dst[keys[keys.length - 1]] = src?.[keys[keys.length - 1]];
  }
  return out;
}

const SVC_SLUGS = Object.keys((idDict as any).content.services);
const FAQ_SLUGS = Object.keys((idDict as any).content.faqs);
const TESTI_SLUGS = Object.keys((idDict as any).content.testi);

function pickServices(dict: any, slugs: string[]): any {
  const out: any = { content: { services: {} } };
  for (const s of slugs) out.content.services[s] = dict?.content?.services?.[s];
  return out;
}
function pickFaqs(dict: any, slugs: string[]): any {
  const out: any = { content: { faqs: {} } };
  for (const s of slugs) out.content.faqs[s] = dict?.content?.faqs?.[s];
  return out;
}
function pickTesti(dict: any, slugs: string[]): any {
  const out: any = { content: { testi: {} } };
  for (const s of slugs) out.content.testi[s] = dict?.content?.testi?.[s];
  return out;
}

const CHUNKS: { name: string; get: (d: any) => any }[] = [
  { name: "chrome", get: (d) => subset(d, ["nav", "preloader", "hero", "stats", "marquee", "switcher", "floating", "footer"]) },
  { name: "seven", get: (d) => subset(d, ["seven"]) },
  { name: "services-why", get: (d) => subset(d, ["services", "why"]) },
  { name: "flow", get: (d) => subset(d, ["process", "team", "offices", "testi", "faq", "cta"]) },
  ...[0, 8, 16, 24].map((off, i) => ({
    name: `content-services-${i + 1}`,
    get: (d: any) => pickServices(d, SVC_SLUGS.slice(off, off + 8)),
  })),
  ...[0, 3, 6, 9].map((off, i) => ({
    name: `content-faqs-${i + 1}`,
    get: (d: any) => pickFaqs(d, FAQ_SLUGS.slice(off, off + 3)),
  })),
  ...[0, 5].map((off, i) => ({
    name: `content-testi-${i + 1}`,
    get: (d: any) => pickTesti(d, TESTI_SLUGS.slice(off, off + 5)),
  })),
];

function systemPrompt(): string {
  return [
    `You are a senior legal & business translator localizing an Indonesian corporate-services website (company establishment, licensing, tax, certification, digital transformation consultancy — brand: DIGIMAN.ID by PT Digital Bisnis Manajemen).`,
    `Translate every value into ${LANG_NAME[TARGET]}.`,
    `RULES:`,
    `1. Keep ALL JSON keys exactly unchanged; output ONLY valid JSON, no markdown fences, no commentary.`,
    `2. Preserve numbers, symbols (©, ™, &), currency codes, proper nouns of institutions (write them naturally in target language, e.g. Kemenkumham = Ministry of Law and Human Rights style naturalization), and brand names DIGIMAN.ID / Digiman as-is.`,
    `3. Keep a professional, persuasive marketing tone (not stiff literal translation).`,
    `4. Keep prices meaningful: "Mulai Rp 3,5 jt" → equivalent like "From IDR 3.5M" style adapted to target language; keep "IDR".`,
    `5. Keep array lengths identical to source.`,
    `6. "testimoni" are client quotes — translate naturally including idioms.`,
    `7. For Arabic, use Modern Standard Arabic, business register.`,
  ].join("\n");
}

async function translateChunk(zai: any, chunkName: string, payload: any, attempt = 1): Promise<any> {
  const user = [
    `Translate the following JSON values to ${LANG_NAME[TARGET]}. Return ONLY the translated JSON with identical structure and keys.`,
    ``,
    JSON.stringify(payload, null, 1),
  ].join("\n");

  const completion = await zai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt() },
      { role: "user", content: user },
    ],
    thinking: { type: "disabled" },
    max_tokens: 16000,
  });
  const raw: string = completion.choices[0]?.message?.content ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1) throw new Error(`[${chunkName}] JSON tidak ditemukan di respons`);
  // Perbaiki JSON terpotong: tutup bracket yang masih terbuka
  let candidate = cleaned.slice(start, end > start ? end + 1 : cleaned.length);
  try {
    const parsed = JSON.parse(candidate);
    return parsed;
  } catch {
    candidate = repairJson(candidate);
    return JSON.parse(candidate);
  }
}

/** Coba perbaiki JSON terpotong dengan membuang elemen terakhir yang belum lengkap lalu menutup bracket. */
function repairJson(s: string): string {
  let t = s.replace(/,\s*$/, "");
  // buang key terakhir yang tidak lengkap (tanpa nilai)
  t = t.replace(/,?\s*"[^"]*"\s*:?\s*["']?[^,:{}\[\]]*$/, "");
  t = t.replace(/,\s*$/, "");
  const stack: string[] = [];
  let inStr = false, esc = false;
  for (const ch of t) {
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" || ch === "]") stack.pop();
  }
  if (inStr) t += '"';
  while (stack.length) t += stack.pop() === "{" ? "}" : "]";
  return t;
}

/** Validasi: jumlah daun (leaf string) harus sama dengan sumber. */
function countLeaves(o: any): number {
  if (typeof o === "string") return 1;
  if (Array.isArray(o)) return o.reduce((a: number, v: any) => a + countLeaves(v), 0);
  if (o && typeof o === "object") return Object.values(o).reduce((a: number, v: any) => a + countLeaves(v), 0);
  return 0;
}

async function main() {
  const zai = await ZAI.create();
  let merged: any = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

  for (const chunk of CHUNKS) {
    const src: any = chunk.get(idDict as any);
    const already: any = chunk.get(merged);
    if (countLeaves(already) >= countLeaves(src)) {
      console.log(`  = ${chunk.name} sudah ada, lewati`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        console.log(`  -> ${chunk.name} (percobaan ${attempt})…`);
        const out = await translateChunk(zai, chunk.name, src);
        if (countLeaves(out) !== countLeaves(src)) {
          throw new Error(`[${chunk.name}] leaf mismatch: ${countLeaves(out)} vs ${countLeaves(src)}`);
        }
        merged = deepMerge(merged, out);
        writeFileSync(OUT, JSON.stringify(merged, null, 1), "utf8");
        ok = true;
        console.log(`  OK ${chunk.name} (${countLeaves(out)} string)`);
      } catch (e) {
        console.warn(`  gagal: ${e instanceof Error ? e.message : e}`);
        if (attempt === 3) console.warn(`  >> ${chunk.name} dilewati setelah 3 percobaan (fallback id akan menutup)`);
        await new Promise((r) => setTimeout(r, 8000 * attempt));
      }
    }
    // jeda antar-chunk untuk hindari rate limit
    await new Promise((r) => setTimeout(r, 6000));
  }
  console.log(`Selesai ${TARGET}: ${OUT}`);
}

function deepMerge(base: any, over: any): any {
  if (Array.isArray(over)) return over;
  if (over && typeof over === "object") {
    const out: any = { ...(base ?? {}) };
    for (const k of Object.keys(over)) out[k] = deepMerge(base?.[k], over[k]);
    return out;
  }
  return over ?? base;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
