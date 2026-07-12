import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { getWaitlistLimiter, ipFromHeaders } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

const MAX_NAME_LENGTH = 100;

interface WaitlistBody {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  hp?: unknown; // honeypot — real users never fill this in
}

function isValidName(name: unknown): name is string {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= MAX_NAME_LENGTH;
}

/** Strips everything but digits; a valid phone has 7-15 digits (E.164-ish). */
function normalizePhone(phone: unknown): string | null {
  if (typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? digits : null;
}

export async function POST(req: NextRequest) {
  let body: WaitlistBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: bots that fill every field get a fake success and are silently dropped.
  if (typeof body.hp === 'string' && body.hp.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const firstName = isValidName(body.firstName) ? body.firstName.trim() : null;
  const lastName = isValidName(body.lastName) ? body.lastName.trim() : null;
  const phone = normalizePhone(body.phone);

  if (!firstName || !lastName || !phone) {
    return NextResponse.json(
      { error: 'Please provide a first name, last name, and a valid phone number.' },
      { status: 400 },
    );
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: 'The waitlist is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  const limiter = getWaitlistLimiter();
  if (limiter) {
    const ip = ipFromHeaders(req.headers);
    const { success } = await limiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many signups from this network. Please try again later.' },
        { status: 429 },
      );
    }
  }

  // Already on the list — return success without revealing that to avoid enumeration.
  const alreadyJoined = await redis.sismember('waitlist:phones', phone);
  if (!alreadyJoined) {
    const entry = JSON.stringify({ firstName, lastName, phone, ts: new Date().toISOString() });
    const pipeline = redis.pipeline();
    pipeline.sadd('waitlist:phones', phone);
    pipeline.lpush('waitlist:entries', entry);
    await pipeline.exec();
  }

  return NextResponse.json({ ok: true });
}
