'use client';

import type { FileNode } from '@/lib/types';
import { CodeView } from './CodeView';
import MarkdownView, { stripFrontmatter } from './MarkdownView';

export default function FileViewer({ file }: { file: FileNode }) {
  if (file.content === null || file.content === undefined) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center text-ink-muted">
        Binary file — preview not available
      </div>
    );
  }

  if (/\.(md|markdown)$/i.test(file.name)) {
    return <MarkdownView source={stripFrontmatter(file.content)} />;
  }

  return <CodeView code={file.content} filename={file.name} />;
}
