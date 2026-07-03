'use client';

import { useEffect, useRef, useState } from 'react';
import type { SkillSummary } from '@/lib/types';
import { copyText, installCommand } from '@/lib/install';
import { DownloadArrowIcon, VerifiedIcon } from './icons';

interface SkillCardProps {
  skill: SkillSummary;
  count: number;
  onOpen: () => void;
  onDownload: () => void;
}

export default function SkillCard({ skill, count, onOpen, onDownload }: SkillCardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyText(installCommand(skill.slug));
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Preview ${skill.name}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="cursor-pointer rounded-lg border border-line bg-bg-card p-5 transition-colors duration-150 hover:bg-bg-card-hover"
    >
      <div className="flex items-baseline">
        <h3 className="truncate text-[16px] font-medium text-ink">{skill.name}</h3>
        {skill.verified && (
          <span className="ml-1.5 shrink-0 self-center text-success" title="Verified by a human">
            <VerifiedIcon />
            <span className="sr-only">Verified</span>
          </span>
        )}
        <span className="ml-2 shrink-0 text-xs text-ink-faint">by {skill.author}</span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-normal text-ink-muted">
        {skill.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span
          className="flex items-center gap-1 text-[13px] text-ink-muted tabular-nums"
          title={`${count.toLocaleString('en-US')} downloads`}
        >
          <DownloadArrowIcon />
          {count.toLocaleString('en-US')}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
          >
            Download
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleCopy}>
            {copied ? 'Copied ✓' : 'Copy install'}
          </button>
        </div>
      </div>
    </article>
  );
}
