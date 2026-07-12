import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Daily snapshot of every skill's total downloads, for future analytics.
 * Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically
 * when CRON_SECRET is set as a project env var — see vercel.json for schedule.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ ok: true, skipped: 'redis not configured' });
  }

  const keys = await redis.keys('downloads:*:total');
  const totals: Record<string, number> = {};

  if (keys.length > 0) {
    const values = await redis.mget<number[]>(...keys);
    keys.forEach((key, i) => {
      // downloads:{slug}:total -> slug (slug itself never contains ':')
      const slug = key.slice('downloads:'.length, -':total'.length);
      totals[slug] = values[i] ?? 0;
    });
  }

  const sitewideTotal = (await redis.get<number>('downloads:total')) ?? 0;
  const waitlistEntries = await redis.lrange<string>('waitlist:entries', 0, -1);
  const date = new Date().toISOString().slice(0, 10);

  await redis.set(
    `snapshots:${date}`,
    JSON.stringify({
      date,
      sitewideTotal,
      totals,
      waitlistEntries,
      waitlistCount: waitlistEntries.length,
      capturedAt: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true, date, skills: keys.length, waitlistEntries: waitlistEntries.length });
}
