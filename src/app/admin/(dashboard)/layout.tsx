import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminShell from "@/components/admin/shell";

/** Guard server-side: sesi valid + akun masih ada di DB (revoke instan bila dihapus).
 * Peran dibaca fresh dari database sehingga perubahan role langsung berlaku. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    redirect("/admin/login");
  }

  const user = await db.adminUser
    .findUnique({
      where: { id: session.sub },
      select: { username: true, name: true, role: true },
    })
    .catch(() => null);
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      user={{ username: user.username, name: user.name, role: user.role }}
    >
      {children}
    </AdminShell>
  );
}
