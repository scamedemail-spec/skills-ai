import fs from 'node:fs/promises';
import path from 'node:path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata = {
  title: 'Contributor Terms — Skills.ai',
  description: 'Terms for submitting a skill to Skills.ai.',
};

export default async function ContributePage() {
  const source = await fs.readFile(
    path.join(process.cwd(), 'content/legal/contributor-terms.md'),
    'utf8',
  );
  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-6 py-16">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </article>
  );
}
