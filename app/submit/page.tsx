import type { Metadata } from 'next';
import SubmitFormGate from '@/components/SubmitFormGate';

export const metadata: Metadata = {
  title: 'Submit a skill — skills.ai',
  description: 'Submit a Claude skill to the skills.ai library.',
};

// Replace with your Google Form embed URL from Google Forms → Send → <> (embed
// HTML) — it looks like https://docs.google.com/forms/d/e/…/viewform?embedded=true
const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScFbuoRkc68N6ICUHnMNth6PVVbMJe66LZVnsHlR7qkvWpnrQ/viewform?embedded=true';

export default function SubmitPage() {
  const formConfigured = GOOGLE_FORM_EMBED_URL.startsWith('https://');

  return (
    <div className="mx-auto max-w-[480px] px-6 pb-24 pt-12 md:pt-20">
      <h1 className="font-serif text-[32px] font-medium leading-tight tracking-[-0.02em]">
        Submit a skill
      </h1>
      <p className="mt-3 text-ink-muted">
        I review every submission personally. Verified skills get added to the
        library within a week.
      </p>

      <div className="mt-8">
        {formConfigured ? (
          <SubmitFormGate url={GOOGLE_FORM_EMBED_URL} />
        ) : (
          <div className="rounded-lg border border-dashed border-line-strong bg-bg-card p-8 text-center">
            <p className="text-sm text-ink-muted">
              The submission form is not wired up yet.
            </p>
            <p className="mt-2 text-[13px] text-ink-faint">
              Create a Google Form, then paste its embed URL into{' '}
              <code className="font-mono text-xs">app/submit/page.tsx</code>{' '}
              (Google Forms → Send → embed HTML).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
