'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CommunityState, VoteValue } from '@/lib/types';
import { getVoterId } from '@/lib/voter';
import { UpvoteIcon, DownvoteIcon, VerifiedIcon, StarIcon } from './icons';
import StarRating from './StarRating';

const MAX_BODY = 1000;
const MAX_NAME = 60;

/** Interactive 1-5 star picker used in the review form. */
function StarPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value ?? 0;

  return (
    <div
      role="radiogroup"
      aria-label="Star rating"
      className="flex items-center gap-1"
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="text-accent transition-transform duration-150 hover:scale-110"
        >
          <StarIcon className="h-6 w-6" filled={n <= display} />
        </button>
      ))}
    </div>
  );
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface CommunityPanelProps {
  slug: string;
  /** Increments each time the user triggers a download (to refresh eligibility). */
  downloadNonce: number;
  onDownload: () => void;
}

export default function CommunityPanel({ slug, downloadNonce, onDownload }: CommunityPanelProps) {
  const [state, setState] = useState<CommunityState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const voterId = useRef<string>('');

  const fetchCommunity = useCallback(() => {
    return fetch(`/api/skills/${slug}/community?voterId=${encodeURIComponent(voterId.current)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: CommunityState) => {
        setState(data);
        if (data.yourReview) {
          setName(data.yourReview.name === 'Anonymous' ? '' : data.yourReview.name);
          setRating(data.yourReview.rating);
        }
        return data;
      });
  }, [slug]);

  useEffect(() => {
    voterId.current = getVoterId();
    let alive = true;
    fetchCommunity().catch(() => {
      if (alive) setLoadFailed(true);
    });
    return () => {
      alive = false;
    };
  }, [fetchCommunity]);

  // After a download, eligibility is granted server-side; poll briefly to pick
  // it up (the download request and this refetch race, so retry once).
  useEffect(() => {
    if (downloadNonce === 0) return;
    let alive = true;
    const timers = [400, 1200].map((delay) =>
      setTimeout(() => {
        if (alive) fetchCommunity().catch(() => {});
      }, delay),
    );
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [downloadNonce, fetchCommunity]);

  const mutate = useCallback(
    async (input: RequestInfo, init: RequestInit) => {
      setPending(true);
      setError(null);
      try {
        const res = await fetch(input, init);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? 'Something went wrong.');
          return false;
        }
        setState(data as CommunityState);
        return true;
      } catch {
        setError('Something went wrong. Please try again.');
        return false;
      } finally {
        setPending(false);
      }
    },
    [],
  );

  const vote = (value: VoteValue) => {
    if (!state?.eligible || pending) return;
    const next = state.yourVote === value ? 'none' : value;
    mutate(`/api/skills/${slug}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: voterId.current, value: next }),
    });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || pending) return;
    const ok = await mutate(`/api/skills/${slug}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: voterId.current, name, body, rating }),
    });
    if (ok) {
      setBody('');
      setEditing(false);
    }
  };

  const deleteReview = () => {
    if (pending) return;
    mutate(`/api/skills/${slug}/reviews`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: voterId.current }),
    });
    setBody('');
    setRating(null);
    setEditing(false);
  };

  if (loadFailed) {
    return <p className="text-ink-muted">Couldn&rsquo;t load reviews. Please try again.</p>;
  }
  if (!state) {
    return <p className="text-ink-muted">Loading…</p>;
  }
  if (!state.enabled) {
    return <p className="text-ink-muted">Reviews are unavailable right now.</p>;
  }

  const { eligible, up, down, score, yourVote, reviews, yourReview, avgRating, count } = state;

  return (
    <div className="mx-auto max-w-[680px]">
      {/* Average rating + vote widget */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-bg-sidebar p-4">
        {avgRating !== null && (
          <div className="flex items-center gap-3 border-r border-line pr-4">
            <div className="font-serif text-[28px] leading-none text-accent tabular-nums">
              {avgRating.toFixed(1)}
            </div>
            <div>
              <StarRating value={avgRating} className="h-3.5 w-3.5" />
              <div className="mt-0.5 text-[11px] text-ink-faint">
                {count} {count === 1 ? 'rating' : 'ratings'}
              </div>
            </div>
          </div>
        )}
        <div className="text-center">
          <div className="font-serif text-[28px] leading-none text-ink tabular-nums">
            {score > 0 ? `+${score}` : score}
          </div>
          <div className="mt-1 text-[11px] text-ink-faint">score</div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => vote('up')}
            disabled={!eligible || pending}
            aria-pressed={yourVote === 'up'}
            aria-label="Upvote"
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
              yourVote === 'up'
                ? 'border-accent bg-[var(--accent-faint)] text-accent'
                : 'border-line text-ink-muted hover:bg-bg-card-hover'
            }`}
          >
            <UpvoteIcon className="h-4 w-4" />
            <span className="tabular-nums">{up}</span>
          </button>
          <button
            type="button"
            onClick={() => vote('down')}
            disabled={!eligible || pending}
            aria-pressed={yourVote === 'down'}
            aria-label="Downvote"
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
              yourVote === 'down'
                ? 'border-accent bg-[var(--accent-faint)] text-accent'
                : 'border-line text-ink-muted hover:bg-bg-card-hover'
            }`}
          >
            <DownvoteIcon className="h-4 w-4" />
            <span className="tabular-nums">{down}</span>
          </button>
        </div>
      </div>

      {/* Gate / review form */}
      {!eligible ? (
        <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-bg-card px-4 py-4">
          <p className="text-[13px] text-ink-muted">
            Only verified downloads can vote and review — like verified purchases.
            Download this skill to join in.
          </p>
          <button type="button" className="btn btn-primary mt-3" onClick={onDownload}>
            Download to review
          </button>
        </div>
      ) : yourReview && !editing ? (
        <div className="mt-4 rounded-lg border border-line bg-bg-card p-4">
          <p className="text-[13px] text-ink-muted">Your review</p>
          <div className="mt-1.5">
            <StarRating value={yourReview.rating} />
          </div>
          {yourReview.body && (
            <p className="mt-2 whitespace-pre-wrap text-[14px] text-ink">{yourReview.body}</p>
          )}
          <div className="mt-3 flex gap-3 text-[13px]">
            <button
              type="button"
              onClick={() => {
                setBody(yourReview.body);
                setRating(yourReview.rating);
                setEditing(true);
              }}
              className="text-accent hover:text-accent-hover"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={deleteReview}
              disabled={pending}
              className="text-ink-muted hover:text-ink disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submitReview} className="mt-4">
          <div className="mb-3">
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME}
            placeholder="Display name (optional)"
            className="mb-2 w-full rounded-md border border-line bg-bg-card px-3 py-2 text-[14px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={MAX_BODY}
            rows={3}
            placeholder="Share how this skill worked for you… (optional)"
            className="w-full resize-y rounded-md border border-line bg-bg-card px-3 py-2 text-[14px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={!rating || pending}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {yourReview ? 'Update review' : 'Post review'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setBody('');
                  setRating(null);
                }}
                className="text-[13px] text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
            )}
            <span className="ml-auto text-[12px] text-ink-faint tabular-nums">
              {body.length}/{MAX_BODY}
            </span>
          </div>
        </form>
      )}

      {error && <p className="mt-2 text-[13px] text-ink-muted">{error}</p>}

      {/* Reviews list */}
      <div className="mt-8">
        <h3 className="text-[13px] font-medium uppercase tracking-wide text-ink-faint">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </h3>
        {reviews.length === 0 ? (
          <p className="mt-3 text-[14px] text-ink-muted">
            No reviews yet. Be the first to review this skill.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-lg border border-line bg-bg-card p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-ink">{review.name}</span>
                  <span className="flex items-center gap-1 text-[12px] text-success" title="Verified download">
                    <VerifiedIcon className="h-3.5 w-3.5" />
                    Verified download
                  </span>
                  <span className="ml-auto text-[12px] text-ink-faint">{relativeTime(review.ts)}</span>
                </div>
                <div className="mt-1.5">
                  <StarRating value={review.rating} className="h-3.5 w-3.5" />
                </div>
                {review.body && (
                  <p className="mt-2 whitespace-pre-wrap text-[14px] leading-normal text-ink">
                    {review.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
