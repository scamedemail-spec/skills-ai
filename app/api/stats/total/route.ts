import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const redis = getRedis();
  const total = redis ? ((await redis.get<number>('downloads:total')) ?? 0) : 0;

  return NextResponse.json(
    { total },
    { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } },
  );
}
