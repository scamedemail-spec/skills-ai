import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { getReviewLimiter, ipFromHeaders } from '@/lib/ratelimit';
import { deleteReview, isKnownSlug, isValidVoterId, upsertReview } from '@/lib/community';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

interface ReviewBody {
  voterId?: unknown;
  name?: unknown;
  body?: unknown;
  rating?: unknown;
}

/** Create or edit the caller's review (one per verified downloader per skill). */
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'Unknown skill.' }, { status: 404 });
  }

  let body: ReviewBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isValidVoterId(body.voterId)) {
    return NextResponse.json({ error: 'Invalid voter id.' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Reviews are unavailable right now.' }, { status: 503 });
  }

  const limiter = getReviewLimiter();
  if (limiter) {
    const { success } = await limiter.limit(ipFromHeaders(req.headers));
    if (!success) {
      return NextResponse.json(
        { error: 'Too many reviews. Please try again later.' },
        { status: 429 },
      );
    }
  }

  const eligible = await redis.sismember(`downloaded:${slug}`, body.voterId);
  if (eligible !== 1) {
    return NextResponse.json(
      { error: 'Download this skill first to review it.' },
      { status: 403 },
    );
  }

  const result = await upsertReview(redis, slug, body.voterId, body.name, body.body, body.rating);
  if ('error' in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result, { headers: NO_STORE });
}

/** Delete the caller's own review. */
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'Unknown skill.' }, { status: 404 });
  }

  let body: ReviewBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isValidVoterId(body.voterId)) {
    return NextResponse.json({ error: 'Invalid voter id.' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Reviews are unavailable right now.' }, { status: 503 });
  }

  const state = await deleteReview(redis, slug, body.voterId);
  return NextResponse.json(state, { headers: NO_STORE });
}
