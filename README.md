# skills.ai

A curated library of Claude skills. Next.js 14 (App Router) + Tailwind, deployed on Vercel's free Hobby plan. Download counters and rate limiting run on Upstash Redis's free tier — no paid services, no auth, no database migrations.

## Stack

- Next.js 14 App Router + TypeScript + Tailwind
- Upstash Redis (`@upstash/redis`, `@upstash/ratelimit`) for download counters
- Fuse.js for client-side fuzzy search
- shiki + react-markdown for the SKILL.md preview modal
- Skills live as plain folders in `content/skills/`, zipped and indexed at build time

## Local setup

```bash
npm install
npm run dev
```

The site runs with zero configuration — without Redis env vars, download counters simply read `0` everywhere and nothing errors. Search, previews, and the submit page all work fully offline.

## Environment variables

Copy `.env.example` to `.env.local` and fill in as needed:

| Variable | Required? | Where to get it |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | No (counters disabled without it) | [console.upstash.com](https://console.upstash.com) → create a free database → REST API section |
| `UPSTASH_REDIS_REST_TOKEN` | No | same place |
| `CRON_SECRET` | Only for the daily snapshot cron | any random string, e.g. `openssl rand -hex 24` |
| `NEXT_PUBLIC_SITE_URL` | No (defaults to `https://skills.ai`) | your deployed domain — used in the "Copy install" command |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Only to view waitlist signups | pick any username/password — gates `/admin` with HTTP Basic Auth |

Upstash's free tier gives 10,000 commands/day, which comfortably covers thousands of pageviews/day: each download uses ~5 Redis commands, and the homepage batches all 45 per-skill counts into a single `MGET` per visitor.

## Adding a new skill

1. Create `content/skills/{your-slug}/SKILL.md` with frontmatter:

   ```yaml
   ---
   name: "Your Skill Name"
   description: "One line describing what it does."
   author: "Your Name"
   verified: false
   ---

   # Your Skill Name

   ...instructions...
   ```

2. Add any supporting files (`reference.md`, `example.md`, scripts, etc.) alongside it in the same folder.
3. Commit and push. `scripts/build-skills.ts` runs automatically as `prebuild`/`predev` — it zips the folder to `public/skills/{slug}.zip` and regenerates the manifest. Missing frontmatter fields fall back to sane defaults (name → titlecased slug, description → "No description", author → "Curated", verified → false) and are logged as build warnings; a malformed skill folder never fails the build.

## Wiring up the submit form

`/submit` renders a Google Form embed. Create a form in Google Forms, then **Send → embed `<>`** to get the iframe URL, and paste it into the `GOOGLE_FORM_EMBED_URL` constant in [app/submit/page.tsx](app/submit/page.tsx). Until you do, the page shows a placeholder explaining what to do — it never ships a broken iframe.

## Viewing analytics

All counters live directly in Upstash — open the **Data Browser** for your database at [console.upstash.com](https://console.upstash.com) and inspect:

- `downloads:total` — sitewide download count
- `downloads:{slug}:total`, `downloads:{slug}:web`, `downloads:{slug}:cli` — per-skill counts by source
- `events:{slug}` — a capped list (last 1,000) of raw download events (`{ ts, src, ua, referer }`) per skill
- `snapshots:{YYYY-MM-DD}` — a daily JSON snapshot of every skill's totals, written by the `/api/cron/snapshot` cron (see `vercel.json`) for trend analysis over time

## Votes & reviews (verified downloads only)

Each skill has an upvote/downvote score and 1-5 star reviews — but, like Amazon's verified-purchase reviews, only people who actually downloaded the skill can vote or review it. There are no accounts: each browser gets an anonymous random id in localStorage, and when it triggers a real (counted, non-bot) download, the server records that id in a `downloaded:{slug}` set. Voting and reviewing are gated on membership in that set, checked server-side.

- Net score and average star rating both show on each card and in the preview modal's **Reviews** tab.
- A review requires a 1-5 star rating; the written text is optional (a rating-only review is valid).
- Reviews render as plain text (no HTML/markdown), one editable review per verified downloader per skill.
- Everyone can read votes and reviews; only verified downloads can write.

Redis keys added:

- `downloaded:{slug}` — set of voter ids with a verified download (1-year TTL)
- `votes:{slug}:up`, `votes:{slug}:down` — vote counters
- `vote:{slug}:{voterId}` — a voter's current vote, for toggling
- `reviews:{slug}` — hash of voterId → JSON review (`{ id, name, rating, body, ts }`)
- `ratings:{slug}:sum`, `ratings:{slug}:count` — running totals kept in sync with `reviews:{slug}` so the homepage grid can compute every skill's average rating with two Redis `MGET`s instead of reading every review

No new environment variables are required. **Local dev note:** with no Upstash credentials set, `npm run dev` uses an in-memory Redis shim (see `lib/fake-redis.ts`) so votes and reviews work end-to-end locally; it is never used in production, where an unconfigured Redis simply disables these features.

## Waitlist

`/waitlist` is a simple signup page (first name, last name, phone number) for collecting interest ahead of new features. Submissions go through `/api/waitlist`, which validates input, rate-limits by IP (5/hour), rejects bot submissions via a honeypot field, and stores entries in Redis — deduplicated by phone number.

To view signups, visit `/admin` (protected by `ADMIN_USER`/`ADMIN_PASSWORD` HTTP Basic Auth — see the env vars table above). If you'd rather skip the UI, the raw data is also in the Upstash console:

- `waitlist:entries` — a Redis list of JSON signups (`{ firstName, lastName, phone, ts }`), newest first
- `waitlist:phones` — a Redis set of normalized phone numbers, used for dedup

## Deploying

1. Push this repo to GitHub.
2. In Vercel, **Add New Project** → import the repo → deploy (no build config changes needed).
3. Add the environment variables above in Project Settings → Environment Variables, then redeploy.
4. The daily snapshot cron (`vercel.json`) activates automatically on the Hobby plan.

## Rate limiting & bot filtering

`/api/skills/[slug]/download` counts at most 3 downloads per `{ip, slug}` per hour (sliding window) and skips counting entirely for requests matching common bot/crawler/link-preview user agents — in both cases the file still gets served, only the counter is skipped. Votes are limited to 60/hour/IP and reviews to 10/hour/IP. Rate limiting is only active when real Upstash credentials are configured.
