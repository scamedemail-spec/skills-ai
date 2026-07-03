import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const redis = getRedis();

  if (!redis) {
    return NextResponse.json(
      { total: 0, web: 0, cli: 0 },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } },
    );
  }

  const [total, web, cli] = await redis.mget<number[]>(
    `downloads:${slug}:total`,
    `downloads:${slug}:web`,
    `downloads:${slug}:cli`,
  );

  return NextResponse.json(
    { total: total ?? 0, web: web ?? 0, cli: cli ?? 0 },
    { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } },
  );
}
