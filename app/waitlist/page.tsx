import type { Metadata } from 'next';
import WaitlistForm from '@/components/WaitlistForm';

export const metadata: Metadata = {
  title: 'Join the waitlist — skills.ai',
  description: 'Get notified about new Claude skills and features before anyone else.',
};

export default function WaitlistPage() {
  return (
    <section className="flex min-h-[60vh] items-center px-6 py-12 md:py-20">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
        <h1 className="max-w-[700px] font-serif text-[32px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[48px]">
          Be first to know what&rsquo;s next.
        </h1>
        <p className="mt-5 max-w-[520px] text-[17px] text-ink-muted">
          Join the waitlist and we&rsquo;ll text you when new skills and features drop.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}
