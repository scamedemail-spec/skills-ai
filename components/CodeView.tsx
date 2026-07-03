'use client';

import { useEffect, useState } from 'react';
import { highlight, langForFilename } from '@/lib/shiki';

/** Full-file code view with line numbers (numbers rendered via CSS counters). */
export function CodeView({ code, filename }: { code: string; filename: string }) {
  const html = useHighlighted(code, langForFilename(filename));

  if (html === null) {
    return <pre className="code-plain">{code}</pre>;
  }
  return <div className="code-view" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Fenced code block inside rendered markdown. */
export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const html = useHighlighted(code, lang);

  if (html === null) {
    return (
      <div className="code-block">
        <pre className="code-plain !text-ink">{code}</pre>
      </div>
    );
  }
  return <div className="code-block" dangerouslySetInnerHTML={{ __html: html }} />;
}

function useHighlighted(code: string, lang: string): string | null {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setHtml(null);
    highlight(code, lang)
      .then((h) => {
        if (alive) setHtml(h);
      })
      .catch(() => {
        /* keep the plain-text fallback */
      });
    return () => {
      alive = false;
    };
  }, [code, lang]);

  return html;
}
