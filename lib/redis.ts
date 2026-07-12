import { Redis } from '@upstash/redis';
import { getFakeRedis } from './fake-redis';

let client: Redis | null | undefined;

/** True when real Upstash credentials are configured. */
export function isRealRedis(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Returns a Redis client, or null when counters/community features are disabled.
 *
 * - Real Upstash credentials present → the real client (dev and prod).
 * - No credentials in development → an in-memory shim so `npm run dev` works
 *   end-to-end without any setup (see lib/fake-redis.ts).
 * - No credentials in production → null; callers treat this as "feature off"
 *   (counters read 0, votes/reviews unavailable) and never crash.
 */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;
  if (isRealRedis()) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } else if (process.env.NODE_ENV !== 'production') {
    client = getFakeRedis() as unknown as Redis;
  } else {
    client = null;
  }
  return client;
}
