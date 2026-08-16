---
name: "Clinical Research Report"
description: Deep multi-source clinical literature research on lab results and symptoms, built to handle 5-10 lab report PDFs at once. Unit-normalizes every result, screens for critical values and symptom red flags, runs a 10+ source literature review on every unique analyte and symptom, computes statistically-defensible trends across panels, and assembles a cited clinical report. Use whenever the user uploads bloodwork, lab panels, metabolic/lipid/CBC/thyroid/hormone results, or any test-result PDF and wants to know what it means; asks what could cause a symptom; wants a differential on a value; wants to compare panels over time; or wants literature-backed treatment approaches with dosing. Also trigger for follow-up questions about a report already built in this conversation, and when adding a new panel to an existing analysis. Trigger even if the user just uploads files or pastes numbers without asking for a "report" by name. Produces a research document for review with a licensed clinician, not a diagnosis.
author: "Curated"
verified: true
---

# Clinical Research Report

Builds a cited, differential-style clinical research report from lab PDFs and reported symptoms. Designed for **5-10 lab reports in a single run**. The user is medically literate: write clinical/technical, real terminology, no simplification.

## The core constraint, and how this skill beats it

A 10-panel upload is ~200-400 individual results. Researching each result is impossible and unnecessary. Two structural moves make full thoroughness achievable:

1. **Research the analyte, not the result.** The literature on "what does elevated ALT indicate" is identical for every ALT value the user has ever had. Deduplicate to unique analytes first. Ten panels usually collapse to 30-50 unique analytes.
2. **Persist findings to disk immediately, keep working context near-empty.** After researching an analyte, write its full findings and citations to `notes/<analyte>.md`, then drop it from working context and move on. The report is assembled from files at the end, not from memory.

This second rule is not optional. Without it, quality silently collapses after the first 5-8 analytes: later sections come out as recall dressed in citation formatting, and nothing in the output reveals which sections are real. **If you find yourself writing an analyte's findings without having written the previous analyte's file, stop and write the file.**

**Never call `suggest_research`.** That tool is barred from personal medical test-result use. All research happens inline via `web_search` / `web_fetch`.

---

## Phase 0: Workspace and extraction

Create the workspace:

```
labwork/
├── extracted.json      # every result from every PDF, raw
├── normalized.json     # unit-normalized, flagged, trended (script output)
├── queue.md            # research queue with checkboxes — the resume point
├── notes/              # one .md per analyte and per symptom
├── synthesis.md
└── report/
```

Read every uploaded PDF (use the pdf-reading skill for extraction). For each result capture: `analyte`, `value`, `unit`, `ref_low`, `ref_high`, `flag` (as printed), `collection_date`, `lab_name`, `panel_name`, and any **pathologist interpretive comment**. Those comments are frequently the single highest-value text in the document and are easy to skip past; extract them verbatim.

Also capture, per report: fasting status if stated, specimen type, and any note about hemolysis, lipemia, or icterus.

Write all of it to `extracted.json` in the schema in `references/schemas.md`.

**Unit sanity gate.** Before anything else, run every extracted value through `scripts/normalize_labs.py`. A misparsed unit is the worst silent failure this skill can produce (glucose mg/dL vs mmol/L is 18x; a bad parse manufactures a false critical flag or hides a real one). The script normalizes units, flags physiologically implausible values, and halts on anything it can't resolve. Re-read the PDF for anything it flags rather than guessing.

## Phase 1: Immediate triage (before any research)

Two screens, both fast, both before the long work starts.

**Critical lab values** — check `normalized.json` against `references/critical-values.md`. Trust the lab's own critical flag first where present.

**Symptom red flags** — check reported symptoms against `references/red-flags.md`. This overrides the general rule that symptoms don't trigger triage. The list is short and specific, and the cost of a false alarm is a wasted trip; the cost of a miss is not recoverable.

If either fires: say so in chat immediately, plainly, before starting research. Then continue the full report.

## Phase 2: Intake questions

Ask once, in a single message, and proceed without answers if the user skips (noting missing items as a report limitation):

- Age, sex assigned at birth, current medications and supplements, diagnosed conditions, relevant family history.
- **Pre-analytical context** — this is where a large share of "abnormal" results actually come from, and it is the most commonly skipped question in lab interpretation. See `references/preanalytical.md` for what to ask and what each factor distorts. At minimum: fasting status, time of day of draw, recent strenuous exercise, recent acute illness, and **biotin supplementation** (interferes with a wide range of immunoassays including TSH, troponin, and hormone panels).

## Phase 3: Build the research queue

Run `scripts/normalize_labs.py` to produce `normalized.json` and the deduplicated analyte list.

Write `queue.md`: one checkbox line per unique analyte, plus one per reported symptom. Include for each analyte its value range across all panels and its trend classification, so the research pass knows what it's explaining.

Every unique analyte goes in the queue, normal ones included. Normal-and-stable analytes still get researched; they get a condensed report section, not a condensed research pass.

Tell the user the queue size and that a full run is a long job that will span multiple turns. `queue.md` plus `notes/` is the resume point: if the conversation is interrupted or context is compacted, re-read those two and continue from the first unchecked box. Never restart a completed analyte.

## Phase 4: Per-analyte research

**Check for subagent support first (Claude Code's Task tool, or Cowork).** If available, use it — see "Parallelizing with subagents" below, this phase is a strong fit for it and it beats sequential batching on both speed and per-item quality. If not available (default claude.ai), work through the queue **in batches of about five**, posting a one-line progress note after each batch and continuing without waiting for the user.

For each item, follow `references/research-protocol.md` in full. That file contains the actual research method and the reasoning-quality rules; read it (or have each subagent read it) before starting the first batch. The short version:

1. Mechanism and physiology.
2. Clinical reference sources for the standard differential.
3. Primary literature (PubMed/PMC, journals directly) for depth and for anything specific to this user's value magnitude and context.
4. Current guidelines from whichever body owns the analyte, **recency-checked** — lipid targets, A1c targets, PSA screening, aspirin primary prevention and others have all shifted within the last decade.
5. Ranked differential, **anchored on prevalence, not on literature volume**. Published literature massively oversamples rare causes. Ferritin has far more hemochromatosis papers than "inflammation, adiposity, or alcohol" papers, and yet those three are the answer the overwhelming majority of the time. Rank by what actually causes this finding in a person like this user, and state the reasoning for each rank.
6. Treatment approaches, subject to the rules below.
7. Write `notes/<analyte>.md` with findings and full citations. Tick the box in `queue.md`. Clear it from working context.

### Treatment section rules

**You treat diagnoses, not values.** "Elevated ALT" has no treatment; its cause does. Structure every treatment section conditionally: *if the cause is X, the literature reports approach Y*. Never write treatment for the top-ranked differential as though that differential were established.

Dosing is included where the literature reports it, and every dosing figure carries its source inline. Frame as what the source says ("the 2024 ADA standards recommend initiating at..."), never as instruction to the user.

Before writing any treatment content, cross-check two things from data already in hand: the user's reported medications for interactions, and renal and hepatic function from this very panel for dose-adjustment requirements. Quoting a standard dose to someone whose eGFR is sitting at 40 in the same document is a real error, not a technicality.

### Parallelizing with subagents (Claude Code / Cowork)

This phase is a good fit for subagents specifically because each item is independent — researching ALT doesn't need to know what happened while researching TSH. That independence is what a sequential-batch design has to work around with disk persistence; subagents get it for free, since each one gets a full, fresh context budget devoted to exactly one analyte instead of a shrinking share of the orchestrator's context.

**Dispatch, don't narrate.** Spawn one subagent per analyte or symptom, in concurrent batches of roughly 5-8 — more than that tends to thrash on rate limits without actually finishing faster. The orchestrator's job during this phase shrinks to: assemble task prompts, dispatch a batch, confirm outputs, dispatch the next batch.

**Subagents do not inherit this conversation.** Each task prompt must be self-contained. Include, explicitly, in the prompt text itself:
- The analyte or symptom name, and its data pulled from `normalized.json` (all values across panels, ref range, flag, computed trend, RCV verdict) — don't make the subagent re-derive this.
- Relevant fields from `patient_context` (age, sex, meds, conditions, the specific pre-analytical factors that apply to this analyte).
- An instruction to read `references/research-protocol.md` and `references/preanalytical.md` at their file paths before starting — the subagent has file access but not your already-loaded context, so it needs to actually open them.
- The exact output contract: write `notes/<analyte>.md` in the format specified in `research-protocol.md` section 6, then return a short 2-3 sentence status to you, not the full findings. The file is the source of truth; don't have the orchestrator re-summarize or re-hold what's already on disk, that reintroduces the context-bloat problem this design exists to avoid.

**Verify before ticking the box.** A subagent that failed silently and returned a plausible-sounding status is worse than one that errors loudly. Before marking an item done in `queue.md`, confirm its `notes/` file actually exists, is non-empty, and has a populated Sources section — not just that the subagent claimed success.

**What stays sequential.** Don't parallelize Phase 6 (synthesis has to see all notes/ together to find cross-item patterns — that's the entire point of the phase) or Phase 5 (already fast, it's a script). Phase 7 assembly can still be chunked without subagents by reading notes/ files a few at a time.

If subagent dispatch isn't available in the current environment, fall back to the sequential batching described above — that path is what makes this skill portable to claude.ai, where it has no subagent access at all.

## Phase 5: Longitudinal analysis

This is computed, not researched, and the script does the statistics. Run the trend module of `scripts/normalize_labs.py`.

The controlling idea: **a change is not a trend until it exceeds the reference change value.** Every analyte has analytical and within-subject biological variation, and a creatinine moving 0.9 → 1.0 across two draws is noise, not decline. `references/reference-change-values.md` holds approximate RCVs and the script applies them. Report direction and magnitude only for changes that clear the threshold; explicitly label the rest as within expected variation.

Two further checks the script flags and you must address in prose:

- **Assay continuity.** Results from different labs, or from the same lab after an assay change, are not directly comparable. Ferritin, TSH, vitamin D, and testosterone are especially bad for this. If panels come from different labs, say so and treat cross-lab comparison as qualitative.
- **In-range trending.** A value still inside the reference interval but moving consistently and by more than its RCV across several draws is often more informative than a single out-of-range flag. Surface these.

## Phase 6: Synthesis

Write `synthesis.md`. Two rules govern it.

**Default to no unifying explanation.** Hand a language model 40 numbers and a symptom list and it will find a pattern, because that is what the machinery does. Most panels have no single unifying cause. State a syndrome-level hypothesis only when a specific named pattern is supported by several independent findings; otherwise say plainly that the findings do not converge.

**Apply the multiple-comparisons correction, explicitly, in the report.** Reference intervals are 95% ranges of a reference population, so about 1 in 20 results from a healthy person falls outside by construction. Across a 20-analyte panel the chance of at least one flag in a healthy person is roughly 64%; across 40 analytes it is about 87%. The script computes this for the user's actual analyte count. Isolated, mild, non-trending flags in an otherwise coherent picture are the expected background rate and should be named as such rather than each given a differential of equal weight.

**"Everything here is unremarkable" is a permitted and sometimes correct conclusion.** The report structure must be able to reach it. If the labs are unremarkable and the symptoms are nonspecific and common, say exactly that.

## Phase 7: Report assembly

Build with the docx skill, following `references/report-template.md`. Assemble by reading `notes/` files a few at a time and writing sections incrementally. Do not attempt to hold all findings in context and write the document in one pass; that is where fabricated citations appear.

Every citation in the final bibliography must trace to a `notes/` file. If you cannot find it there, it does not go in the report.

Save to outputs and present the file. In chat, give only the three or four most important findings; the document is the full record.

## Phase 8: Follow-up questions

Follow-ups get a **deeper** pass than the original, not a lighter one. Research fresh sources rather than re-reading `notes/`, and actively look for evidence that would revise what the report already concluded. The standing risk is that the existing report becomes the frame and the follow-up turns into confirmation-seeking. Write new findings to `notes/followup-<topic>.md` so the record stays complete, and state clearly if the new research changes anything in the original report.

## Disclaimers

Once per report and once in the delivering chat message, briefly:

- Literature research synthesis, not a diagnosis; built for review with a licensed physician.
- Dosing reflects what cited sources report, not a personal prescription.
- Critical flags are threshold triggers meaning "get this checked urgently," not diagnoses.

Stated once. Repeating disclaimers between sections buries the content.

## Reference files

- `references/research-protocol.md` — the per-analyte research method, source categories, quality hierarchy, and reasoning rules. Read before Phase 4.
- `references/preanalytical.md` — pre-analytical factors, what each distorts, what to ask.
- `references/critical-values.md` — panic thresholds.
- `references/red-flags.md` — symptom hard stops.
- `references/reference-change-values.md` — biological variation and trend noise floors.
- `references/report-template.md` — document structure.
- `references/schemas.md` — JSON schemas for the workspace files.
