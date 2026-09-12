import { db } from "../src/lib/db";

async function main() {
  const s = await db.siteSetting.findUnique({ where: { id: 1 } });
  if (!s) {
    console.log("NO SETTINGS ROW");
    return;
  }
  console.log(JSON.stringify({
    logoUrl: s.logoUrl ? `SET(${s.logoUrl.slice(0, 30)}...)` : null,
    heroHeadline: s.heroHeadline,
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription?.slice(0, 40),
    hours: s.hours,
  }, null, 2));
  const logs = await db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  console.log("LOGS:", logs.map((l) => `${l.action} | ${l.detail} | ${l.createdAt.toISOString()}`));
  const team = await db.teamMember.count();
  console.log("TEAM COUNT:", team);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
