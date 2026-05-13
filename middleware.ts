import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Comma-separated list of user IDs that are always granted admin access
 * regardless of their DB role (useful during early setup when no user exists yet).
 * Set in .env:  ADMIN_USER_IDS=cuid1,cuid2
 */
const ADMIN_ALLOWED_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard the /admin prefix
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Not authenticated → redirect to sign-in
  if (!token) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check role OR hardcoded ID allowlist
  const role = token.role as string | undefined;
  const isAdminRole = role === "SUPER_ADMIN" || role === "ADMIN";
  const isAllowedId = ADMIN_ALLOWED_IDS.includes(token.sub ?? "");

  if (!isAdminRole && !isAllowedId) {
    // Authenticated but not authorised — send to home with a hint
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("error", "Unauthorized");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only run on /admin and all sub-paths
  matcher: ["/admin/:path*"],
};
