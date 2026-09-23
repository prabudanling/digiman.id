/**
 * update-wa-office.ts — Task 13
 * 1. Ganti WhatsApp resmi ke +6281316516524 (waNumber & waDisplay).
 * 2. Tambah Representative Office Jakarta — SCBD (Gedung Bursa Efek Indonesia)
 *    sebagai branding premium, urutan tampil tepat setelah Head Office.
 */
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  // 1. WhatsApp
  const s = await p.siteSetting.update({
    where: { id: 1 },
    data: { waNumber: "6281316516524", waDisplay: "+62 813-1651-6524" },
  });
  console.log("WA:", s.waNumber, "|", s.waDisplay);

  // 2. Geser urutan kantor lama (order >= 2) satu langkah ke bawah
  await p.office.updateMany({ where: { order: { gte: 2 } }, data: { order: { increment: 1 } } });

  // 3. Tambah SCBD
  const scbd = await p.office.create({
    data: {
      type: "REP",
      label: "Representative Office — Jakarta SCBD",
      address:
        "Gedung Bursa Efek Indonesia, SCBD Lot 8, Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan 12190",
      order: 2,
    },
  });
  console.log("SCBD office:", scbd.id, "|", scbd.label);

  const list = await p.office.findMany({ orderBy: { order: "asc" } });
  console.log("URUTAN KANTOR:");
  for (const o of list) console.log(`  ${o.order}. [${o.type}] ${o.label}`);

  await p.$disconnect();
}

main().catch((e) => {
  console.error("GAGAL:", e);
  process.exit(1);
});
