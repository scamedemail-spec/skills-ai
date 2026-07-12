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

  const entries = await redis.lrange<string>('waitlist:entries', 0, -1);
  const keptEntries = entries.filter((entry) => entryPhone(entry) !== phone);

  const pipeline = redis.pipeline();
  pipeline.srem('waitlist:phones', phone);
  pipeline.del('waitlist:entries');
  if (keptEntries.length > 0) {
    pipeline.lpush('waitlist:entries', ...keptEntries.slice().reverse());
  }
  await pipeline.exec();

  return NextResponse.json({ ok: true });
}
