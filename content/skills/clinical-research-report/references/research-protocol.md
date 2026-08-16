# Per-analyte research protocol

Read this before starting Phase 4. It governs both *where* you search and *how you reason about what you find*. The second part matters more.

## Contents
1. Source categories and per-item quota
2. Source quality hierarchy
3. Sources to avoid
4. Recency requirements
5. Reasoning rules (base rates, magnitude, specificity)
6. Note file format

---

## 1. Source categories and per-item quota

Target 12+ distinct sources per analyte or symptom, spread across the categories below. Two searches returning the same Mayo page are one source. Search category by category rather than firing one broad query per analyte; a broad query returns ten near-duplicates from the same two sites.

**A. Clinical reference / tertiary (2-3)**
- Mayo Clinic, Cleveland Clinic
- MedlinePlus / NIH / NCBI
- StatPearls via NCBI Bookshelf — best of this tier for mechanism and pathophysiology depth
- Lab-specific references (Labcorp, Quest test directories) for assay method and reference interval derivation

**B. Primary and secondary literature (4-5)**
- PubMed / PMC directly. Search the actual database, not just what a general web search surfaces.
- Cochrane Reviews for any treatment-efficacy claim
- Major general journals: NEJM, JAMA, Lancet, BMJ, Annals of Internal Medicine
- Analyte-appropriate specialty journals: Diabetes Care, Circulation, Hepatology, Kidney International, JCEM, Blood, Thyroid

**C. Guidelines (2-3, from whichever body owns the analyte)**
- ADA, AHA/ACC, USPSTF, KDIGO, AASLD, Endocrine Society, ATA, ACR, ASH, ACG, NICE
- NICE is a useful second opinion when US guidance is thin or contested

**D. Assay and pre-analytical (1-2, when the value is borderline or surprising)**
- AACC / Clinical Chemistry, lab medicine sources on interference and method variability
- Manufacturer assay inserts when an interference question is live

**E. Drug and dosing (when the treatment section requires it)**
- DailyMed for FDA label dosing — authoritative for "what the label says"
- ClinicalTrials.gov for the dose actually used in a pivotal trial, which often differs from label
- Renal and hepatic dose-adjustment references

## 2. Source quality hierarchy

Not all "literature-reported" sources are equal, and the report should not flatten them. Rank as:

1. Current major-society guideline or systematic review/meta-analysis
2. Large RCT
3. Large prospective cohort
4. Small RCT, case-control, retrospective cohort
5. Case series, mechanistic/animal work, expert opinion

State the tier when a claim rests on tier 4-5, especially in treatment sections. A phase 2 dose, an FDA label, and a 2003 society position are not interchangeable and the report should not present them as though they were.

## 3. Sources to avoid

Do not cite, and do not let into the differential:
- Supplement retailers and any site selling a product related to the analyte
- Functional/integrative medicine sites presenting non-standard "optimal ranges" as though they were reference intervals. These are the single most common contaminant in symptom searches and they read as clinical.
- Content farms, health-adjacent SEO sites, AI-generated aggregators
- Lab-testing marketing sites that pair interpretation with an upsell
- Forums and social media as evidence. (Patient-reported experience can be noted as context if genuinely relevant, but labeled as such and never ranked in a differential.)

If a claim appears only on avoided sources and nowhere in tiers A-E, it does not go in the report.

## 4. Recency requirements

Guidelines expire and several have reversed within the last decade. Check publication date on every guideline citation and prefer the current edition. Areas with known recent reversals or active movement:

- Lipid targets and statin eligibility
- HbA1c targets, especially individualization by age and comorbidity
- PSA screening
- Aspirin for primary prevention
- Vitamin D screening and supplementation thresholds
- Blood pressure thresholds
- Testosterone screening and replacement criteria
- Thyroid treatment thresholds in subclinical disease

If the best available guideline is more than roughly five years old, say so in the note rather than presenting it as current standard of care.

## 5. Reasoning rules

These are the rules that separate a useful report from a plausible-sounding one.

**Base rates over literature volume.** Published research oversamples rare and interesting causes by an enormous margin. The differential must be ranked by what actually produces this finding in a person matching the user's demographics and context, not by what has the most papers. Concretely: elevated ferritin is inflammation, adiposity, or alcohol far more often than it is hemochromatosis; mildly elevated ALT is metabolic dysfunction-associated steatotic liver disease far more often than it is autoimmune hepatitis; mild hypercalcemia is primary hyperparathyroidism or a lab artifact far more often than it is malignancy. For each ranked item, state roughly why it sits where it does.

**Magnitude drives the differential.** The causes of an ALT of 55 and an ALT of 900 have almost no overlap. Search and reason at the user's actual magnitude, not at the analyte in general. Say explicitly which differential tier the value falls into.

**Isolated versus patterned.** A single abnormal analyte with an otherwise clean panel means something different from the same analyte abnormal alongside three related ones. Note which case applies before ranking.

**Pre-analytical first.** Before any pathological explanation, ask whether a pre-analytical factor from `preanalytical.md` explains the finding. For several analytes this belongs at or near the top of the differential and is routinely omitted.

**Specificity of symptoms.** Fatigue, brain fog, poor sleep, and headache are extremely common at population level and have very low diagnostic specificity. Research them honestly: the literature-supported answer is often that they do not localize. Do not manufacture a mechanistic story to make a nonspecific symptom fit an abnormal number.

**Population reference intervals are not personal targets.** Reference intervals are derived from a reference population and vary by lab, assay, age, and sex. A value at the edge of a range is not a graded finding. Do not import "optimal range" framing from non-standard sources.

## 6. Note file format

Write `notes/<analyte>.md` for each item, immediately after researching it:

```markdown
# <Analyte>
Values across panels: <list with dates>
Trend: <from normalized.json>
Flag status: <normal / high / low / critical>
Isolated or patterned: <which, and with what>

## Mechanism
## Pre-analytical considerations
## Ranked differential
1. <cause> — <why ranked here, prevalence reasoning> [source n]
## Treatment approaches (conditional on cause)
- If <cause>: <approach>, <dosing with inline source>, <evidence tier>
## Interactions and adjustments checked
<meds cross-checked, renal/hepatic adjustment needs>
## Uncertainty
<what the literature genuinely does not settle>
## Sources
1. Full citation — publisher/journal, year, URL, evidence tier
```

The Uncertainty section is required and must not be left empty as a formality. If the literature disagrees, or the evidence is thin, or the finding is genuinely ambiguous, that belongs in the report. A report that projects uniform confidence across 40 analytes is misrepresenting its own evidence base.
