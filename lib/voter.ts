// Anonymous, per-browser identity used to attribute downloads, votes, and
// reviews without accounts. It is a random UUID kept in localStorage — not
// PII, not a login. The server records which slugs this id has downloaded and
// gates voting/reviewing on that ("verified download").

const VOTER_KEY = 'skills_voter_id';
const DL_HINT_PREFIX = 'skills_dl:';

export function getVoterId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

/** UI-only hint that this browser has downloaded a skill (server still verifies). */
export function markDownloaded(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DL_HINT_PREFIX + slug, '1');
  } catch {
    /* private mode / quota — the hint is optional */
  }
}

export function hasDownloadHint(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DL_HINT_PREFIX + slug) === '1';
}
