'use client';

import { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeView';

/** Drop YAML frontmatter — the modal header already shows that metadata. */
export function stripFrontmatter(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

export default function MarkdownView({ source }: { source: string }) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Fenced code blocks arrive as <pre><code class="language-x">.
          // Replace the whole <pre> with a shiki-highlighted block.
          pre({ children }) {
            const child = Array.isArray(children) ? children[0] : children;
            if (isValidElement(child)) {
              const props = child.props as { className?: string; children?: unknown };
              const match = /language-([\w-]+)/.exec(props.className ?? '');
              const code = String(props.children ?? '').replace(/\n$/, '');
              return <CodeBlock code={code} lang={match?.[1] ?? 'text'} />;
            }
            return <pre>{children}</pre>;
          },
          // Anything still hitting `code` directly is inline code.
          code({ children }) {
            return <code className="inline-code">{children}</code>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
