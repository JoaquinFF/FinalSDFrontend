import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0"

export async function middleware(request) {
    try {
        const authRes = await auth0.middleware(request);

        // authentication routes — let the middleware handle it
        if (request.nextUrl.pathname.startsWith("/auth")) {
            return authRes;
        }

        // public routes — no need to check for session
        if (request.nextUrl.pathname === ("/")) {
            return authRes;
        }

        const { origin } = new URL(request.url)
        const session = await auth0.getSession()

        // user does not have a session — redirect to login
        if (!session) {
            return NextResponse.redirect(`${origin}/auth/login`)
        }

        return authRes
    } catch (error) {
        console.error('Auth0 middleware error:', error);
        
        // If it's a JWE decryption error, clear any existing session cookies
        if (error.name === 'JWEDecryptionFailed') {
            const response = NextResponse.next();
            // Clear Auth0 session cookies
            response.cookies.delete('appSession');
            response.cookies.delete('a0:state');
            return response;
        }
        
        // For other errors, just continue
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - api (API routes)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)",
    ],
}