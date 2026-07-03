import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import skillsIndex from '@/lib/skills-index.json';
import type { SkillSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Batched per-skill totals for every card on the homepage, in one Redis MGET.
 * Keeps the library grid from firing 45 individual /count requests, which
 * matters on Upstash's 10k-commands/day free tier.
 */
export async function GET() {
  const slugs = (skillsIndex as SkillSummary[]).map((s) => s.slug);
  const redis = getRedis();

  if (!redis || slugs.length === 0) {
    return NextResponse.json(
      { counts: Object.fromEntries(slugs.map((s) => [s, 0])) },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } },
    );
  }

  const keys = slugs.map((slug) => `downloads:${slug}:total`);
  const values = await redis.mget<number[]>(...keys);
  const counts = Object.fromEntries(slugs.map((slug, i) => [slug, values[i] ?? 0]));

  return NextResponse.json(
    { counts },
    { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } },
  );
}
