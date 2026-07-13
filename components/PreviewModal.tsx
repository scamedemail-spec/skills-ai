'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { FileNode, SkillManifestEntry, SkillSummary } from '@/lib/types';
import { copyText, installCommand } from '@/lib/install';
import FileTree from './FileTree';
import FileViewer from './FileViewer';
import CommunityPanel from './CommunityPanel';
import { CloseIcon, DownloadArrowIcon, VerifiedIcon } from './icons';

type ModalView = 'preview' | 'reviews';

interface PreviewModalProps {
  skill: SkillSummary;
  /** Full manifest entry with file tree; null while the manifest is loading. */
  entry: SkillManifestEntry | null;
  count: number;
  onDownload: () => void;
  onCopyInstall: () => void;
  onClose: () => void;
}

function flattenFiles(nodes: FileNode[]): FileNode[] {
  return nodes.flatMap((n) => (n.type === 'dir' ? flattenFiles(n.children ?? []) : [n]));
}

export default function PreviewModal({
  skill,
  entry,
  count,
  onDownload,
  onCopyInstall,
  onClose,
}: PreviewModalProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [view, setView] = useState<ModalView>('preview');
  const [copied, setCopied] = useState(false);
  const [downloadNonce, setDownloadNonce] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();

  // Wrap the download so the reviews panel can refresh eligibility afterward.
  const handleDownload = useCallback(() => {
    onDownload();
    setDownloadNonce((n) => n + 1);
  }, [onDownload]);

  const files = useMemo(() => (entry ? flattenFiles(entry.fileTree) : []), [entry]);

  // Default selection: SKILL.md, else the first file.
  useEffect(() => {
    if (!entry || selectedPath) return;
    const skillMd = files.find((f) => f.name === 'SKILL.md');
    setSelectedPath((skillMd ?? files[0])?.path ?? null);
  }, [entry, files, selectedPath]);

  const selectedFile = files.find((f) => f.path === selectedPath) ?? null;

  // Esc closes; scroll-lock the page underneath while open.
  useEffect(() => {
    panelRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(installCommand(skill.slug));
    if (ok) {
      setCopied(true);
      onCopyInstall();
      setDownloadNonce((n) => n + 1); // refresh review eligibility, same as a real download
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    }
  }, [skill.slug, onCopyInstall]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${skill.name} preview`}
    >
      <div
        className="animate-fade-in absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="animate-fade-in relative flex h-[80vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-xl border border-line bg-bg-card outline-none md:w-[80vw]"
      >
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-bg-sidebar p-4">
          <div className="flex min-w-0 items-baseline sm:flex-1">
            <h2 className="text-[17px] font-medium text-ink sm:truncate">{skill.name}</h2>
            {skill.verified && (
              <span
                className="ml-1.5 shrink-0 self-center text-success"
                title="Verified by a human"
              >
                <VerifiedIcon />
                <span className="sr-only">Verified</span>
              </span>
            )}
            <span className="ml-2 hidden shrink-0 text-xs text-ink-faint sm:inline">
              by {skill.author}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="mr-1 hidden items-center gap-1 text-[13px] text-ink-muted tabular-nums sm:flex">
              <DownloadArrowIcon />
              {count.toLocaleString('en-US')}
            </span>
            <button type="button" className="btn btn-primary" onClick={handleDownload}>
              Download
            </button>
            <button
              type="button"
              className="btn btn-ghost hidden sm:inline-flex"
              onClick={handleCopy}
            >
              {copied ? 'Copied ✓' : 'Copy install'}
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              aria-label="Close preview"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        {/* View tabs */}
        <div className="flex shrink-0 gap-1 border-b border-line bg-bg-sidebar px-4">
          <TabButton active={view === 'preview'} onClick={() => setView('preview')}>
            Files
          </TabButton>
          <TabButton active={view === 'reviews'} onClick={() => setView('reviews')}>
            Reviews
          </TabButton>
        </div>

        {view === 'preview' ? (
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <aside className="pane-scroll max-h-44 shrink-0 overflow-y-auto border-b border-line bg-bg-sidebar md:max-h-none md:w-[30%] md:border-b-0 md:border-r">
              {entry ? (
                <FileTree
                  nodes={entry.fileTree}
                  selectedPath={selectedPath}
                  onSelect={setSelectedPath}
                />
              ) : (
                <p className="p-4 text-[13px] text-ink-muted">Loading files…</p>
              )}
            </aside>
            <section className="pane-scroll min-h-0 flex-1 overflow-y-auto bg-bg-card p-5">
              {entry ? (
                selectedFile ? (
                  <FileViewer file={selectedFile} />
                ) : (
                  <p className="text-ink-muted">Select a file to preview.</p>
                )
              ) : (
                <p className="text-ink-muted">Loading preview…</p>
              )}
            </section>
          </div>
        ) : (
          <section className="pane-scroll min-h-0 flex-1 overflow-y-auto bg-bg-card p-5">
            <CommunityPanel
              slug={skill.slug}
              downloadNonce={downloadNonce}
              onDownload={handleDownload}
            />
          </section>
        )}
      </div>
    </div>,
    document.body,
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      role="tab"
      className={`-mb-px border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
        active
          ? 'border-accent text-ink'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
