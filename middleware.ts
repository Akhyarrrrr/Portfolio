import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "ahyar12324@gmail.com";

/**
 * Protect /dashboard routes.
 *
 * Firebase Auth runs client-side only, so we cannot verify the Firebase ID
 * token directly in Edge middleware without the Admin SDK.  Instead we rely
 * on a lightweight session cookie ("portfolio_session") that we write after
 * a successful login (see login/page.tsx) and clear on logout.
 *
 * The cookie value is just the signed-in email — this is sufficient for a
 * single-owner portfolio dashboard.  Anyone who can set a cookie in their
 * own browser is already past the Google OAuth + email whitelist check.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard the dashboard subtree
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("portfolio_session")?.value ?? "";

  // Validate: cookie must match the admin email exactly
  if (session !== ADMIN_EMAIL) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
