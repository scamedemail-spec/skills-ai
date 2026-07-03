---
name: "Syllabus Parser"
description: "Extracts every deadline, exam date, and grading weight from a course syllabus PDF or text."
author: "Curated"
verified: true
---

# Syllabus Parser

Pull structured data out of unstructured syllabus text: assignment names, due dates, weights, and exam dates, normalized into a single table.

## Instructions

1. Scan the full document before extracting — dates are often listed in two places (a table and prose).
2. Normalize every date to YYYY-MM-DD regardless of the source format.
3. Record grading weights as a percentage; if the syllabus uses points, convert to percentage of the stated total.
4. Flag any assignment mentioned without a due date rather than guessing one.
5. Output as a markdown table sorted chronologically.

## Example

**Input:**

"Midterm: Oct 14 (25%). Final project due 12/2. Participation: 10% of grade."

**Output:**

| Date | Item | Weight |
|---|---|---|
| 2026-10-14 | Midterm | 25% |
| 2026-12-02 | Final project | (not stated) |
| — | Participation | 10% |
