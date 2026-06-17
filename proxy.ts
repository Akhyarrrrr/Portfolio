import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ??
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
  "ahyar12324@gmail.com";

/**
 * Protect /dashboard routes.
 *
 * Firebase Auth runs client-side only, so we cannot verify the Firebase ID
 * token directly in Proxy without the Admin SDK. Instead, this checks the
 * lightweight session cookie written after a successful whitelisted login.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("portfolio_session")?.value ?? "";

  if (session !== ADMIN_EMAIL) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
