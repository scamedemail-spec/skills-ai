---
name: "Short-Run Picks"
description: "Scans 200+ live sources across 12 source families — options flow, SEC filings (8-K/Form 4/13D), analyst revisions, insider transactions, Reddit/HN, and X via Grok — then ranks 1-3 month tactical setups across 9 explicit, weighted subcategories. Every pick ships with quantitative and qualitative evidence, a stated bear case, and a specific invalidation trigger, with sources numbered by phase — an output built to act on, not just read. Trigger with '/research short run stock picks', 'short run picks', 'tactical stock ideas', 'catalyst plays', 'what's setting up this month'. NOT investment advice."
author: "Curated"
verified: true
---

# Short-Run Picks — 1 to 3 Month Tactical Stock Research

Fast-moving, catalyst-driven. Ticker-first. Every candidate ships with subscore-broken-out X/100, quantitative + qualitative evidence, invalidation trigger, bear case.

## Conciseness rules
- No preamble, no restatement of the request, no closing pleasantries.
- Prose only inside the numbered fields — no filler paragraphs.
- Every claim = one sentence with a number or a source. Cut adjectives.
- If a field has no signal, write "none" — do not pad.
- Target: full brief ≤ 1200 words when scanning 5 A-tier + 5 B-tier.

## Reality check

Short-horizon picks are noisy. Deliver *edge in expectation* through cross-source convergence. "Nothing setting up, sit on hands" is valid.

## Source-domain coverage (minimum 10, target 200+ sources)

Must touch each family per run: (1) X/FinTwit via Grok, (2) Reddit finance subs, (3) HN, (4) financial news wire (Bloomberg/Reuters/WSJ/FT/CNBC), (5) SEC EDGAR filings (8-K/4/13D), (6) analyst notes + revisions (TipRanks/Zacks/MarketBeat), (7) options flow + short interest, (8) insider transactions, (9) alt data (Google Trends, hiring, app store, web traffic), (10) macro / calendar data, (11) sector trade press, (12) podcasts/newsletters (SemiAnalysis, Stratechery, The Transcript). Log which resolved, which didn't.

## Invocation

- "/research short run stock picks"
- "Short run picks"
- "What's setting up this month?"
- "Catalyst plays for [sector]"
- "Deep dive [TICKER]" — runs full protocol on a single name

If universe is vague, default to: full US market, 1-3mo horizon, all styles (momentum + catalyst + rotation), all risk tiers with tier tags.

---

## Workflow

Phases 1-8 run in parallel where possible. Phase 9 (Grok/X) after. Phase 10 synthesizes.

### Phase 1 — Catalyst calendar (drives everything)

- Earnings: earningswhispers.com, finviz.com/calendar.ashx, nasdaq.com/market-activity/earnings
- Macro: investing.com/economic-calendar, forexfactory.com — CPI, FOMC, NFP, PCE, PPI, jobless claims
- FDA (biotech): biopharmcatalyst.com/calendars/fda-calendar
- Investor days, product launches, conferences: web-search `"[sector] investor day [month year]"`
- Ex-div, index rebalance, lockup expiries for watchlist names

Extract: ticker, event type, exact date, consensus expectation, historical same-event move.

### Phase 2 — Reddit sweep

Keyless JSON API. Sort both `top` (30d) for signal and `hot` (24h) for what's igniting now.

```
r/wallstreetbets  — search + hot
r/stocks          — search + top
r/investing       — search + top
r/StockMarket     — hot
r/options         — hot
r/thetagang       — hot
r/Daytrading      — hot
r/swingtrading    — hot
r/pennystocks     — hot
r/SecurityAnalysis — top
```

Sector: r/AMD_Stock, r/NVDA_Stock, r/LocalLLaMA, r/Biotechplays, r/EnergyStocks, r/UraniumSqueeze, r/CryptoCurrency, r/CanadianInvestor.

Build ticker frequency table across corpus. Fetch full comment threads only for top 3-5 posts per sub. WSB frequency weighted lower than r/investing / r/SecurityAnalysis.

### Phase 3 — Hacker News

Algolia API (keyless). `TIMESTAMP = int((now - 30d).timestamp())`.
```
https://hn.algolia.com/api/v1/search?query=TERM&tags=story&numericFilters=created_at_i>TS&hitsPerPage=25
```
Edge: tech earnings reactions, product launches, layoff signals, dev-tool adoption (revenue leading indicator for infra names), regulatory tech stories.

### Phase 4 — Financial news web

WebSearch then WebFetch top 3-5 per query.

Broad tape: `"biggest movers" [today]`, `"unusual options activity"`, `"analyst upgrades OR downgrades" [today]`, `"insider buying" [past 7 days]`.

Per candidate: `"[TICKER]" news`, `"[TICKER]" earnings preview`, `"[TICKER]" price target`, `"[TICKER]" short interest`, `"[SECTOR]" outlook [month year]`.

Surface: Bloomberg, Reuters, WSJ, FT, CNBC, Barron's, MarketWatch, Yahoo Finance, Seeking Alpha, Benzinga, TheFly.com, Morningstar, Zacks. Trade press per sector: SemiWiki (semis), FiercePharma (biotech), OilPrice.com (energy).

Quote figures. Don't summarize with adjectives.

### Phase 5 — SEC / regulatory filings

- EDGAR full-text: `https://efts.sec.gov/LATEST/search-index?q=QUERY&forms=8-K,4,13D,13G`
- Latest 8-Ks (material events)
- Form 4 insider clusters (buys > $500K in 30d = strong tell)
- 13F changes: whalewisdom.com, hedgefollow.com (quarterly institutional positioning)
- 13D/13G activist stakes

### Phase 6 — Analyst / sell-side

- Search: `"[TICKER] price target" OR upgrade OR downgrade [past 30 days]`
- TipRanks, Zacks, MarketBeat for consensus + revisions
- Estimize for crowd vs Street

**Revision velocity is the money metric.** Direction + magnitude of PT/EPS estimate changes over last 4 weeks. Academically validated short-term signal.

### Phase 7 — Alt data (near-term)

- Google Trends: `trends.google.com/trends/explore?q=TICKER,PRODUCT`
- App store rank: sensortower.com, Apple/Google charts
- Hiring velocity: linkedin.com/jobs count, levels.fyi (freezes/accelerations)
- Web traffic: similarweb.com (free monthly)

### Phase 8 — Market microstructure

- Options flow: unusualwhales.com public heatmap, barchart.com/options/unusual-activity
- Short interest: shortsqueeze.com, fintel.io, FINRA data
- Dark pool: cheddarflow.com public snippets
- Gamma / dealer positioning: SpotGamma public summaries
- Sector ETF flows: etf.com, etfdb.com

Options don't predict direction alone — they *confirm* a thesis when aligned with catalyst + sentiment.

### Phase 9 — X / Twitter via Grok

Chrome MCP → `https://grok.com/`. Prompt:

> "Scan X over last 7 days for highest-signal posts on [SCOPE]. Return: (a) tickers repeatedly mentioned by accounts >10K followers with track records, (b) earnings whispers / channel checks / product leaks, (c) unusual options flow callouts, (d) sector rotation themes, (e) contrarian shorts pitched. Each item: specific claim, account(s), engagement, counter-view. Skip generic pump noise. Prioritize @unusual_whales, @zerohedge, @TheTranscript_, @LizAnnSonders, @carlquintanilla, @jasongoepfert, @ukarlewitz, @HFI_Research, plus specialist accounts for the sector."

Skip if login-walled. Don't loop.

### Phase 10 — Synthesize

Weighted ticker frequency across phases:
- Insider cluster: ×5
- Analyst revision cluster: ×4
- X specialist accounts: ×3
- Financial news: ×2
- Reddit non-WSB: ×2
- HN: ×2 (thematic)
- WSB / retail: ×1
- Alt-data: ×2

Group by thesis, not by source. Actively search bear case for every candidate (`"[TICKER] short thesis"`, `"[TICKER] overvalued"`).

**Statistical hygiene:** small-sample skepticism, survivorship bias in FinTwit, correlation ≠ causation, Simpson's paradox (sector bullishness masking single-name deterioration).

---

## Subscore rubric — X/100

Each subscore has explicit anchor points. Score = sum. No holistic hand-waving.

### 1. Catalyst clarity — /15
- **0**: No dated event in next 90 days
- **5**: Soft catalyst (momentum, sector rotation, macro theme, no ticker-specific date)
- **10**: Dated catalyst 30-90d out (earnings, capital markets day, product launch)
- **15**: Dated catalyst <30d out with market-moving history (historical avg abs move >5%)

### 2. Analyst revision momentum — /12
- **0**: PT/EPS cut by 2+ analysts in past 4 weeks, no offsetting raises
- **4**: Estimates flat, no revisions
- **8**: 1-2 raises in past 4 weeks
- **12**: 3+ raises AND magnitude of highest raise >10% of prior PT

### 3. Insider / institutional activity — /12
- **0**: Cluster insider selling >$1M in 30d, or 13F net exit by quality funds
- **4**: Neutral / no material activity
- **8**: Single insider buy >$250K OR one quality fund adding
- **12**: Insider cluster buying >$500K (2+ insiders in 30d) OR 13D filed OR 3+ quality funds adding

### 4. Options positioning — /12
- **0**: Put/call ratio spike (>2.0) with 2wk+ expiry OI build on puts
- **4**: Neutral flow
- **8**: Bullish flow on <2wk expiry (short-dated, gamma trade only)
- **12**: Bullish OI build on 2wk-3mo expiry AND rising IV skew supportive

### 5. Sentiment quality (cross-platform) — /12
- **0**: Only pumped on WSB, silent elsewhere
- **4**: Mixed / no clear signal
- **8**: Rising conviction on r/investing OR r/SecurityAnalysis OR quality FinTwit
- **12**: Multi-source convergence — WSB *and* quality subs *and* FinTwit specialists *and* financial news, all directionally aligned

### 6. Technical setup — /12
- **0**: Broken structure — below key moving averages, lower highs and lower lows
- **4**: Choppy / no clear structure
- **8**: Consolidating base OR pullback to support in uptrend
- **12**: Clean breakout above resistance with volume, or gap fill with confirmation candle

### 7. Bear case strength (inverted — high = weak bears) — /10
- **0**: Devastating short thesis with fresh evidence (fraud, terminal decline, secular headwind)
- **4**: Real bear concerns manageable but not dismissed
- **7**: Bear case exists but doesn't survive the numbers
- **10**: Weak / discredited / already priced-in bear case

### 8. Downside definition — /10
- **0**: Unclear where thesis is wrong, no logical stop
- **5**: Loose stop (e.g., "if broad market drops")
- **10**: Clean invalidation — specific price level, specific event, or specific data point that kills the thesis

### 9. Liquidity & tradability — /5
- **0**: <$1M avg daily volume, options illiquid or nonexistent
- **3**: Tradable but slippage risk on size
- **5**: >$50M ADV, tight options spreads

### Total: /100

**Tier mapping:**
- **80-100**: A-tier — high-confidence idea, worth deeper diligence and full position
- **65-79**: B-tier — watchlist, wait for one more confirming signal
- **50-64**: C-tier — speculative, small size only if trading
- **<50**: Cut

Cap output at 5 A-tier + 5 B-tier per run. Ruthless prioritization > exhaustive lists.

---

## Output format

Save to `short-run-picks/[YYYY-MM-DD].md`. Paste inline.

```markdown
# Short-Run Picks — Week ending [Date]
*Generated: [Datetime] | Universe: [Scope] | Sources scanned: [N]*

## TL;DR
[3-4 sentences. Tape posture, strongest 1 setup, biggest risk this horizon.]

## Calendar this horizon
- **[Date] [Event]** — consensus [X], prior [Y], historical avg move ±Z%

## A-Tier setups

### 1. [TICKER] — [Company] — Score [X/100]

**Subscores:** Catalyst 12/15 · Revisions 10/12 · Insider 8/12 · Options 10/12 · Sentiment 9/12 · Technical 8/12 · Bear-case 7/10 · Invalidation 10/10 · Liquidity 5/5

**Thesis (1 line):** [What has to be true]

**Quantitative evidence:**
- Catalyst: [Event] on [Date], consensus $[X] EPS vs. whisper $[Y], historical ±[Z]% move
- Revisions: [N] analysts raised PT past 4wk, avg raise +[X]%, highest [Firm] to $[PT]
- Insider: [Name/title] bought $[X]M on [Date], [N] insiders buying in 30d
- Options: [Strike/expiry] OI up [X]% in [Y] days, IV skew [reading]
- Short: [X]% SI, [Y] days to cover
- Technical: at $[price], resistance $[R], invalidation $[I], target $[T]

**Qualitative evidence:**
- Crowd: [Specific Reddit/WSB post, upvotes, thesis being pushed]
- FinTwit: [Specific accounts naming it, what they're saying]
- News: [Specific article, publication, key quote]
- Filings: [Any 8-K language change, guidance shift, MD&A tell]

**Bear case:** [Strongest counter, and why bulls answer it]

**Invalidation:** [Exact trigger: "if price closes below $X" or "if [specific event] happens"]

**Confidence tier:** A / rationale

[Up to 5 A-tier]

## B-Tier watchlist

| Ticker | Score | Setup | Trigger to promote | Catalyst date |
|---|---|---|---|---|

## Themes gaining traction this horizon

## Sector rotation read

## Contrarian / short candidates

## Cross-platform convergence log

| Signal | Reddit | HN | Web | X/Grok | Filings | Analysts | Options |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|

## What the crowd is wrong about

## Bias & limitations flags

## Sources
Numbered, grouped by phase.

---
*Research briefing, not investment advice. Every A-tier has an invalidation for a reason.*
```

---

## Delivery
1. Save markdown file.
2. `mcp__cowork__present_files`.
3. Paste full brief inline.
4. Offer: "Deep-dive any A-tier, expand a theme, or schedule daily pre-market scan?"

## Refresh cadence
- **Daily pre-market brief** — 0530 ET cron
- **Weekly Sunday deep scan**
- **Event-triggered** — auto-run 24h before major earnings/FOMC/CPI

## Related
- `stock-positioning` — for 1-2yr view on any name that scores well
- `news` — for theme layer without ticker focus

## Final rule
If evidence doesn't support conviction, say so. "Cleanest setup is B-tier at best — sit on hands or size small" is a valuable output.
