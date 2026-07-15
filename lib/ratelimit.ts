import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { isRealRedis } from './redis';

// Rate limiting needs a *real* Upstash client (it runs Lua scripts), so it is
// only active when credentials are configured. In local dev (in-memory shim)
// the limiters are null and callers treat that as "allow".
let ratelimitClient: Redis | null | undefined;

function getRatelimitRedis(): Redis | null {
  if (ratelimitClient !== undefined) return ratelimitClient;
  ratelimitClient = isRealRedis()
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : null;
  return ratelimitClient;
}

function makeLimiter(
  cache: { value: Ratelimit | null | undefined },
  tokens: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  prefix: string,
): Ratelimit | null {
  if (cache.value !== undefined) return cache.value;
  const redis = getRatelimitRedis();
  cache.value = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(tokens, window),
        prefix,
        analytics: false,
      })
    : null;
  return cache.value;
}

const downloadCache: { value: Ratelimit | null | undefined } = { value: undefined };
const waitlistCache: { value: Ratelimit | null | undefined } = { value: undefined };
const voteCache: { value: Ratelimit | null | undefined } = { value: undefined };
const reviewCache: { value: Ratelimit | null | undefined } = { value: undefined };

/** 3 counted downloads per {ip, slug} per hour. */
export function getDownloadLimiter(): Ratelimit | null {
  return makeLimiter(downloadCache, 3, '1 h', 'ratelimit:download');
}

/** 5 waitlist signups per IP per hour. */
export function getWaitlistLimiter(): Ratelimit | null {
  return makeLimiter(waitlistCache, 5, '1 h', 'ratelimit:waitlist');
}

/** 60 vote actions per IP per hour (votes are cheap; users toggle a lot). */
export function getVoteLimiter(): Ratelimit | null {
  return makeLimiter(voteCache, 60, '1 h', 'ratelimit:vote');
}

/** 10 review posts per IP per hour. */
export function getReviewLimiter(): Ratelimit | null {
  return makeLimiter(reviewCache, 10, '1 h', 'ratelimit:review');
}

const BOT_UA_PATTERN = /bot|crawl|spider|preview|slack|discord|twitter|facebook|whatsapp|linkedin|embed/i;

export function isBotUserAgent(ua: string | null): boolean {
  return !!ua && BOT_UA_PATTERN.test(ua);
}

/** Real client IP: last entry of x-forwarded-for is the one Vercel's edge appends and controls; earlier entries are client-supplied and spoofable. */
export function ipFromHeaders(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
