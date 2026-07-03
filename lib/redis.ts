import { Redis } from '@upstash/redis';

let client: Redis | null | undefined;

/**
 * Returns a shared Upstash Redis client, or null when the env vars are not
 * configured. Every caller must treat null as "counters disabled" — the site
 * (and downloads) keep working without Redis.
 */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}
