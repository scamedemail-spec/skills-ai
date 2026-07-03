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

## Deploying

1. Push this repo to GitHub.
2. In Vercel, **Add New Project** → import the repo → deploy (no build config changes needed).
3. Add the environment variables above in Project Settings → Environment Variables, then redeploy.
4. The daily snapshot cron (`vercel.json`) activates automatically on the Hobby plan.

## Rate limiting & bot filtering

`/api/skills/[slug]/download` counts at most 3 downloads per `{ip, slug}` per hour (sliding window) and skips counting entirely for requests matching common bot/crawler/link-preview user agents — in both cases the file still gets served, only the counter is skipped.
