/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skills-ai-three.vercel.app';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
      'frame-src https://docs.google.com',
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/stats/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: siteOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        // Skill archives are immutable per deploy; force download in the browser.
        source: '/skills/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
          { key: 'Content-Disposition', value: 'attachment' },
        ],
      },
      {
        source: '/skills-manifest.json',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=3600' }],
      },
    ];
  },
};

export default nextConfig;
