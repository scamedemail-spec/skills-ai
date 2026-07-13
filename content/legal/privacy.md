# Privacy Policy

**Effective date:** July 12, 2026
**Last updated:** July 12, 2026

This Privacy Policy explains how skills.ai ("we," "us," "our," or the "Service"), operated by **Lucian Singer**, an individual doing business as "Skills.ai" (not a registered entity) ("Operator"), collects, uses, discloses, and safeguards information when you visit or use https://skills-ai-three.vercel.app or any successor domain (the "Site").

By using the Site you agree to the practices described here. If you do not agree, do not use the Site.

For any privacy question or request, email **SingerSteinai@gmail.com**.

---

## 1. Summary — the short version

- We collect very little. No user accounts. No passwords. No payments.
- The waitlist form collects your first name, last name, and phone number.
- When you download a skill, we log an anonymous event (IP address, browser user-agent, referring page, timestamp) for anti-abuse and analytics.
- Your browser stores a random anonymous ID in localStorage so votes and reviews can be tied to a verified download without an account. This ID is not tied to your identity.
- We don't sell your data. We don't run ads. We don't share data with advertisers, brokers, or affiliates.
- Data is stored on Upstash (Redis) and Vercel (hosting), both US-based providers with encryption at rest and in transit.
- You can request access to or deletion of your data at any time by emailing us.

The rest of this policy is the detailed version.

---

## 2. Who we are

The Site is operated by Lucian Singer, an individual sole proprietor located in Los Angeles, California, United States.

The Site is not affiliated with, sponsored by, or endorsed by Anthropic PBC. "Claude" is a trademark of Anthropic PBC and is used only to describe compatibility.

For all privacy inquiries, contact: **SingerSteinai@gmail.com**.

---

## 3. Information we collect

### 3.1 Information you provide to us

**Waitlist form.** When you join our waitlist, we collect:
- First name
- Last name
- Phone number
- The timestamp of your submission

**Skill submissions.** When you submit a skill through the /submit page, we collect:
- Whatever information you type into the Google Form (typically: your name, contact email, skill name, skill description, and the skill files)
- The Google Form is operated by Google LLC; their privacy policy applies to that submission in addition to ours

**Reviews.** If you write a review of a skill, we collect:
- Your review text and star rating
- The optional display name you provide
- Your anonymous voter ID (see §3.3)
- The timestamp of the review

### 3.2 Information collected automatically

**Download telemetry.** Every counted skill download creates an event record containing:
- Your IP address (used for rate limiting and de-duplication; never displayed publicly)
- Your browser's user-agent string
- The referring URL (if your browser sent one)
- The timestamp
- The skill slug you downloaded

We retain the most recent 1,000 events per skill; older events roll off automatically.

**Rate-limiting.** To prevent abuse we temporarily track request counts per IP address per endpoint (downloads, votes, reviews, waitlist signups). These rate-limit records are automatically discarded within one hour.

**Aggregate counters.** We keep running totals of downloads per skill and site-wide, and a nightly snapshot of totals for trend analysis. These counters do not identify individuals.

### 3.3 Anonymous voter ID (browser localStorage)

To let users vote and review skills they've downloaded — without requiring accounts — your browser generates a random string ("voter ID") the first time you interact with the Site. This ID:
- Is stored in your browser's localStorage on your device
- Is included in vote and review requests so we can check you've actually downloaded the skill
- Is not linked to your name, email, phone, or any other identifier
- Is not a cookie and is not shared with third parties
- Can be cleared at any time by clearing your browser storage for the Site

### 3.4 Information we do NOT collect

- We do not collect email addresses (except in Google Form submissions or if you email us).
- We do not collect payment or credit-card information.
- We do not collect location data beyond what an IP address implies.
- We do not collect device fingerprints, canvas fingerprints, or other tracking identifiers.
- We do not run third-party analytics, advertising, or social-media pixels.
- We do not knowingly collect information from children under 13 (see §11).

---

## 4. How we use the information

We use the information we collect only for the following purposes:

- **To operate the Site.** Serve pages, deliver skill downloads, count downloads, display community stats, and gate voting/reviewing behind verified downloads.
- **To communicate with you about the waitlist.** If you join the waitlist we may contact you at the phone number you provided when the product you signed up for becomes available. We will not text you for marketing or share your number with anyone.
- **To prevent abuse.** Rate limiting, bot detection, and de-duplication use IP addresses and user-agents to protect the Site from scraping, spam, and denial-of-service attempts.
- **To improve the Site.** Aggregate counters and daily snapshots inform which skills are popular and which need improvement.
- **To comply with law.** We may retain or disclose information as required by court order, subpoena, or applicable law (see §8).

We do NOT use your information to:
- Sell to data brokers or advertisers
- Serve ads or personalize advertising
- Build behavioral profiles for marketing
- Train machine-learning models

---

## 5. Legal basis for processing (GDPR / UK GDPR)

If you are in the European Economic Area, the United Kingdom, or Switzerland, we process your personal data on the following legal bases under Article 6 GDPR:

- **Consent (Art. 6(1)(a)).** Waitlist signups and skill submissions are processed based on your consent, which you give by submitting the form. You may withdraw consent at any time by emailing us to delete your entry.
- **Legitimate interests (Art. 6(1)(f)).** Rate-limiting, bot detection, and aggregate download counters are processed under our legitimate interest in operating a functional, non-abused website. We have assessed that this processing is minimal, necessary, and does not override your fundamental rights.
- **Legal obligation (Art. 6(1)(c)).** In the rare case a legal request applies, we retain and disclose only as legally required.

We do not engage in automated decision-making with legal or similarly significant effects.

---

## 6. Data retention

- **Waitlist entries** (name, phone): retained until you request deletion, or until we cease operating the waitlist, whichever comes first.
- **Download event logs** (IP, UA, referer, timestamp): most recent 1,000 events per skill; older events are automatically discarded.
- **Rate-limit records**: automatically discarded within 1 hour.
- **Aggregate counters and daily snapshots**: retained indefinitely; do not identify individuals.
- **Reviews**: retained as long as the skill is listed on the Site, or until you request deletion.
- **Anonymous voter ID** on your device: retained by your browser until you clear its storage.
- **Skill submissions via Google Form**: retained according to Google Forms defaults and your Google Workspace settings; contact us to have your submission removed from our review list.

---

## 7. Third-party service providers (processors)

We use the following third-party services to operate the Site. Each is a "processor" under GDPR — they process personal data only on our instructions.

| Provider | Purpose | Data shared | Location | Privacy policy |
| --- | --- | --- | --- | --- |
| **Vercel Inc.** | Web hosting and edge network | All request data (IP, headers, request path) | United States | https://vercel.com/legal/privacy-policy |
| **Upstash, Inc.** | Serverless Redis database (waitlist, counters, events) | Waitlist entries, download events, aggregate counters | United States (multi-region) | https://upstash.com/trust/privacy.pdf |
| **Google LLC (Google Forms)** | Skill submission form on /submit | Whatever you enter into the submission form | Global | https://policies.google.com/privacy |
| **Google LLC (Google Fonts)** | Web fonts (self-hosted at build time; no runtime call to Google) | None at runtime | N/A | N/A |

We do not use analytics providers, advertising networks, or session-replay tools.

---

## 8. Disclosure of information

We disclose personal information only in these limited circumstances:

- **To processors listed in §7**, to the minimum extent needed to operate the Site.
- **To comply with legal process**, such as a valid court order, subpoena, or governmental request. Where legally permissible, we will notify you before disclosure.
- **To enforce our Terms of Service**, protect our legal rights, or prevent fraud, abuse, or harm.
- **In a business transaction.** If we merge, sell assets, or reorganize, personal information may transfer as part of that transaction; you will be notified before any change in Operator or material change in use.

We do NOT sell personal information within the meaning of the California Consumer Privacy Act (CCPA), and we do not share personal information for cross-context behavioral advertising.

---

## 9. International data transfers

Our processors are primarily located in the United States. If you access the Site from outside the United States, your information will be transferred to and processed in the United States.

For transfers of personal data from the EEA, UK, or Switzerland to the US, we rely on:
- The recipient's adherence to the EU-US Data Privacy Framework where applicable, or
- Standard Contractual Clauses (SCCs) approved by the European Commission, or
- Your explicit consent to the transfer.

By using the Site or joining the waitlist, you consent to the transfer of your information to the United States.

---

## 10. Your rights

Depending on where you live, you have some or all of the following rights regarding your personal information.

### 10.1 For everyone

- **Access.** Request a copy of the personal data we hold about you.
- **Correction.** Request that inaccurate data be fixed.
- **Deletion.** Request that we delete your personal data.

To exercise any of these rights, email **SingerSteinai@gmail.com**. We will respond within 30 days.

We may need to verify your identity before responding, typically by asking you to confirm the phone number or email associated with your submission.

### 10.2 Additional rights under GDPR / UK GDPR

If you are in the EEA, UK, or Switzerland, you also have:

- **Right to portability.** Receive your data in a machine-readable format.
- **Right to restriction of processing.** Ask us to pause processing while a dispute is resolved.
- **Right to object.** Object to processing based on legitimate interests.
- **Right to withdraw consent.** Where processing is based on consent, withdraw it at any time (this does not affect prior lawful processing).
- **Right to lodge a complaint** with your local supervisory authority. A list is available at https://edpb.europa.eu/about-edpb/board/members_en. UK residents may complain to the ICO at https://ico.org.uk.

### 10.3 Additional rights under California law (CCPA / CPRA)

If you are a California resident:

- **Right to know.** Request the categories and specific pieces of personal information we've collected about you, the sources, the business purposes, and the categories of third parties we share it with.
- **Right to delete.** Request deletion of personal information we've collected, subject to limited exceptions.
- **Right to correct** inaccurate personal information.
- **Right to opt out of sale or sharing.** We do not sell or share personal information; there is nothing to opt out of.
- **Right to non-discrimination.** We will not discriminate against you for exercising any of these rights.

To submit a request, email **SingerSteinai@gmail.com** with subject line "California Privacy Request."

**Categories of personal information collected in the last 12 months (CCPA §1798.100/110):**
- Identifiers (name, phone number, IP address, anonymous voter ID)
- Internet or other electronic network activity information (referring URL, user-agent)
- No: biometric, geolocation, sensory, professional, education, or inferences data

### 10.4 Additional rights under other US state laws

If you are a resident of Colorado, Connecticut, Utah, Virginia, or another US state with a comprehensive privacy law, you have rights substantially similar to those in §10.3. Email **SingerSteinai@gmail.com** to exercise them.

---

## 11. Children's privacy

The Site is not directed to children under 13, and we do not knowingly collect personal information from children under 13.

If you are a parent or guardian and believe your child has provided personal information to us, contact **SingerSteinai@gmail.com** and we will delete it promptly.

We do not condition access on age verification because the Site is intended for adult developers evaluating Claude-compatible tools.

---

## 12. Cookies and similar technologies

We do not set any HTTP cookies.

We use browser **localStorage** to store one item: an anonymous, randomly generated voter ID (see §3.3). This is used only for the functional purpose of tying votes and reviews to verified downloads. It is not a tracking identifier, is not shared with third parties, and is not classified as a cookie under EU ePrivacy rules.

You can clear this storage at any time by clearing site data in your browser. Doing so will require you to re-verify a download before voting or reviewing.

---

## 13. Security

We use industry-standard measures to protect information:

- **Encryption in transit.** All Site traffic uses HTTPS with HSTS enforced (`max-age=63072000; includeSubDomains; preload`).
- **Encryption at rest.** Upstash encrypts stored data with AES-256.
- **Access controls.** The admin interface is gated by HTTP Basic Auth over HTTPS; only the Operator holds credentials.
- **Rate limiting.** Public endpoints are rate-limited to prevent abuse.
- **Minimal data.** We collect only what is necessary and delete or expire it as described in §6.

No method of transmission or storage is 100% secure. If we ever learn of a data breach affecting your personal information, we will notify you as required by applicable law.

---

## 14. Do Not Track

Our Site does not respond to Do Not Track (DNT) browser signals because we do not track users across the web. All processing described here is first-party and functional.

We honor the Global Privacy Control (GPC) signal where legally required: receiving GPC counts as a request to opt out of sale/sharing of personal information. Because we do not sell or share personal information, GPC signals do not change our processing.

---

## 15. Third-party links

The Site contains links to third-party sites, including GitHub repositories and Google Forms. We are not responsible for the privacy practices or content of those sites. Review their privacy policies before providing information.

---

## 16. Changes to this Privacy Policy

We may update this Privacy Policy from time to time. When we do:

- The "Last updated" date at the top will change.
- If changes are material, we will provide additional notice — either by prominent notice on the Site or (for waitlist members) by contacting you at the phone number you provided.

Your continued use of the Site after changes take effect constitutes acceptance of the revised Policy.

---

## 17. Contact

For any privacy question, data-subject request, complaint, or breach notification, contact:

**Email:** SingerSteinai@gmail.com

**Postal:** Los Angeles, California, United States (full mailing address available on request for verified legal or regulatory inquiries)

**Response time:** we aim to respond within 5 business days and to complete verified requests within 30 days.

---

## 18. Governing law

This Privacy Policy is governed by the laws of the State of California, United States, without regard to conflict-of-law principles. This does not affect any rights you have under mandatory local law in your jurisdiction.

---

*This Privacy Policy is provided as a good-faith description of our practices as of the effective date. It is not legal advice. For personalized guidance, consult a qualified attorney.*
