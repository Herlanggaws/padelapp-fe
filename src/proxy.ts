import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth routes are public and should redirect authenticated users to dashboard.
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

// Public content routes are accessible with or without authentication.
const publicContentRoutes = ["/", "/privacy-policy", "/terms-of-service"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isPublicContentRoute = publicContentRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isPublicRoute = isAuthRoute || isPublicContentRoute;

  // Check for auth token in cookies
  const token = request.cookies.get("access_token")?.value;
  const isAuthenticated = Boolean(token);

  // If accessing a protected route without auth, redirect to login
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing a public route while authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files (icons, images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};
