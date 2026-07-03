'use client';

import { useState } from 'react';
import type { FileNode } from '@/lib/types';
import { ChevronIcon, FileIcon, FolderIcon } from './icons';

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export default function FileTree({ nodes, selectedPath, onSelect }: FileTreeProps) {
  return (
    <ul role="tree" aria-label="Skill files" className="py-2">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const indent = { paddingLeft: 12 + depth * 16 };

  if (node.type === 'dir') {
    return (
      <li role="treeitem" aria-expanded={open} aria-selected={false}>
        <button
          type="button"
          style={indent}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-1.5 py-1.5 pr-3 text-left text-[13px] text-ink transition-colors duration-150 hover:bg-bg-card-hover"
        >
          <ChevronIcon
            className={`h-3 w-3 shrink-0 text-ink-faint transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
          />
          <FolderIcon className="h-4 w-4 shrink-0 text-ink-muted" />
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children && (
          <ul role="group">
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  const selected = node.path === selectedPath;
  return (
    <li role="treeitem" aria-selected={selected}>
      <button
        type="button"
        style={indent}
        onClick={() => onSelect(node.path)}
        className={`flex w-full items-center gap-1.5 py-1.5 pr-3 text-left text-[13px] transition-colors duration-150 ${
          selected
            ? 'bg-[var(--accent-faint)] text-ink shadow-[inset_2px_0_0_var(--accent)]'
            : 'text-ink hover:bg-bg-card-hover'
        }`}
      >
        {/* spacer aligns files with folder rows (chevron width + gap) */}
        <span className="h-3 w-3 shrink-0" aria-hidden="true" />
        <FileIcon className="h-4 w-4 shrink-0 text-ink-muted" />
        <span className="truncate">{node.name}</span>
      </button>
    </li>
  );
}
