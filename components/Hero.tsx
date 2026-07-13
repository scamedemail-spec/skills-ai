'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetch('/api/stats/total', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (alive && d && typeof d.total === 'number') setTotal(d.total);
        })
        .catch(() => {
          /* counter is decorative — never surface fetch errors */
        });
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="flex min-h-[55vh] items-center px-6 py-12 md:py-20">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
        <h1 className="max-w-[780px] font-serif text-[32px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[48px]">
          The best skills, all in one place, verified and ready to download.
        </h1>
        <p className="mt-5 max-w-[560px] text-[17px] text-ink-muted">
          A curated library of Claude skills. Verified by a human. One click to
          install.
        </p>
        <div className="mt-12">
          <div className="font-serif text-[56px] leading-none text-accent tabular-nums">
            {(total ?? 0).toLocaleString('en-US')}
          </div>
          <div className="mt-2 text-[13px] text-ink-muted">Total Skills Downloaded</div>
        </div>
      </div>
    </section>
  );
}
