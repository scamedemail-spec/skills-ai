import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { getDownloadLimiter, ipFromHeaders, isBotUserAgent } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function sanitizeSrc(raw: string | null): string {
  const cleaned = (raw ?? 'web').replace(/[^a-zA-Z0-9]/g, '');
  return cleaned || 'web';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const redirectUrl = new URL(`/skills/${encodeURIComponent(slug)}.zip`, req.url);

  // Malformed slugs never touch Redis or the filesystem; the redirect itself
  // will 404 once it reaches the static file.
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.redirect(redirectUrl, 302);
  }

  const src = sanitizeSrc(req.nextUrl.searchParams.get('src'));
  const ua = req.headers.get('user-agent');
  const referer = req.headers.get('referer') ?? '';

  const redis = getRedis();
  if (redis && !isBotUserAgent(ua)) {
    const ip = ipFromHeaders(req.headers);
    const limiter = getDownloadLimiter();
    const { success } = limiter
      ? await limiter.limit(`${ip}:${slug}`)
      : { success: true };

    if (success) {
      const pipeline = redis.pipeline();
      pipeline.incr(`downloads:${slug}:total`);
      pipeline.incr(`downloads:${slug}:${src}`);
      pipeline.incr('downloads:total');
      pipeline.lpush(
        `events:${slug}`,
        JSON.stringify({ ts: Date.now(), src, ua, referer }),
      );
      pipeline.ltrim(`events:${slug}`, 0, 999);
      await pipeline.exec();
    }
  }

  return NextResponse.redirect(redirectUrl, 302);
}
