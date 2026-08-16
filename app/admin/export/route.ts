import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

/**
 * Admin-only full data export — an off-Redis backup of everything that can't be
 * regenerated (waitlist entries, download counters, votes, ratings, reviews,
 * event logs). Gated by the same HTTP Basic Auth as the rest of /admin via
 * middleware. Manual by design: the operator downloads a JSON file whenever
 * they want a backup, with no new infrastructure or third-party store.
 */
export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Redis is not configured.' }, { status: 503 });
  }

  const keys = await redis.keys('*');
  const data: Record<string, unknown> = {};

  for (const key of keys) {
    const type = await redis.type(key);
    if (type === 'string') data[key] = await redis.get(key);
    else if (type === 'list') data[key] = await redis.lrange(key, 0, -1);
    else if (type === 'set') data[key] = await redis.smembers(key);
    else if (type === 'hash') data[key] = await redis.hgetall(key);
    else data[key] = { _unsupportedType: type };
  }

  const date = new Date().toISOString().slice(0, 10);
  const payload = JSON.stringify(
    { exportedAt: new Date().toISOString(), keyCount: keys.length, data },
    null,
    2,
  );

  return new NextResponse(payload, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="skills-ai-backup-${date}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
