'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitFormGate({ url }: { url: string }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      <div className="rounded-lg border border-line bg-bg-card p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-accent"
          />
          <span className="text-sm text-ink-muted">
            <span className="font-bold text-ink">Contributor Terms (required).</span>{' '}
            By submitting, you grant Skills.ai a perpetual, worldwide, royalty-free
            license to host and distribute this skill and confirm you have the right
            to grant it.{' '}
            <Link
              href="/contribute"
              className="text-accent underline hover:text-accent-hover"
            >
              Read the full Contributor Terms
            </Link>
            <br />
            <span className="mt-1 inline-block">
              I have read and agree to the Skills.ai Contributor Terms.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-8">
        {agreed ? (
          <iframe
            src={url}
            title="Skill submission form"
            className="h-[1000px] w-full rounded-lg border border-line bg-bg-card"
          >
            Loading…
          </iframe>
        ) : (
          <div className="rounded-lg border border-dashed border-line-strong bg-bg-card p-8 text-center">
            <p className="text-sm text-ink-muted">
              Check the box above to unlock the submission form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
