import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Define the token type (adjust based on your actual token structure)
interface Token {
    role: 'super_admin' | 'user' | 'company';
}

// Function to get allowed routes for each role
const getAllowedRoutes = (role: Token['role']): RegExp[] => {
    const routes: { [key in Token['role']]: RegExp[] } = {
        super_admin: [/^\/admin/],
        user: [
            /^\/dashboard\/(?!$).+/,
            /^\/gift-boxes\/.+\/setup\/$/,
            /^\/gift-boxes\/.+\/gifts\/$/,
            /^\/gift-boxes\/.+\/edit\/$/,
            /^\/gift-boxes\/.+\/gifts\/setup\/$/,
            /^\/gift-boxes\/sent\/$/,
            /^\/gift-boxes\/received\/$/,
            /^\/notifications\/$/,
            /^\/notifications\/\d+\/mark-read\/$/
        ],
        company: [
            /^\/dashboard\/(?!gifter).*$/,  // This should cover everything under /dashboard except /dashboard/gifter
            /^\/dashboard$/,  // This should allow access to the /dashboard page
        ]
    };
    return routes[role] || [];
};


// Function to get the default redirect path for each role
const getDefaultRedirect = (role: Token['role']): string => {
    const defaultRedirects = {
        super_admin: '/admin',
        user: '/dashboard/gifter/',
        company: '/dashboard'
    };
    return defaultRedirects[role] || '/dashboard/gifter';
};

export async function middleware(req: NextRequest) {
    const token = await getToken({ req }) as Token | null;
    const { pathname } = req.nextUrl;

    // Allow requests to static files, API routes, and Next.js internal files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/public')
    ) {
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

    // Check if the user has the necessary permissions to access the requested path
    if (token) {
        const userRole = token.role;
        const allowedRoutes = getAllowedRoutes(userRole);

        // Check if the requested path is allowed for the user's role
        const isAllowed = allowedRoutes.some(regex => regex.test(pathname));

        if (!isAllowed) {
            // If the user does not have permission, redirect to the default path for their role
            // Ensure the redirection does not cause a loop
            const redirectTo = getDefaultRedirect(userRole);
            if (pathname !== redirectTo) {
                return NextResponse.redirect(new URL(redirectTo, req.url));
            }
        }
    }

    // console.log(`Redirecting to: ${getDefaultRedirect(token?.role || 'user')}`);

    // Allow the request to proceed
    return NextResponse.next();
}


export const config = {
    matcher: ['/:path*'],
};
