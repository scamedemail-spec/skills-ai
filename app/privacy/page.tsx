import fs from 'node:fs/promises';
import path from 'node:path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata = {
  title: 'Privacy Policy — Skills.ai',
  description: 'How Skills.ai handles data.',
};

export default async function PrivacyPage() {
  const source = await fs.readFile(
    path.join(process.cwd(), 'content/legal/privacy.md'),
    'utf8',
  );
  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-6 py-16">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </article>
  );
}
