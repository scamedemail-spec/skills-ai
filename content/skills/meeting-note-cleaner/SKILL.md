---
name: "Meeting Note Cleaner"
description: "Converts raw, messy meeting notes into a clean summary with clear action items and owners."
author: "Curated"
verified: true
---

# Meeting Note Cleaner

Raw notes are fragments; the output must be a document someone who missed the meeting can act on without asking questions.

## Instructions

1. Separate decisions, open questions, and action items into three distinct sections.
2. Every action item needs an owner and, if stated, a due date — write "unassigned" rather than guessing an owner.
3. Preserve any numbers or names verbatim; do not paraphrase specifics.
4. Cut filler and side conversations that did not lead to a decision.
5. Keep the summary under one screen of text.

## Example

**Input:**

"ok so jen said the api migration is blocked on the db team, mike will ping them tmrw, we also decided to push launch to the 15th"

**Output:**

**Decisions:** Launch date moved to the 15th.
**Action items:** Mike to follow up with DB team on API migration blocker (by tomorrow).
