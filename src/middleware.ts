import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminAuthConfigured, sessionIsValid } from "@/lib/adminAuth";

/**
 * Gates the admin area at the edge, before the dashboard renders or any admin
 * API handler runs. Previously the only lock was a PIN compared in the browser,
 * which meant the page and its data endpoints were reachable by anyone who
 * skipped the UI.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};

const PUBLIC_PATHS = new Set([
  "/admin/login",
  "/api/admin/login",
  "/api/admin/logout",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The sign-in screen and the endpoints that power it must stay reachable,
  // otherwise there is no way to obtain a session.
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const authorised =
    adminAuthConfigured() &&
    (await sessionIsValid(request.cookies.get(ADMIN_COOKIE)?.value));

  if (authorised) {
    return NextResponse.next();
  }

  // APIs get a status code; humans get redirected somewhere useful.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized. Sign in at /admin/login." },
      { status: 401 }
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}
