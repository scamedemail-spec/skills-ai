'use client';

import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SkillManifestEntry, SkillSummary } from '@/lib/types';
import PreviewModal from './PreviewModal';
import SkillCard from './SkillCard';
import { SearchIcon } from './icons';
import { getVoterId, markDownloaded } from '@/lib/voter';

export default function Library({ skills }: { skills: SkillSummary[] }) {
  const [query, setQuery] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number } | null>>({});
  const [bumps, setBumps] = useState<Record<string, number>>({});
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [manifest, setManifest] = useState<Record<string, SkillManifestEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // One batched request for every card's download count and net vote score
  // (a few Redis MGETs server-side, edge-cached — far under the free quota).
  useEffect(() => {
    // Bypass the browser cache so cards reflect current data on every load; the
    // CDN still absorbs load via the endpoint's s-maxage header.
    fetch('/api/stats/counts', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.counts) setCounts(d.counts);
        if (d?.scores) setScores(d.scores);
        if (d?.ratings) setRatings(d.ratings);
      })
      .catch(() => {
        /* counts are decorative */
      });
  }, []);

  // ⌘K / Ctrl+K focuses the search input from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(skills, {
        keys: ['name', 'description', 'author'],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [skills],
  );

  const countFor = useCallback(
    (slug: string) => (counts[slug] ?? 0) + (bumps[slug] ?? 0),
    [counts, bumps],
  );

  // Pinned skills always lead; after that, most-downloaded first when
  // browsing. A search query switches to Fuse's relevance order instead,
  // since that's more useful once you're looking for something specific.
  const byPopularity = useMemo(
    () =>
      [...skills].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return countFor(b.slug) - countFor(a.slug);
      }),
    [skills, countFor],
  );

  const trimmed = query.trim();
  const visible = trimmed ? fuse.search(trimmed).map((r) => r.item) : byPopularity;

  // The full manifest (file trees + contents) is fetched once, lazily, the
  // first time any preview opens — it never blocks initial page load.
  const loadManifest = useCallback(() => {
    if (manifest) return;
    fetch('/skills-manifest.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((arr: SkillManifestEntry[]) => {
        setManifest(Object.fromEntries(arr.map((s) => [s.slug, s])));
      })
      .catch(() => {
        /* modal shows its loading state; a retry happens on next open */
      });
  }, [manifest]);

  const download = useCallback((slug: string) => {
    // Hidden anchor → follows the 302 to the zip; Content-Disposition makes
    // the browser download in place instead of navigating. The voter id lets
    // the server mark this browser as a verified downloader (review eligibility).
    const vid = getVoterId();
    const a = document.createElement('a');
    a.href = `/api/skills/${slug}/download?src=web&vid=${encodeURIComponent(vid)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    markDownloaded(slug);
    setBumps((b) => ({ ...b, [slug]: (b[slug] ?? 0) + 1 }));
  }, []);

  const recordCopyInstall = useCallback((slug: string) => {
    // "Copy install" is a legitimate way to get the skill (the user runs the
    // copied curl command themselves later), so it counts the same as a
    // browser download and grants the same review eligibility — just without
    // triggering an in-browser file save. `redirect: 'manual'` stops fetch
    // from following the 302 and pulling the zip bytes; all the counting/
    // eligibility side effects already ran server-side before that redirect.
    const vid = getVoterId();
    fetch(`/api/skills/${slug}/download?src=cli&vid=${encodeURIComponent(vid)}`, {
      redirect: 'manual',
    }).catch(() => {
      /* best-effort — the copy itself already succeeded regardless */
    });
    markDownloaded(slug);
    setBumps((b) => ({ ...b, [slug]: (b[slug] ?? 0) + 1 }));
  }, []);

  const openSkill = openSlug ? skills.find((s) => s.slug === openSlug) ?? null : null;

  return (
    <section id="library" className="scroll-mt-14 px-6 pb-12 md:pb-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="sticky top-14 z-30 -mx-1 bg-bg px-1 py-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${skills.length} skills…`}
              aria-label={`Search ${skills.length} skills`}
              className="search-input"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded bg-bg-sidebar px-1.5 py-0.5 font-sans text-xs text-ink-faint">
              ⌘K
            </kbd>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            {visible.map((skill) => (
              <SkillCard
                key={skill.slug}
                skill={skill}
                count={countFor(skill.slug)}
                score={scores[skill.slug] ?? 0}
                rating={ratings[skill.slug] ?? null}
                onOpen={() => {
                  setOpenSlug(skill.slug);
                  loadManifest();
                }}
                onDownload={() => download(skill.slug)}
                onCopyInstall={() => recordCopyInstall(skill.slug)}
              />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-ink-muted">
            No skills match “{trimmed}”. Try a different search.
          </p>
        )}
      </div>

      {openSkill && (
        <PreviewModal
          key={openSkill.slug}
          skill={openSkill}
          entry={manifest?.[openSkill.slug] ?? null}
          count={countFor(openSkill.slug)}
          onDownload={() => download(openSkill.slug)}
          onCopyInstall={() => recordCopyInstall(openSkill.slug)}
          onClose={() => setOpenSlug(null)}
        />
      )}
    </section>
  );
}
