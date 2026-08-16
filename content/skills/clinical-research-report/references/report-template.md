# Report structure

Build with the docx skill. Assemble incrementally from `notes/` files. Section order is fixed.

## 1. Header
Date generated, number of panels and their collection dates, labs involved, and the patient context provided. List missing context explicitly rather than omitting it.

## 2. Disclaimer
One short paragraph. Research synthesis, not a diagnosis; for review with a licensed physician; dosing is what sources report, not a prescription.

## 3. Critical values and red flags
Only if triggered. First thing after the disclaimer, visually prominent. State the value, the threshold, and that this warrants urgent evaluation. Do not soften it and do not bury it in the per-analyte sections.

## 4. Interpretive context
Short, and it goes before the findings rather than after, because it changes how everything below should be read:
- **Expected background abnormality rate.** From `multiple_comparisons` in normalized.json: with N analytes, roughly N×0.05 flags are expected in a healthy person, versus the number actually observed. If observed is at or near expected, say so plainly here.
- **Unresolved pre-analytical factors**, named specifically, with what each one limits.
- **Cross-lab comparability**, if panels span labs.

## 5. Executive summary
Three to six sentences. Leads with synthesis-level findings, not a recap of individual analytes. If the correct conclusion is that the panel is unremarkable and the symptoms are nonspecific, that is what this section says.

## 6. Longitudinal analysis
Only when multiple panels exist.
- Table: analyte, values by date, total percent change, RCV, significance.
- Prose covering only changes exceeding RCV, plus any consistent multi-draw drift.
- Separate callout for **in-range trending** analytes, which are easy to miss and often the most useful finding in a multi-panel set.
- Everything below RCV named as within expected variation. Do not narrate it as a trend.

## 7. Findings by analyte
Order by clinical significance, not alphabetically or by panel order. Group as:

**7a. Abnormal or significantly trending** — full treatment:
- Values across panels, reference range, flag
- What the analyte reflects (brief)
- Pre-analytical considerations checked
- Ranked differential, most likely first, one line of prevalence-anchored reasoning per rank
- Conditional treatment approaches: *if the cause is X, the literature reports Y*, with dosing and inline sources and evidence tier
- Interactions and dose adjustments relevant to this user's meds and renal/hepatic function
- Uncertainty
- Numbered sources

**7b. Normal and stable** — condensed. One short entry each: value range, that it is unremarkable, and any single note worth having. These were researched at full depth; the section is short because the finding is short, not because the work was.

## 8. Findings by symptom
Same structure as 7a. Be honest about specificity: for nonspecific symptoms, the literature-supported answer is often that they do not localize, and the report should say that rather than construct a mechanism to fit an abnormal number.

## 9. Cross-panel synthesis
Patterns across analytes and symptoms together. Default position is that findings do not converge on a single explanation. Name a syndrome-level hypothesis only when several independent findings support a specific pattern, and state what would confirm or refute it.

## 10. Open questions for a clinician
The practically useful closer: specific questions worth raising at an appointment, and any repeat or confirmatory testing the literature indicates for the findings above. Frame as questions to ask, not tests to order.

## 11. Bibliography
Every source, deduplicated, with evidence tier. Each entry must trace to a `notes/` file.

## Style
Working document, not an essay. Bullets and tables over narrative. Tight per-analyte sections. A physician should be able to skim it and find the three things that matter.
