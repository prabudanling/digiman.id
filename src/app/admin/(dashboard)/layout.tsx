import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import AdminShell from "@/components/admin/shell";

/** Guard server-side: semua halaman dalam grup ini wajib punya sesi valid. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    redirect("/admin/login");
  }
  return <AdminShell user={{ username: session.username, name: session.name }}>{children}</AdminShell>;
}
