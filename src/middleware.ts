import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-edge";

/**
 * Middleware proteksi ala WordPress:
 * - Semua /admin/* kecuali /admin/login wajib login (redirect ke login)
 * - Semua /api/admin/* wajib login (401 JSON)
 * - Yang sudah login tidak boleh melihat /admin/login (redirect ke dashboard)
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  const isLoginPage = pathname === "/admin/login";
  const isApi = pathname.startsWith("/api/admin");

  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isApi) {
      return NextResponse.json({ error: "Tidak terautentikasi. Silakan login." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
