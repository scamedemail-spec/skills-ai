import { NextRequest, NextResponse } from 'next/server';

/**
 * Gates /admin with HTTP Basic Auth against ADMIN_USER/ADMIN_PASSWORD.
 * No sessions, no cookies — just a login prompt, safe over HTTPS in production.
 */
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return new NextResponse('Admin access is not configured.', { status: 503 });
  }

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice('Basic '.length));
      const separatorIndex = decoded.indexOf(':');
      const suppliedUser = decoded.slice(0, separatorIndex);
      const suppliedPass = decoded.slice(separatorIndex + 1);
      // Constant-time compare so response timing can't leak the credentials.
      if (safeEqual(suppliedUser, user) && safeEqual(suppliedPass, pass)) {
        return NextResponse.next();
      }
    } catch {
      /* malformed base64 — fall through to 401 */
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="skills.ai admin"' },
  });
}

/** Length-independent constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
  }
  return mismatch === 0;
}

export const config = {
  matcher: ['/admin/:path*'],
};
