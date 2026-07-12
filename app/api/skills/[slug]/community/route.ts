import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { disabledCommunity, isKnownSlug, isValidVoterId, readCommunity } from '@/lib/community';

export const dynamic = 'force-dynamic';

// Personalized (eligibility, your vote, your review), so never cache.
const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'Unknown skill.' }, { status: 404 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(disabledCommunity(), { headers: NO_STORE });
  }

  const vid = req.nextUrl.searchParams.get('voterId');
  const voterId = isValidVoterId(vid) ? vid : null;
  const state = await readCommunity(redis, slug, voterId);
  return NextResponse.json(state, { headers: NO_STORE });
}
