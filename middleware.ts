import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    console.log("[MIDDLEWARE] running")
    const token = await getToken({ req });

    console.log({ token })

    const { pathname } = req.nextUrl;

    // Allow requests to static files, API routes, and Next.js internal files
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static') || pathname.startsWith('/public')) {
        return NextResponse.next();
    }

    // If the user is logged in and tries to access the login page, redirect to the home page
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // If the user is not logged in and tries to access any page other than the login page, redirect to the login page
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*'],
};
