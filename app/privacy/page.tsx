import type { Metadata } from 'next';
import DeleteWaitlistDataForm from '@/components/DeleteWaitlistDataForm';

export const metadata: Metadata = {
  title: 'Privacy Policy - skills.ai',
  description: 'How skills.ai collects, uses, and deletes data.',
};

const contactEmail = 'SingerSteinai@gmail.com';

export default function PrivacyPage() {
  return (
    <section className="px-6 py-12 md:py-16">
      <article className="md-body mx-auto max-w-[780px]">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective date:</strong> July 12, 2026
          <br />
          <strong>Last updated:</strong> July 12, 2026
        </p>
        <p>
          This Privacy Policy explains how skills.ai, operated by Lucian Singer as an individual
          sole proprietor, collects, uses, discloses, and safeguards information when you use
          https://skills-ai-three.vercel.app or any successor domain.
        </p>
        <p>
          For any privacy question, access request, correction request, or deletion request, email{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <h2>Summary</h2>
        <ul>
          <li>We collect no account passwords, no payment details, and no advertising data.</li>
          <li>The waitlist form collects first name, last name, phone number, and timestamp.</li>
          <li>
            Skill downloads create limited telemetry: IP address, user-agent, referring page,
            timestamp, source, and skill slug.
          </li>
          <li>
            Your browser stores a random anonymous voter ID in localStorage so votes and reviews can
            be tied to a verified download without an account.
          </li>
          <li>We do not sell personal information or share it for cross-context behavioral ads.</li>
        </ul>

        <h2>Information we collect</h2>
        <h3>Information you provide</h3>
        <p>
          When you join the waitlist, we collect your first name, last name, phone number, and
          submission timestamp. When you submit a skill through the submit page, Google Forms
          collects the information and files you provide. When you review a skill, we collect your
          rating, optional display name, review text, anonymous voter ID, and timestamp.
        </p>

        <h3>Information collected automatically</h3>
        <p>
          Download telemetry records your IP address, user-agent, referring URL if provided,
          timestamp, source, and skill slug. We retain the most recent 1,000 download events per
          skill. Rate-limit records are used to prevent abuse and are discarded automatically within
          one hour. Aggregate download counters and daily snapshots are retained for trend analysis.
        </p>

        <h3>Anonymous voter ID and localStorage</h3>
        <p>
          The Site uses browser localStorage to store one anonymous random voter ID. It is used only
          to confirm that votes and reviews come after a verified skill download. It is not linked to
          your name, phone number, email address, or other identity details, and you can clear it by
          clearing site data in your browser.
        </p>

        <h2>How we use information</h2>
        <p>
          We use information to operate the Site, deliver downloads, count downloads, display
          community stats, verify votes and reviews, respond to waitlist interest, prevent abuse,
          improve the service using aggregate data, and comply with law.
        </p>
        <p>
          We do not use personal information to sell data, serve ads, build behavioral profiles, or
          train machine-learning models.
        </p>

        <h2>Retention</h2>
        <ul>
          <li>Waitlist entries are retained until deletion is requested or the waitlist closes.</li>
          <li>Download event logs retain the most recent 1,000 events per skill.</li>
          <li>Rate-limit records expire within one hour.</li>
          <li>Aggregate counters and snapshots may be retained indefinitely.</li>
          <li>Reviews are retained while the skill is listed or until deletion is requested.</li>
          <li>Anonymous voter IDs remain in your browser until you clear site storage.</li>
        </ul>

        <h2>Third-party providers</h2>
        <p>We use Vercel for hosting, Upstash Redis for waitlist/counter/event storage, and Google Forms for skill submissions. Google Fonts are self-hosted at build time through Next.js, so there is no runtime Google Fonts request from the browser.</p>

        <h2>Disclosures</h2>
        <p>
          We disclose personal information only to the providers needed to operate the Site, to
          comply with valid legal process, to enforce our Terms, to prevent abuse, or as part of a
          business transaction with notice before any material change in use.
        </p>

        <h2>Your rights</h2>
        <p>
          You may request access, correction, deletion, or portability of personal information by
          emailing <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We respond within 30 days
          and may need to verify your identity, typically by confirming the phone number or email
          associated with your request.
        </p>
        <p>
          California residents may also request categories and specific pieces of personal
          information collected, deletion, correction, and non-discrimination for exercising privacy
          rights. We do not sell or share personal information, so there is nothing to opt out of.
        </p>

        <h2 id="deletion">Delete waitlist data</h2>
        <p>
          Submit the phone number you used for the waitlist, or email{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We delete matching waitlist data
          within 30 days; this form removes matching waitlist records immediately when the database
          is available.
        </p>
        <DeleteWaitlistDataForm />

        <h2>Children&apos;s privacy</h2>
        <p>
          The Site is not directed to children under 13, and we do not knowingly collect personal
          information from children under 13. If you believe a child provided information, contact us
          and we will delete it promptly.
        </p>

        <h2>Security</h2>
        <p>
          We use HTTPS, HSTS, provider encryption at rest, admin access controls, rate limiting, and
          data minimization. No transmission or storage method is 100% secure; if we learn of a data
          breach affecting personal information, we will notify users as required by law.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy as the Site changes. The updated version will be posted here with
          a new last-updated date.
        </p>
      </article>
    </section>
  );
}
