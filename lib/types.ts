export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
  /** Inline UTF-8 contents for text files ≤100KB; null for binaries / oversized files. */
  content?: string | null;
}

export interface SkillSummary {
  slug: string;
  name: string;
  description: string;
  author: string;
  verified: boolean;
  sizeKb: number;
  /** Pinned skills sort before all others in the default (non-search) library view. */
  pinned: boolean;
}

export interface SkillManifestEntry extends SkillSummary {
  fileTree: FileNode[];
}

export type VoteValue = 'up' | 'down';

export interface Review {
  id: string;
  name: string;
  /** 1-5 stars. Required on every review; text body is optional. */
  rating: number;
  body: string;
  ts: string; // ISO timestamp
}

/** Everything the reviews/votes UI needs for one skill, from one request. */
export interface CommunityState {
  /** False when Redis is unconfigured (production without credentials). */
  enabled: boolean;
  /** Whether the calling browser has a verified download and may vote/review. */
  eligible: boolean;
  up: number;
  down: number;
  score: number;
  yourVote: VoteValue | null;
  reviews: Review[];
  yourReview: Review | null;
  count: number;
  /** Mean star rating across reviews, 1 decimal; null when there are none. */
  avgRating: number | null;
}
