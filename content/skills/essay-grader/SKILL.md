---
name: "Essay Grader"
description: "Grades a student essay against a provided rubric and returns inline, actionable feedback."
author: "Curated"
verified: true
---

# Essay Grader

Apply a grading rubric consistently and explain every point deducted. Feedback should point to the exact sentence, not just the paragraph.

## Instructions

1. Read the rubric first and restate each criterion in your own words before grading.
2. Read the full essay once without annotating.
3. On the second pass, mark specific sentences with the rubric criterion they affect.
4. Score each criterion independently — a weak thesis should not lower the grammar score.
5. End with two sentences the student should revise first, ranked by impact on the grade.

## Example

**Input:**

Rubric: Thesis (20%), Evidence (40%), Organization (20%), Grammar (20%). Essay: 5 paragraphs on climate policy.

**Output:**

Thesis: 14/20 — claim is present in paragraph 1 but never restated in the conclusion.
Evidence: 30/40 — paragraph 3 cites a statistic with no source.
