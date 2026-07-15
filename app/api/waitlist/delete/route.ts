import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { getWaitlistLimiter, ipFromHeaders } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

interface DeleteBody {
  phone?: unknown;
}

function normalizePhone(phone: unknown): string | null {
  if (typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? digits : null;
}

function entryPhone(entry: string): string | null {
  try {
    const parsed = JSON.parse(entry) as { phone?: unknown };
    return typeof parsed.phone === 'string' ? parsed.phone : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: DeleteBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const phone = normalizePhone(body.phone);
  if (!phone) {
    return NextResponse.json({ error: 'Please provide a valid phone number.' }, { status: 400 });
  }

  const limiter = getWaitlistLimiter();
  if (limiter) {
    const ip = ipFromHeaders(req.headers);
    const { success } = await limiter.limit(`delete:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests from this network. Please try again later.' },
        { status: 429 },
      );
    }
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: 'Deletion requests are temporarily unavailable. Please email SingerSteinai@gmail.com.' },
      { status: 503 },
    );
  }

  // Remove only the matching entries with LREM instead of deleting the whole
  // list and rewriting it — a concurrent signup/delete could otherwise be lost
  // in the gap between del and lpush.
  const entries = await redis.lrange<string>('waitlist:entries', 0, -1);
  const toRemove = entries.filter((entry) => entryPhone(entry) === phone);

  const pipeline = redis.pipeline();
  pipeline.srem('waitlist:phones', phone);
  for (const entry of toRemove) {
    pipeline.lrem('waitlist:entries', 0, entry); // 0 = every exact-value match
  }
  await pipeline.exec();

  return NextResponse.json({ ok: true });
}
