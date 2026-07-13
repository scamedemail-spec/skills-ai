import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Submit a skill — skills.ai',
  description: 'Submit a Claude skill to the skills.ai library.',
};

const SUBMIT_FORM_URL = 'https://forms.gle/iPJmc3JC1MbMk3zw7';

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-[480px] px-6 pb-24 pt-12 md:pt-20 text-center">
      <h1 className="font-serif text-[32px] font-medium leading-tight tracking-[-0.02em]">
        Submit a skill
      </h1>
      <p className="mt-3 text-ink-muted">
        I review every submission personally. Verified skills get added to the
        library within a week.
      </p>

      <a
        href={SUBMIT_FORM_URL}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary mt-8 inline-flex"
      >
        Submit a skill
      </a>

      <p className="mt-4 text-[13px] text-ink-faint">
        Opens in a new tab. By submitting, you agree to our{' '}
        <Link href="/contribute" className="text-accent underline hover:text-accent-hover">
          Contributor Terms
        </Link>
        .
      </p>
    </div>
  );
}
