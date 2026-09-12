import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Gate every /admin route except the login page itself. Next.js 16 renamed
// the middleware.js convention to proxy.js — same mechanism, new filename.
// CRUD API routes under /api/admin re-check the session themselves too
// (proxy can't be the only guard for routes callable directly).
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!req.auth && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
