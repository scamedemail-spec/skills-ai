import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from './redis';

let limiter: Ratelimit | null | undefined;

/** Sliding window: 3 counted downloads per {ip, slug} per hour. Returns null if Redis isn't configured. */
export function getDownloadLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const redis = getRedis();
  limiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        prefix: 'ratelimit:download',
        analytics: false,
      })
    : null;
  return limiter;
}

const BOT_UA_PATTERN = /bot|crawl|spider|preview|slack|discord|twitter|facebook|whatsapp|linkedin|embed/i;

export function isBotUserAgent(ua: string | null): boolean {
  return !!ua && BOT_UA_PATTERN.test(ua);
}

/** First IP in x-forwarded-for, or 'unknown' when absent (e.g. local dev). */
export function ipFromHeaders(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}
