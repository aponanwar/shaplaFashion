// middleware.ts — Next.js edge middleware for security & rate limiting
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes requiring admin role
const ADMIN_ROUTES = ['/admin'];
// Routes requiring authentication
const PROTECTED_ROUTES = ['/account', '/orders'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';

  // ── Security: Block suspicious patterns ─────────────────────
  const suspiciousPatterns = [
    /\.(php|asp|aspx|jsp|cgi)$/i,
    /\.\./,
    /<script/i,
    /union.*select/i,
    /drop.*table/i,
  ];
  if (suspiciousPatterns.some((p) => p.test(pathname))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── Admin route guard ───────────────────────────────────────
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, request.url));
    }
    if (token.role !== 'admin' && token.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // ── Protected routes ────────────────────────────────────────
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, request.url));
    }
  }

  // ── Security response headers ───────────────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Powered-By', 'Shapla Fashion');
  response.headers.set('X-Request-IP', ip);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images).*)',
  ],
};
