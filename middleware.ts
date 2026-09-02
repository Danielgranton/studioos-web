import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/auth/verify-email", "/auth/verify-phone"];
const AUTH_ENTRY_PATHS = ["/auth/signin", "/auth/register"];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
    const isAuthEntry = AUTH_ENTRY_PATHS.includes(pathname);

    if (isAuthEntry && request.cookies.has("studioos_access")) {
        const next = request.nextUrl.searchParams.get("next");
        const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
        return NextResponse.redirect(new URL(destination, request.url));
    }

    if (!isProtected || request.cookies.has("studioos_access")) {
        return NextResponse.next();
    }

    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(signInUrl);
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/verify-email/:path*",
        "/auth/verify-phone/:path*",
        "/auth/signin",
        "/auth/register",
    ],
};
