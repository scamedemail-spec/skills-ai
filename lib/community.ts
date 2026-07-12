import type { Redis } from '@upstash/redis';
import type { CommunityState, Review, VoteValue } from './types';
import type { SkillSummary } from './types';
import skillsIndex from './skills-index.json';

// Redis keys, all scoped by skill slug:
//   downloaded:{slug}       SET of voterIds with a verified download (eligibility)
//   votes:{slug}:up|down    INT vote counters
//   vote:{slug}:{voterId}   STRING the voter's current vote ('up'|'down')
//   reviews:{slug}          HASH voterId -> JSON Review (one review per voter)
//   ratings:{slug}:sum      INT sum of all star ratings — kept alongside
//   ratings:{slug}:count    INT number of ratings — so the batch card endpoint
//                           can MGET averages instead of HGETALL-ing every skill
const dl = (slug: string) => `downloaded:${slug}`;
const upKey = (slug: string) => `votes:${slug}:up`;
const downKey = (slug: string) => `votes:${slug}:down`;
const voteKey = (slug: string, voterId: string) => `vote:${slug}:${voterId}`;
const reviewsKey = (slug: string) => `reviews:${slug}`;
const ratingSumKey = (slug: string) => `ratings:${slug}:sum`;
const ratingCountKey = (slug: string) => `ratings:${slug}:count`;

const KNOWN_SLUGS = new Set((skillsIndex as SkillSummary[]).map((s) => s.slug));
const VOTER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const MAX_REVIEW_BODY = 1000;
export const MAX_REVIEW_NAME = 60;
export const DOWNLOAD_ELIGIBILITY_TTL = 60 * 60 * 24 * 365; // 1 year

export function isKnownSlug(slug: string): boolean {
  return KNOWN_SLUGS.has(slug);
}

export function isValidVoterId(id: unknown): id is string {
  return typeof id === 'string' && VOTER_ID_PATTERN.test(id);
}

export function disabledCommunity(): CommunityState {
  return {
    enabled: false,
    eligible: false,
    up: 0,
    down: 0,
    score: 0,
    yourVote: null,
    reviews: [],
    yourReview: null,
    count: 0,
    avgRating: null,
  };
}

function isValidRating(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
}

/** Strip control characters and clamp length. */
function clean(input: unknown, max: number): string {
  if (typeof input !== 'string') return '';
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

/** Records a verified download for this voter (called from the download route). */
export function eligibilityWrite(pipeline: ReturnType<Redis['pipeline']>, slug: string, voterId: string) {
  pipeline.sadd(dl(slug), voterId);
  pipeline.expire(dl(slug), DOWNLOAD_ELIGIBILITY_TTL);
}

/** Reads the full community state for a skill in a single round trip. */
export async function readCommunity(
  redis: Redis,
  slug: string,
  voterId: string | null,
): Promise<CommunityState> {
  const [up, down, yourVoteRaw, hash, eligibleFlag] = await Promise.all([
    redis.get<number>(upKey(slug)),
    redis.get<number>(downKey(slug)),
    voterId ? redis.get<string>(voteKey(slug, voterId)) : Promise.resolve(null),
    redis.hgetall<Record<string, string>>(reviewsKey(slug)),
    voterId ? redis.sismember(dl(slug), voterId) : Promise.resolve(0),
  ]);

  const entries = Object.entries(hash ?? {});
  const parsed = entries
    .map(([vid, raw]) => {
      try {
        return { vid, review: JSON.parse(raw) as Review };
      } catch {
        return null;
      }
    })
    .filter((x): x is { vid: string; review: Review } => x !== null)
    .sort((a, b) => b.review.ts.localeCompare(a.review.ts));

  const u = up ?? 0;
  const d = down ?? 0;

  // Average is computed from the reviews themselves (not the sum/count
  // counters), so the single-skill view can never drift out of sync.
  const ratings = parsed.map((x) => x.review.rating).filter(isValidRating);
  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;

  return {
    enabled: true,
    eligible: eligibleFlag === 1,
    up: u,
    down: d,
    score: u - d,
    yourVote: yourVoteRaw === 'up' || yourVoteRaw === 'down' ? yourVoteRaw : null,
    reviews: parsed.map((x) => x.review),
    yourReview: voterId ? parsed.find((x) => x.vid === voterId)?.review ?? null : null,
    count: parsed.length,
    avgRating,
  };
}

/** Applies a vote change (up/down/clear) and returns fresh state. */
export async function applyVote(
  redis: Redis,
  slug: string,
  voterId: string,
  value: VoteValue | 'none',
): Promise<CommunityState> {
  const prev = await redis.get<string>(voteKey(slug, voterId));
  const prevVote = prev === 'up' || prev === 'down' ? prev : null;

  if (prevVote !== value) {
    const pipeline = redis.pipeline();
    if (prevVote === 'up') pipeline.decr(upKey(slug));
    if (prevVote === 'down') pipeline.decr(downKey(slug));
    if (value === 'up') pipeline.incr(upKey(slug));
    if (value === 'down') pipeline.incr(downKey(slug));
    if (value === 'none') pipeline.del(voteKey(slug, voterId));
    else pipeline.set(voteKey(slug, voterId), value);
    await pipeline.exec();
  }

  return readCommunity(redis, slug, voterId);
}

/**
 * Creates or edits this voter's single review (star rating required, text
 * optional) and returns fresh state. Keeps the ratings sum/count counters in
 * step so the batch card endpoint can compute averages cheaply.
 */
export async function upsertReview(
  redis: Redis,
  slug: string,
  voterId: string,
  rawName: unknown,
  rawBody: unknown,
  rawRating: unknown,
): Promise<CommunityState | { error: string }> {
  if (!isValidRating(rawRating)) {
    return { error: 'Please choose a star rating from 1 to 5.' };
  }
  const rating = rawRating;
  const body = clean(rawBody, MAX_REVIEW_BODY); // optional — '' is a rating-only review
  const name = clean(rawName, MAX_REVIEW_NAME) || 'Anonymous';

  const existingRaw = await redis.hget<string>(reviewsKey(slug), voterId);
  let id = crypto.randomUUID();
  let previousRating: number | null = null;
  if (existingRaw) {
    try {
      const previous = JSON.parse(existingRaw) as Review;
      id = previous.id;
      if (isValidRating(previous.rating)) previousRating = previous.rating;
    } catch {
      /* unparseable existing review — treat as a new one */
    }
  }

  const review: Review = { id, name, rating, body, ts: new Date().toISOString() };
  const pipeline = redis.pipeline();
  pipeline.hset(reviewsKey(slug), { [voterId]: JSON.stringify(review) });
  if (previousRating === null) {
    pipeline.incr(ratingCountKey(slug));
    pipeline.incrby(ratingSumKey(slug), rating);
  } else if (previousRating !== rating) {
    pipeline.incrby(ratingSumKey(slug), rating - previousRating);
  }
  await pipeline.exec();
  return readCommunity(redis, slug, voterId);
}

/** Deletes this voter's own review (and its rating counters) and returns fresh state. */
export async function deleteReview(
  redis: Redis,
  slug: string,
  voterId: string,
): Promise<CommunityState> {
  const existingRaw = await redis.hget<string>(reviewsKey(slug), voterId);
  if (existingRaw) {
    let previousRating: number | null = null;
    try {
      const previous = JSON.parse(existingRaw) as Review;
      if (isValidRating(previous.rating)) previousRating = previous.rating;
    } catch {
      /* counters were never incremented for an unparseable entry */
    }
    const pipeline = redis.pipeline();
    pipeline.hdel(reviewsKey(slug), voterId);
    if (previousRating !== null) {
      pipeline.decr(ratingCountKey(slug));
      pipeline.incrby(ratingSumKey(slug), -previousRating);
    }
    await pipeline.exec();
  }
  return readCommunity(redis, slug, voterId);
}
