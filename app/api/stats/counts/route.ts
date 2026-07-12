import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import skillsIndex from '@/lib/skills-index.json';
import type { SkillSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

const CACHE = { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' };

interface RatingSummary {
  avg: number;
  count: number;
}

/**
 * Batched per-skill download counts, net vote scores, and average star
 * ratings for every card on the homepage — five Redis MGETs total (downloads,
 * upvotes, downvotes, rating sums, rating counts). Edge-cached so the whole
 * grid costs a handful of Redis commands per minute regardless of traffic,
 * well within Upstash's 10k-commands/day free tier.
 */
export async function GET() {
  const slugs = (skillsIndex as SkillSummary[]).map((s) => s.slug);
  const redis = getRedis();

  if (!redis || slugs.length === 0) {
    const zero = Object.fromEntries(slugs.map((s) => [s, 0]));
    const ratings = Object.fromEntries(slugs.map((s) => [s, null]));
    return NextResponse.json({ counts: zero, scores: zero, ratings }, { headers: CACHE });
  }

  const [downloads, ups, downs, ratingSums, ratingCounts] = await Promise.all([
    redis.mget<number[]>(...slugs.map((s) => `downloads:${s}:total`)),
    redis.mget<number[]>(...slugs.map((s) => `votes:${s}:up`)),
    redis.mget<number[]>(...slugs.map((s) => `votes:${s}:down`)),
    redis.mget<number[]>(...slugs.map((s) => `ratings:${s}:sum`)),
    redis.mget<number[]>(...slugs.map((s) => `ratings:${s}:count`)),
  ]);

  const counts = Object.fromEntries(slugs.map((s, i) => [s, downloads[i] ?? 0]));
  const scores = Object.fromEntries(slugs.map((s, i) => [s, (ups[i] ?? 0) - (downs[i] ?? 0)]));
  const ratings: Record<string, RatingSummary | null> = Object.fromEntries(
    slugs.map((s, i) => {
      const count = ratingCounts[i] ?? 0;
      if (!count) return [s, null];
      const sum = ratingSums[i] ?? 0;
      return [s, { avg: Math.round((sum / count) * 10) / 10, count }];
    }),
  );

  return NextResponse.json({ counts, scores, ratings }, { headers: CACHE });
}
