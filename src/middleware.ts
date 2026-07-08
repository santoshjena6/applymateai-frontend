import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require login
const PROTECTED = [
    "/dashboard",
    "/jobs",
    "/resume-upload",
    "/applications",
    "/profile",
    "/settings",
    "/manual-profile",
    "/pricing",
    "/email-automation",
];

// Routes that logged-in users shouldn't see
const AUTH_ONLY = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = request.cookies.has("applync_auth");

    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    const isAuthOnly  = AUTH_ONLY.some((p) => pathname.startsWith(p));

    // Not logged in → trying to access protected page → send to login
    if (isProtected && !isAuthenticated) {
        const url = new URL("/login", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // Already logged in → trying to access login/register → send to dashboard
    if (isAuthOnly && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/jobs/:path*",
        "/resume-upload/:path*",
        "/applications/:path*",
        "/profile/:path*",
        "/settings/:path*",
        "/manual-profile/:path*",
        "/pricing/:path*",
        "/email-automation/:path*",
        "/login",
        "/register",
    ],
};
