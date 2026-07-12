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
    const decoded = atob(auth.slice('Basic '.length));
    const separatorIndex = decoded.indexOf(':');
    const suppliedUser = decoded.slice(0, separatorIndex);
    const suppliedPass = decoded.slice(separatorIndex + 1);
    if (suppliedUser === user && suppliedPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="skills.ai admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
