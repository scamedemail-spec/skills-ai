import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { getVoteLimiter, ipFromHeaders } from '@/lib/ratelimit';
import { applyVote, isKnownSlug, isValidVoterId } from '@/lib/community';

export const dynamic = 'force-dynamic';

interface VoteBody {
  voterId?: unknown;
  value?: unknown;
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'Unknown skill.' }, { status: 404 });
  }

  let body: VoteBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isValidVoterId(body.voterId)) {
    return NextResponse.json({ error: 'Invalid voter id.' }, { status: 400 });
  }
  if (body.value !== 'up' && body.value !== 'down' && body.value !== 'none') {
    return NextResponse.json({ error: 'Invalid vote value.' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Voting is unavailable right now.' }, { status: 503 });
  }

  const limiter = getVoteLimiter();
  if (limiter) {
    const { success } = await limiter.limit(ipFromHeaders(req.headers));
    if (!success) {
      return NextResponse.json({ error: 'Too many votes. Please slow down.' }, { status: 429 });
    }
  }

  // Verified-download gate: only browsers that actually downloaded may vote.
  const eligible = await redis.sismember(`downloaded:${slug}`, body.voterId);
  if (eligible !== 1) {
    return NextResponse.json(
      { error: 'Download this skill first to vote on it.' },
      { status: 403 },
    );
  }

  const state = await applyVote(redis, slug, body.voterId, body.value);
  return NextResponse.json(state, { headers: { 'Cache-Control': 'no-store' } });
}
