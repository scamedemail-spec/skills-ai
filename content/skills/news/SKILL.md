---
name: "News"
description: "Draws on a source universe of 250+ targets — wires and primary sources like Reuters, AP, Bloomberg, FT, Nature, NEJM, arXiv, whitehouse.gov, congress.gov, and FDA, plus X, Reddit, and HN — covering 12+ domains in one run, and every brief lists every source it actually used. Every claim ships with a concrete stat and a direct source link, so the output is something you can verify line by line, not just skim. Trigger with '/news', 'news brief', 'catch me up', 'weekly brief', 'what's happening'. NOT for stock picking."
author: "Curated"
verified: true
---

# News — Multi-Domain Frontier Brief

No cap on domains or source count — cover every domain with real signal, read as many sources as the week warrants. Spans social media/X to primary/reliable sources. Every claim ships with a concrete statistic — dollar amounts, percentages, dates, benchmarks, sample sizes.

## Conciseness rules
- No preamble, no restatement, no closing.
- Stories ranked within each domain. Each = 2-3 sentences, all stat-loaded.
- No adjectives without a number attached.
- "Quiet week in [domain]" is valid — never pad.
- No word cap — as long as every line carries signal, keep going.

## Reality check

News is oversupplied and noise-dominant. Filter aggressively. Signal density is the whole product.

## Invocation

- "/news"
- "News brief" / "catch me up" / "weekly brief"
- "What's happening this week?"
- "News on [specific window: past week, past month, since [date]]"

Default window: past 7 days. Longer windows on request.

---

## Domain coverage

**No cap.** Cover every domain that has real signal in the window. The 12 below are the always-check baseline; expand freely.

**Baseline 12 (always check, cover if signal exists):**
1. **Politics & Policy** — US legislative + executive + judicial + regulatory
2. **AI** — model releases, research, infra, safety, adoption
3. **Tech Broadly** — funding, product launches, platform shifts, developer tools
4. **Medicine & Biotech** — FDA approvals, trial readouts, research, epidemics
5. **Deep Tech & Frontier Science** — fusion, quantum, robotics, novel compute (photonic, thermodynamic, biological, exotic like "ocean-powered LLMs"), materials, neurotech, longevity
6. **Economics & Markets** — macro prints, Fed transmission, labor, housing, credit, currency (informational)
7. **Climate & Energy** — climate science, transition, grid, EVs, oil/gas geopolitics, catastrophic weather with $ impact
8. **Geopolitics & International** — conflict, trade, alliances, elections abroad, cross-border tech policy
9. **Culture & Society** — media, streaming, gaming, publishing, demographics, major cultural moments
10. **Space** — launches, missions, planetary science, commercial space
11. **Business & Enterprise** — M&A, IPOs, exec changes, activist moves, major corporate restructurings
12. **Cyber & Security** — breaches, ransomware, nation-state cyber, infosec, disclosed vulnerabilities

**Expansion (add if signal warrants):**
13. Education & Labor (workforce trends, university research, immigration + labor policy)
14. Sports & Entertainment business (industry-shifting only, with data)
15. Real Estate & Housing (deep dive when materially moving)
16. Food & Agriculture (biotech-adjacent stories, supply shifts)
17. Anything else that's genuinely the story of the week

**Rule:** no minimum, no maximum. Cover every domain with real signal, however many that is. A truly quiet domain gets one line ("Quiet week in [X]") — a hot week in a niche gets its own section.

---

## Source universe (250+ targets)

Not all resolve per run — target coverage, not exhaustive hit. Batch WebFetch, cache duplicates.

### Mainstream news & wire (broad tape)
NYT, WaPo, WSJ, FT, The Guardian, BBC, Reuters, AP, Bloomberg, The Economist, Axios, Semafor, Politico, POLITICO Europe, The Hill, Puck News, The Information, Yahoo News, Google News (aggregator scan), Al Jazeera, DW, France 24, Nikkei Asia, SCMP, The Atlantic, New Yorker, Foreign Affairs, Foreign Policy, ProPublica, Reuters Institute, CJR

### Tech media
TechCrunch, The Verge, Wired, Ars Technica, Engadget, The Register, MIT Technology Review, IEEE Spectrum, Fast Company, Rest of World, 404 Media, Platformer, The Rundown, TLDR, Stratechery, Benedict Evans, Not Boring, One Useful Thing (Mollick), The Neuron, AI Snake Oil, Import AI (Jack Clark), Interconnects (Nathan Lambert), Sequoia Perspectives, a16z Future

### AI-specific
Google AI Blog, DeepMind blog, OpenAI blog, Anthropic blog/research, Meta AI, Microsoft Research, Hugging Face blog, Papers With Code, LMArena leaderboard, arXiv (cs.LG, cs.CL, cs.AI, cs.CV), r/singularity, r/LocalLLaMA, r/MachineLearning, r/OpenAI, r/artificial, Latent Space podcast/newsletter, Dwarkesh Podcast, No Priors, The Cognitive Revolution, Cerebral Valley, Every AI newsletter, semianalysis.com (Dylan Patel), AI Impacts, LessWrong, Alignment Forum, Marginal Revolution AI posts

### Politics & Policy
whitehouse.gov press releases, congress.gov bill tracker, Federal Register, SCOTUSblog, EU Parliament tracker, UK gov.uk, FEC filings, OpenSecrets, The Dispatch, Bulwark, TPM, RealClearPolitics, 538, Split Ticket, Sabato's Crystal Ball, Nate Silver's Silver Bulletin

### Medicine & biotech
FDA press releases + drug approvals page, CDC MMWR, NIH Director's Blog, Nature Medicine, NEJM, The Lancet, JAMA, Cell, Science, STAT News, Endpoints News, FiercePharma, BioSpace, PubMed trending, bioRxiv (Cold Spring Harbor), ClinicalTrials.gov, Derek Lowe's *In the Pipeline*, Eric Topol's *Ground Truths*, r/medicine, r/science

### Deep tech & frontier
- Fusion / energy: ITER, Commonwealth Fusion / TAE / Helion / Zap Energy press, DOE announcements, ARPA-E
- Space: NASA + JAXA + ESA press, SpaceX, Ars Space, Payload, r/space, r/spacex
- Quantum: Google Quantum AI, IBM Q, IonQ, Quantinuum, arXiv quant-ph
- Robotics: Boston Dynamics, Figure, 1X, Tesla Optimus, r/robotics
- Novel compute: SemiAnalysis, IEEE Spectrum, Nature Nanotechnology, Extropic / Rain AI / Lightmatter / d-Matrix, thermodynamic + photonic + in-memory + neuromorphic + biological compute (this is where "ocean-powered LLMs" live)
- Frontier bio: Nature Biotechnology, Endpoints, In Vivo, Peter Attia Drive, xenotransplant/CRISPR/longevity Twitter
- Neurotech: Neuralink, Synchron, Blackrock updates, arXiv q-bio, r/neuroscience

### Economics & Markets
BLS press releases (CPI, NFP, PPI, PCE), BEA (GDP, PCE), Fed statements + minutes + SEP, JOLTS, S&P Case-Shiller, Odd Lots podcast, Bloomberg Economics, Reuters Econ, Financial Times markets, The Economist finance & economics, Calculated Risk blog, Bill McBride, Skanda Amarnath / Employ America, San Francisco Fed research

### Climate & Energy
IEA reports, EIA weekly data, IPCC updates, Nature Climate Change, Yale Climate Connections, Carbon Brief, InsideClimate News, E&E News, Energy Institute, BloombergNEF, S&P Platts, r/climate, r/energy

### Geopolitics & International
Reuters World, BBC World, Al Jazeera, DW, France 24, Nikkei Asia, SCMP, Foreign Affairs, Foreign Policy, War on the Rocks, ISW (Institute for Study of War), CSIS, Brookings, Council on Foreign Relations, The Diplomat, r/geopolitics, r/worldnews

### Social & aggregators
X/Twitter via Grok, Reddit (broad + specialist subs + r/technology, r/Futurology, r/geopolitics, r/worldnews, r/economics, r/energy, r/space), Hacker News, Product Hunt, GitHub trending, arxiv-sanity, TLDR AI

### Podcasts (transcripts / summaries)
Acquired, Business Breakdowns, Invest Like the Best, Dwarkesh, Lex Fridman, All-In, Sharp Tech, Odd Lots, Ezra Klein, The Daily, Hard Fork, Decoder, Plain English, Prof G

### Culture & Society
Puck News, The Ringer, Vulture, Variety, Deadline, Pitchfork, The Cut, r/Movies, r/television, r/books, Pew Research, Reuters demography, The Atlantic culture, New Yorker

### Space (as own domain)
NASA press + mission blogs, SpaceX news, ESA, JAXA, ISRO, Payload, Ars Space, r/space, r/spacex, TheSpaceReview, Aviation Week, Blue Origin, RocketLab, planetary science journals

### Business & Enterprise
WSJ Deals & M&A, FT Deals, Axios Pro (deals), Bloomberg Deals, Reuters M&A, PitchBook press, Crunchbase, IPO monitor (Renaissance Capital), 8-K filings for major cap changes, TheDealPipeline, activism trackers (13D Monitor, Insightia)

### Cyber & Security
CISA advisories, KrebsOnSecurity, The Record (Recorded Future), BleepingComputer, Ars Security, DarkReading, Malwarebytes Labs, Mandiant blog, CrowdStrike blog, Cloudflare blog, r/cybersecurity, r/netsec, HackerNews security tag, MITRE ATT&CK updates, NVD (National Vulnerability Database)

---

## Workflow

Phases 1-8 run in parallel. Phase 9 (Grok/X) after. Phase 10 synthesizes.

### Phase 1 — Politics & Policy
- Top stories past 7d from NYT + WaPo + Reuters + AP + FT + Semafor + Axios + Politico
- whitehouse.gov press releases (past 7d)
- congress.gov: bills moved past committee (past 7d)
- Federal Register: significant rules
- SCOTUS: cert grants or decisions
- r/politics top

Signal filter: legislative movement (not just introduction), regulatory action with $ impact, election forecasting shifts.

### Phase 2 — AI
- OpenAI + Anthropic + Google DeepMind + Meta AI + Microsoft Research blog (past 7d)
- arXiv cs.LG + cs.CL + cs.AI + cs.CV top by twitter/HN engagement
- Papers With Code trending
- LMArena leaderboard shifts
- r/singularity + r/LocalLLaMA + r/MachineLearning top
- HN AI story tag
- Substacks: One Useful Thing, Import AI, Interconnects, Latent Space, Every AI, Stratechery AI
- SemiAnalysis for AI infra + compute economics

Signal filter: new model releases with benchmark numbers, capability jumps (specific eval delta), infra buildout $ amounts, alignment/safety papers, regulatory AI news.

### Phase 3 — Tech broad
- TechCrunch + Verge + Wired + Ars + The Information (past 7d)
- HN top past 7d
- Product Hunt top launches
- GitHub trending
- 404 Media, Platformer, Rest of World
- Stratechery, Not Boring, Benedict Evans
- Funding: crunchbase daily rounds via news wire, Axios Pro Rata

Signal filter: funding rounds >$50M with valuation + investors, product launches with adoption numbers, platform policy changes, major acquisitions.

### Phase 4 — Medicine & biotech
- FDA drug approvals page (past 7d) + press releases
- NEJM + Nature Medicine + Lancet + JAMA top articles
- STAT News + Endpoints + FiercePharma
- bioRxiv preprints (via MCP if connected, else web)
- ClinicalTrials.gov new Phase 3s + readouts
- Derek Lowe / Eric Topol substack posts

Signal filter: FDA approvals with mechanism + prior SOC, Phase 3 readouts with p-value + effect size, novel-mechanism preprints, epidemic data with case counts.

### Phase 5 — Deep tech & frontier
Rotate through subdomains, at least one story per subdomain per run when signal exists:
- Fusion: DOE press, Commonwealth/Helion/TAE, ITER
- Space (if not broken out as own domain): NASA + SpaceX + ESA launches
- Quantum: qubit count records, error-correction breakthroughs
- Robotics: humanoid + industrial with capability metrics
- Compute frontier: photonic (Lightmatter), thermodynamic (Extropic), in-memory, neuromorphic, biological / exotic
- Longevity / frontier bio: xenotransplant, CRISPR base editing clinical results, mRNA pipeline, epigenetic reprogramming
- Neurotech: Neuralink + Synchron + Blackrock, BCI clinical data

Signal filter: quantified progress (record, benchmark, first-of-kind demo), not hype announcements.

### Phase 6 — Economics & Markets (informational)
- BLS + BEA + Fed data releases past 7d with actual vs consensus
- Fed speeches, minutes, SEP shifts
- Odd Lots, Bloomberg Economics, Reuters Econ, Calculated Risk
- Yield curve, credit spread, dollar index shifts (as data points, not trade calls)

Signal filter: data prints materially beating/missing consensus, Fed communication shifts, credit stress indicators.

### Phase 7 — Climate & Energy
- IEA / EIA weekly data
- Nature Climate Change, Carbon Brief, Yale Climate
- BloombergNEF, S&P Platts
- Major climate events with quantified economic impact
- Grid + energy transition progress with capacity numbers

Signal filter: quantified progress (GW deployed, emissions delta, cost per kWh), policy shifts, catastrophic events with $ impact.

### Phase 8 — Geopolitics & International
- Reuters + BBC + Al Jazeera + FT world
- Foreign Affairs / Foreign Policy weekly
- War on the Rocks, ISW, CSIS
- International elections + trade + alliance shifts
- r/geopolitics + r/worldnews top

Signal filter: shifts in state behavior (troop movements, sanctions, trade deals, elections that flip alignment).

### Phase 8b — Culture & Society
- Puck, The Ringer, Vulture, Variety, Deadline, Pitchfork
- Pew Research releases, Reuters demography
- r/Movies + r/television + r/books top
- The Atlantic + New Yorker culture

Signal filter: shifts with quantified reach — box office records, streaming subscriber milestones, demographic data with delta from prior.

### Phase 8c — Space
- NASA + SpaceX + ESA + JAXA + ISRO mission blogs and launch feeds
- Payload, Ars Space, TheSpaceReview, Aviation Week
- Commercial space company announcements
- r/space + r/spacex top

Signal filter: successful/failed launches with $/mission, orbital records, planetary science findings, commercial contract wins with $ amounts.

### Phase 8d — Business & Enterprise
- WSJ + FT + Bloomberg + Reuters Deals sections past 7d
- IPO monitor (Renaissance Capital), Crunchbase, PitchBook press
- 8-K material events (from SEC full-text search)
- Activism trackers (13D Monitor, Insightia)

Signal filter: M&A >$1B, IPO with pricing + first-day pop, activist stakes >5%, exec changes at $10B+ companies.

### Phase 8e — Cyber & Security
- CISA advisories past 7d
- KrebsOnSecurity, The Record, BleepingComputer
- Mandiant + CrowdStrike + Cloudflare blogs
- MITRE ATT&CK updates, NVD critical CVEs (CVSS ≥ 9)
- r/cybersecurity + r/netsec top, HN security tag

Signal filter: breaches with quantified impact (records exposed, $ estimated, sector affected), nation-state cyber ops with attribution, critical vulnerabilities in widely-deployed software.

### Phase 9 — X / Twitter via Grok (cross-domain firehose)

Chrome MCP → grok.com. Send prompt:

> "Scan X over last 7 days for the most-engaged posts across all 12 domains: politics, AI, tech broadly, medicine/biotech, deep tech/frontier science, economics & markets, climate & energy, geopolitics, culture & society, space, business/M&A, and cyber/security. For each domain, return 3-5 top items. Each item must include: (a) the specific claim or news, (b) concrete numbers (dollars, percentages, benchmark scores, sample sizes, dates), (c) the account(s) driving it and their credibility level, (d) engagement numbers, (e) counter-views if any. Prioritize accounts with domain track records: @balajis, @patrickc, @sama, @elonmusk (source-of-story only), @EricTopol, @kevinroose, @caseynewton, @stratechery, @benedictevans, @swyx, @karpathy, @ylecun, @gdb, @DeepMind, @AnthropicAI, @sundarpichai, @satyanadella, @dwarkesh_sp, @packyM, @Noahpinion, @NASA, @arxiv_daily, @NatureNews, economists (@paulkrugman, @Nouriel, @LHSummers), climate (@KHayhoe, @hausfath), geopolitics (@RALee85, @kofmanmichael, @IAPonomarenko), cyber (@briankrebs, @campuscodi, @thegrugq, @MalwareTechBlog), space (@SpaceX, @NASAKennedy, @jeff_foust), culture/media (@PuckNews, @lucasshaw, @kylebuchanan). Skip flame wars, generic quote-tweets. Focus on substantive claims with data."

Skip if login-walled. Don't loop.

### Phase 10 — Synthesize & filter

For each domain, filter down to 3-6 stories that meet:
- **Novelty**: not incremental
- **Impact**: affects >$1B in economic value, >1M people, or shifts a scientific consensus
- **Verifiability**: specific numbers, primary source cited

Order stories within each domain by signal strength. Kill items that don't meet the bar. "Quiet week in [domain]" > padding.

Cross-domain synthesis: what themes connect stories across domains? (AI regulation + AI capability jump + AI infra buildout = coherent "AI moment" worth calling out.)

---

## Output format

No X/100 rating. Statistics-dense. Sourced.

Save to `news/[YYYY-MM-DD].md`. Paste inline.

```markdown
# News Brief — Week ending [Date]
*Generated: [Datetime] | Window: past 7 days | Sources scanned: [N] | Domains covered: [D]*

## TL;DR
[3-4 sentences. Single biggest story of the week + the one cross-domain thread that could reshape discourse.]

---

## POLITICS & POLICY

### [Headline with number in it]
[2-4 sentences with concrete stats: dollar amounts, vote counts, poll numbers, dates, delta from prior]
**Sources:** [Publication 1](url) · [Publication 2](url) · [Primary source](url)

[3-6 stories, ranked by signal]

---

## AI

### [Headline with benchmark or $]
[Model X released, scored Y% on benchmark Z (prior SOTA: W%), trained on N tokens, cost estimated $M]
**Sources:** ...

[3-6 stories]

---

## TECH (broadly)

### [Headline]
[Company X raised $YM at $ZB post from [investors]. Product hit N users in M months.]
**Sources:** ...

[3-6 stories]

---

## MEDICINE & BIOTECH

### [Headline]
[Trial X hit primary endpoint, hazard ratio Y (p=Z), N=W patients. Mechanism [class]. Prior SOC [drug].]
**Sources:** ...

[3-6 stories]

---

## DEEP TECH & FRONTIER

### [Headline]
[Quantitative progress: X qubits with Y% error rate; Z% net energy gain in shot; W kW/kg power density]
**Sources:** ...

[3-6 stories rotating across subdomains]

---

## ECONOMICS & MARKETS

### [Headline]
[CPI came in at X% vs consensus Y%; core PCE Z% vs prior W%. Fed pricing shifted from A bps of cuts to B bps by Dec.]
**Sources:** ...

[3-6 stories]

---

## CLIMATE & ENERGY

### [Headline]
[US grid added X GW of solar in Q, up Y% YoY. EU carbon price at €Z, up W% MoM. Or: climate event with $B economic impact.]
**Sources:** ...

[3-6 stories]

---

## GEOPOLITICS & INTERNATIONAL

### [Headline]
[Trade agreement worth $ZB; election in country W flipped [party], polling gap Y%; troop movements N.]
**Sources:** ...

[3-6 stories]

---

## CULTURE & SOCIETY

### [Headline]
[Streaming subs milestone, box office record, demographic shift with delta, cultural moment with reach numbers]
**Sources:** ...

[3-6 stories]

---

## SPACE

### [Headline]
[Launch success/failure with $ per mission, orbital record, mission finding, commercial contract $ amount]
**Sources:** ...

[3-6 stories]

---

## BUSINESS & ENTERPRISE

### [Headline]
[M&A: Buyer + Target for $XB at Y multiple; IPO priced at $Z, first-day pop W%; activist stake N% by [firm]]
**Sources:** ...

[3-6 stories]

---

## CYBER & SECURITY

### [Headline]
[Breach: N records exposed at [company], estimated $M impact; nation-state op attributed to [actor]; critical CVE-YYYY-XXXXX CVSS Z.Z]
**Sources:** ...

[3-6 stories]

---

## [EXPANSION DOMAINS if triggered — Education & Labor, Real Estate, Food & Ag, etc.]

Add only if signal warrants. Minimum 11 domains total per run; if a core-12 is quiet, backfill from expansion — never drop below 11.

---

## CROSS-DOMAIN THREADS

### Theme: [Name]
[Stories from 2-4 domains that connect — the meta-narrative]

### Theme: [Name]
[...]

---

## THE NUMBERS THIS WEEK

The 10-15 most striking single statistics, one line each with source link.

| Stat | Source |
|---|---|
| GPT-X scored 87.3% on MMLU-Pro, up from 72.1% prior SOTA | [link] |
| Commonwealth Fusion hit 20T sustained plasma for 6.2 sec (record) | [link] |
| CPI +2.8% YoY (vs 3.1% consensus, 3.4% prior) | [link] |
| ... | ... |

---

## WHAT DIDN'T MATTER

[Stories getting outsized attention that don't pass the signal filter — and why to ignore]

---

## Sources

Numbered list, grouped by domain, 50-100 entries typical.

---
*News brief, not analysis or investment advice. Every claim tries to include a concrete number and a source.*
```

---

## Delivery
1. Save markdown.
2. `mcp__cowork__present_files`.
3. Paste full brief inline.
4. Offer: "Want a deep-dive on any story, expand a domain, or schedule this weekly?"

## Refresh cadence
- **Weekly Sunday evening** — sets the week ahead
- **Daily 6am** — morning brief (only past 24h)
- **On-demand**

Use `mcp__scheduled-tasks__create_scheduled_task`.

## Signal quality rules
1. Every number has a source link.
2. No "sources say" — name the source or drop the claim.
3. Novelty over recurrence.
4. Skepticism on hype announcements without paper, third-party benchmark, or working demo.
5. Steel-man contrarians when they have data.
6. Distinguish primary science (published, replicated) from preprint (unreviewed) from press release (unaudited).
7. Never fewer than 5 domains covered per run.

## Related
- `short-run-picks` / `stock-positioning` — if a story looks tradable

## Final rule
Filter aggressively. Signal density is the whole product. A brief covering 25 real stories with numbers beats one covering 60 items of noise.
