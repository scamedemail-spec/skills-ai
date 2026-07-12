import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - skills.ai',
  description: 'Rules for using skills.ai and downloading Claude-compatible skills.',
};

const contactEmail = 'SingerSteinai@gmail.com';

export default function TermsPage() {
  return (
    <section className="px-6 py-12 md:py-16">
      <article className="md-body mx-auto max-w-[780px]">
        <h1>Terms of Service</h1>
        <p>
          <strong>Effective date:</strong> July 12, 2026
          <br />
          <strong>Last updated:</strong> July 12, 2026
        </p>
        <p>
          These Terms govern your use of skills.ai, operated by Lucian Singer as an individual sole
          proprietor. By using the Site, downloading skills, submitting content, or joining the
          waitlist, you agree to these Terms.
        </p>

        <h2>No affiliation with Anthropic</h2>
        <p>
          skills.ai is not affiliated with, sponsored by, or endorsed by Anthropic PBC. Claude is a
          trademark of Anthropic PBC and is used only to describe compatibility.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You may use the Site for lawful personal, educational, and commercial evaluation of listed
          skills. You may not interfere with the Site, bypass rate limits, scrape abusively, upload
          malicious files, submit unlawful content, impersonate others, or use the Site in a way that
          violates applicable law or third-party rights.
        </p>

        <h2>Skill downloads, licensing, and attribution</h2>
        <p>
          Skills are provided for convenience as downloadable files. Unless a skill includes a
          separate license file or attribution notice, you may use it for your own Claude-compatible
          workflow, but you may not remove attribution, claim another creator&apos;s work as your own, or
          redistribute a skill in a misleading way. If a skill includes its own license, that license
          controls your use of that skill.
        </p>

        <h2>Submissions and reviews</h2>
        <p>
          If you submit a skill, review, rating, name, or other content, you represent that you have
          the rights needed to submit it and that it does not violate law or third-party rights. You
          grant us a non-exclusive, worldwide, royalty-free license to host, display, reproduce, and
          distribute submitted content for operating and promoting the Site. We may remove or decline
          submissions at any time.
        </p>

        <h2>No professional advice</h2>
        <p>
          The Site and skills are informational tools. They are not legal, financial, medical, tax,
          academic-integrity, or other professional advice. You are responsible for reviewing outputs
          and complying with the rules that apply to your use case.
        </p>

        <h2>Disclaimers</h2>
        <p>
          The Site and all skills are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any
          kind, express or implied, including implied warranties of merchantability, fitness for a
          particular purpose, non-infringement, availability, accuracy, or security.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, we will not be liable for indirect, incidental,
          special, consequential, exemplary, or punitive damages, or for lost profits, data, goodwill,
          or business interruption arising from your use of the Site or skills.
        </p>

        <h2>Privacy</h2>
        <p>
          Our <a href="/privacy">Privacy Policy</a> explains how we collect, use, and delete data.
        </p>

        <h2>Changes and termination</h2>
        <p>
          We may change, suspend, or discontinue the Site at any time. We may update these Terms by
          posting a revised version here. Your continued use after changes means you accept the
          updated Terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of California, without regard to conflict-of-law
          rules. Venue for disputes will be in the state or federal courts located in Los Angeles
          County, California, unless applicable law requires otherwise.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms can be sent to{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </article>
    </section>
  );
}
