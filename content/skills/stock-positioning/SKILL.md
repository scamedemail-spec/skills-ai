---
name: "Stock Positioning"
description: "Scans 200+ sources across 13 source families — SEC filings, earnings transcripts, 13F databases, quality-fund newsletters, TAM analyst reports, deep-dive podcasts, and more — then scores every candidate across 10 explicit, weighted subcategories (moat, unit economics, management, valuation, and more) for a 1-2 year horizon. The output is a ranked brief with quantitative evidence behind every line, a stated bear case, and a numbered source list by phase — built to be checked, not just read. Trigger with '/positioning research for stocks', 'positioning research', 'stock positioning', 'compounder analysis', 'moat analysis on [ticker]'. NOT investment advice."
author: "Curated"
verified: true
---

# Stock Positioning — 1 to 2 Year Business-Quality Research

Slow-money. Business-quality-first. Every candidate ships with subscore-broken-out X/100, quantitative fundamentals, qualitative moat/management, "what would break this", valuation framework.

## Conciseness rules
- No preamble or closing pleasantries.
- Every claim = one sentence with a number or source. Cut adjectives.
- Prose only inside numbered fields.
- Empty field = "none". Never pad.
- Target: full brief ≤ 1200 words with 3 A-tier + 5 B-tier.

## Reality check

A great business is not a great stock at every price. Separate business quality (durable) from stock quality (price-dependent). Some A-tier businesses are C-tier stocks. Say so.

## Source-domain coverage (minimum 10, target 200+ sources)

Must touch each family per run: (1) SEC filings (10-K/10-Q/DEF 14A/8-K), (2) earnings call transcripts (Seeking Alpha, Roic.ai, Finchat), (3) 13F databases (whalewisdom, dataroma, hedgefollow), (4) long-only FinTwit via Grok, (5) quality-focused Substacks + newsletters (Stratechery, The Diff, YAVB, Yet Another Value Blog), (6) industry trade press, (7) TAM analyst reports (Gartner, IDC, EvaluatePharma), (8) deep-dive podcasts (Business Breakdowns, Invest Like the Best, Acquired), (9) Reddit quality subs (r/SecurityAnalysis, r/investing, r/ValueInvesting), (10) HN thematic, (11) financial news, (12) valuation databases (stockanalysis.com, tikr, koyfin, Finchat), (13) historical multiple databases + Value Investors Club archive. Log which resolved.

## Invocation

- "/positioning research for stocks"
- "Positioning research on [TICKER]"
- "Is [TICKER] a multi-year hold?"
- "Find compounders in [sector]"
- "Long-term positioning for [theme]"
- "Moat analysis on [TICKER]"

If universe is vague, default to: quality-focused screen across US large- and mid-cap, 1-2yr horizon, growth-at-reasonable-price bias, all sectors.

---

## Workflow

Phases 1-7 run in parallel where possible. Phase 8 (Grok/X specialists) after. Phase 9 synthesizes and prices.

### Phase 1 — Business model & moat mapping

For each candidate, answer these before touching a number:
- **What does the company sell, to whom, and how does the customer measure value?**
- **What is the source of moat?** (network effect, switching cost, scale economics, intangible assets, cost advantage, counter-positioning) — Hamilton Helmer's *7 Powers* framework
- **Is the moat widening, stable, or narrowing?** Evidence over past 3-5 years
- **What replaces this company if it disappeared tomorrow?** Substitution cost is the moat test

Sources:
- Company 10-Ks (last 3 years) — competitive strengths section, risk factors
- Investor day decks
- Stratechery, The Diff, Yet Another Value Blog, Value Investors Club (free tier), Substack quality analyst archives
- Podcast transcripts: Business Breakdowns, Invest Like the Best, Acquired

### Phase 2 — Unit economics & capital efficiency

Multi-year trends matter more than TTM values. Pull 5-year time series where possible.

Key metrics per business type:
- **SaaS**: NRR, gross margin, S&M as % of new ARR, magic number, RoR (rule of 40), CAC payback
- **Marketplace**: take rate, GMV growth, contribution margin per transaction, buyer/seller retention
- **Consumer**: same-store sales, gross margin ex-shipping, LTV/CAC, repeat rate
- **Industrial**: ROIC, capital turns, incremental margins, backlog trajectory
- **Fintech**: NIM, deposit franchise cost, credit metrics, cost/income
- **Biotech**: R&D productivity ($ per approval), pipeline stage-value math, LOE cliff exposure

Sources: 10-K, 10-Q, earnings transcripts (Seeking Alpha, Roic.ai), stockanalysis.com, tikr.com, wisesheets.io, koyfin.com free, Finchat.io.

### Phase 3 — Management & capital allocation

The single most under-analyzed edge in public markets.

- **Track record**: prior roles, prior returns, prior forecasts vs. delivery
- **Skin in the game**: insider ownership % (>5% ideal for founder-led), recent buys with own money (not RSUs)
- **Compensation structure**: is comp tied to ROIC / EPS growth (aligned) or revenue / market cap (misaligned)?
- **Capital allocation history**: past acquisitions returns, buybacks at what multiples, dividend consistency, dilution rate (share count trend over 5 years)
- **Communication style**: shareholder letters (Bezos, Buffett bar), earnings call transparency, willingness to admit mistakes

Sources: Proxy statements (DEF 14A), 10-K "Executive Compensation", glassdoor.com CEO ratings, past shareholder letters archived on company IR site.

### Phase 4 — Institutional positioning (quality-signal edition)

Which *smart* long-term funds are adding, holding, or exiting?

Quality holder benchmark funds:
- **Compounder-focused**: Akre Capital, Gardner Russo, Polen Capital, Ensemble Capital, Voss Capital, Wedgewood
- **Growth-quality**: Baillie Gifford, T. Rowe Price growth funds, Sands Capital, Morgan Stanley Counterpoint
- **Value with quality bias**: Dodge & Cox, Oakmark, Longleaf, Ariel
- **Founder-adjacent / early**: Founders Fund public book, Coatue, D1, Tiger long book, Sequoia public equities

Sources: whalewisdom.com, hedgefollow.com, dataroma.com, 13f.info.

Track: 4+ consecutive quarters of adding = high-conviction signal. Sudden new position by 3+ quality funds in same quarter = investigate.

### Phase 5 — Multi-quarter revision & guidance trends

Not last 4 weeks. Last 4-8 quarters.

- **Beat/raise streak**
- **Guidance conservatism** — guides low and beats, or guides high and misses?
- **Long-term estimate migration** — how have 2027/2028 consensus estimates moved over past 12-18 months?

### Phase 6 — Secular tailwind decomposition

Separate market tailwind from company execution.

For each candidate identify:
- **Market growth rate** (top-down TAM from Gartner/IDC/Frost & Sullivan/EvaluatePharma)
- **Company share trajectory** (share gain vs. share defense)
- **Second-derivative shifts** (rate of change of tailwind accelerating or maturing?)

### Phase 7 — Valuation vs growth framework

Frameworks per candidate:
- **Reverse DCF**: what growth rate does current price imply for next 10yr?
- **PEG-adjusted**: PE ÷ (revenue CAGR + operating leverage)
- **EV/Sales vs Rule of 40**: cheap growth is below trendline
- **FCF yield + growth**: yield + realistic growth ≥ required return?
- **Historical multiple bands**: current NTM PE vs. 5yr and 10yr median

### Phase 8 — X / long-only FinTwit via Grok

Different accounts than short-run-picks. Long-only, quality-focused.

Chrome MCP → grok.com. Prompt:

> "Scan X over last 90 days for long-form threads and analyses on [SCOPE]. Focus on: (a) deep-dive threads (>10 posts or linked long-form) from long-only investor accounts, (b) new bull or bear theses on quality businesses, (c) management team commentary and interviews, (d) secular theme analysis, (e) valuation debates. Prioritize @modestproposal1, @borrowed_ideas, @ChitChatMoney, @FromValue, @BluegrassCap, @10kdiver, @intrinsicinv, @jminvest, @LongTermIvest, @business_briefs, @punchcardblog, sector specialists (@stacyrasgon for semis, etc.). Skip momentum / options / short-term noise. Extract: specific claim, account, engagement, pushback."

### Phase 9 — Synthesize & price

Group by thesis, not source. Actively search bear case (`"[TICKER] short thesis"`, VIC, Bearcave archive).

**Business quality is durable; price quality is fleeting.** A great business at a bad price waits.

---

## Subscore rubric — X/100

### 1. Moat strength — /15
- **0**: Commodity business, no pricing power, high customer churn (>25%/yr)
- **5**: Weak moat — some brand or scale but not durable
- **10**: Real moat — one clear 7-Powers source, pricing power OR retention >90%
- **15**: Wide, widening moat — 2+ overlapping 7-Powers sources, 5+ years margin expansion

### 2. Unit economics / capital efficiency — /12
- **0**: Negative unit economics, cash-burning no path to profit
- **4**: ROIC < cost of capital
- **8**: Solid — ROIC 10-15%, healthy gross margins, positive FCF
- **12**: Elite — ROIC >20% sustained 5yr, expanding margins, FCF conversion >80% net income

### 3. Management & capital allocation — /12
- **0**: Poor track record, misaligned comp, high dilution (>5%/yr), value-destroying M&A
- **4**: Mixed — competent operator but weak allocation history
- **8**: Strong operator, aligned comp, minimal dilution, sensible buybacks/M&A
- **12**: Elite — founder-led, >5% insider ownership, buys own stock personally, buyback timing shows valuation discipline

### 4. Business model durability — /10
- **0**: Existential regulatory / tech / substitution threat within 3-5yr
- **4**: Some structural headwind visible
- **7**: Stable — no visible existential threat
- **10**: Anti-fragile — benefits from disruption, multiple optionality lines maturing

### 5. Secular tailwind — /10
- **0**: Company in structurally shrinking market
- **4**: Market growing GDP-ish (3-5%)
- **7**: Real tailwind — 10-20% market CAGR
- **10**: Massive tailwind (>20% CAGR) AND early enough to matter for years

### 6. Growth quality & durability — /10
- **0**: One-time growth, no visibility past current year
- **4**: Growth decelerating, visibility 1-2 quarters
- **7**: Steady mid-teens+, 2-3 year visibility from backlog/pipeline
- **10**: Compounding growth, multiple drivers, 3-5 year visibility, expanding TAM

### 7. Multi-quarter revision trend — /8
- **0**: Consistent negative revisions, guidance cuts
- **3**: Mixed / no clear trend
- **6**: Consistent beats, gradual estimate raises 4+ quarters
- **8**: Beat-and-raise every quarter for 8+ quarters, long-dated estimates migrating up materially

### 8. Institutional quality signal — /8
- **0**: Quality funds exiting
- **3**: Neutral
- **6**: 2+ quality funds adding across 2+ quarters
- **8**: 3+ quality funds adding across 4+ consecutive quarters, OR new marquee entry (Baillie / Akre / Founders)

### 9. Valuation vs. growth — /10
- **0**: Reverse-DCF implies growth well above realistic ceiling; PEG >3
- **4**: Fair — priced for expected outcomes, no margin of safety
- **7**: Attractive — modest upside to fair value under conservative assumptions
- **10**: Compelling — priced for underperformance, base case implies significant upside

### 10. Downside / risk asymmetry — /5
- **0**: Balance sheet fragile, bankruptcy or dilution risk in downside case
- **2**: Standard risk
- **4**: Strong balance sheet, net cash, recession-resistant
- **5**: Anti-fragile — downside case still positive IRR from current price

### Total: /100

**Tier mapping:**
- **80-100**: A-tier — high-conviction, core position, both business quality + price cleared
- **65-79**: B-tier — great business, wait for price OR fair price but need more work
- **50-64**: C-tier — interesting but doesn't clear both bars
- **<50**: Cut (or short candidate if bear case is A-tier)

Cap output at 3 A-tier + 5 B-tier per run.

---

## Output format

Save to `stock-positioning/[YYYY-MM-DD].md`. Paste inline.

```markdown
# Stock Positioning — [Scope] — [Date]
*Generated: [Datetime] | Universe: [Scope] | Horizon: 1-2 years*

## TL;DR
[3-4 sentences. Best A-tier, key debate on it, whether current price is a buy.]

## A-Tier candidates

### 1. [TICKER] — [Company] — Score [X/100]

**Subscores:** Moat 14/15 · Unit econ 10/12 · Mgmt 11/12 · Durability 9/10 · Tailwind 8/10 · Growth 8/10 · Revisions 7/8 · Institutional 6/8 · Valuation 6/10 · Risk 4/5

**One-line thesis:** [Business quality → what makes 1-2yr return math work at current price]

**Quantitative evidence:**
- Moat proof: [Retention %], [Pricing power evidence], [Share trajectory 5yr]
- Unit econ: ROIC [X]% 5yr avg, FCF margin [Y]%, FCF/NI [Z]%, gross margin trend
- Growth: Rev CAGR 3yr [X]%, TTM [Y]%, backlog $[Z]B (+X% YoY), NTM $[E], 2yr-out $[E]
- Capital: Share count 5yr [-X%], insider ownership [Y]%, buyback avg $[Z], dividend growth
- Institutional: [N] quality funds added last 4Q; [Fund names] new position
- Valuation: NTM PE [X] vs 5yr median [Y], EV/Sales [Z] on rev CAGR [C]%, reverse-DCF implies [G]% growth (realistic: [R]%), FCF yield [F]%

**Qualitative evidence:**
- Moat source (7 Powers): [Specific power, mechanism, evidence]
- Management: [CEO track record, letter quality, capital allocation examples]
- Secular story: [What's growing, why company positioned to compound]
- FinTwit long-only takes: [Accounts, key claims]
- Deep-dive references: [Podcasts, Substack pieces, VIC writeups]

**What would break this:**
- [Specific event #1]
- [#2]
- [#3]

**Valuation call:** [Buy / Watch / Fair — with specific price levels]

**Tier:** A / rationale

[Up to 3 A-tier]

## B-Tier watchlist

| Ticker | Score | Quality tier | Priced fairly? | Wait for |
|---|---|---|---|---|

## Secular theme reads

## Positioning shifts among quality funds

## Business quality vs. price quality matrix

| Ticker | Business (A-F) | Price (Buy/Watch/Rich) |
|---|---|---|

## What consensus is wrong about

## Bias & limitations

## Sources
Numbered by phase.

---
*Research briefing, not investment advice. Business quality is durable; price quality is not.*
```

---

## Delivery
1. Save markdown.
2. `mcp__cowork__present_files`.
3. Paste inline.
4. Offer: "Deep-dive management, model valuation scenarios, or schedule quarterly review?"

## Refresh cadence
- **Quarterly (post-earnings)**
- **On material news** (8-K, management change, guidance cut)
- **Annually** — full watchlist scan

## Related
- `short-run-picks` — for tactical entry/exit timing on names that pass here
- `news` — for theme layer without ticker focus

## Final rule
A great business at a stretched price is not a great investment. Discipline > forcing an idea.
