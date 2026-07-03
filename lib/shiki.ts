import type { HighlighterCore } from 'shiki/core';

// Everything shiki-related is imported dynamically so it stays out of the
// initial bundle — it loads the first time a preview modal renders a file.
let highlighterPromise: Promise<HighlighterCore> | null = null;

function load(): Promise<HighlighterCore> {
  return Promise.all([
    import('shiki/core'),
    import('shiki/engine/oniguruma'),
  ]).then(([{ createHighlighterCore }, { createOnigurumaEngine }]) =>
    createHighlighterCore({
      themes: [import('shiki/themes/github-dark-dimmed.mjs')],
      langs: [
        import('shiki/langs/markdown.mjs'),
        import('shiki/langs/yaml.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/javascript.mjs'),
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/python.mjs'),
        import('shiki/langs/sql.mjs'),
        import('shiki/langs/csv.mjs'),
      ],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    }),
  );
}

export function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= load();
  return highlighterPromise;
}

const EXT_TO_LANG: Record<string, string> = {
  md: 'markdown',
  markdown: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  json: 'json',
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  py: 'python',
};

export function langForFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_LANG[ext] ?? 'text';
}

/** Highlight `code`; unknown languages fall back to plaintext. */
export async function highlight(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  const known = new Set(highlighter.getLoadedLanguages());
  const resolved = known.has(lang) ? lang : 'text';
  return highlighter.codeToHtml(code, { lang: resolved, theme: 'github-dark-dimmed' });
}
