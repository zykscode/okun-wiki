import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = (req.auth?.user as any)?.role;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isAdminApiRoute = nextUrl.pathname.startsWith("/api/admin");
    const isAuthRoute = nextUrl.pathname.startsWith("/auth");

    if (isAdminRoute || isAdminApiRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/login", nextUrl));
        }

        if (userRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/admin/:path*"],
};
