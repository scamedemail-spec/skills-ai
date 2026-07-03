---
name: "Flashcard Generator"
description: "Generates Q&A flashcards from any block of study text, formatted for quick review."
author: "Curated"
verified: true
---

# Flashcard Generator

Given raw text, extract the testable facts and phrase each as a direct question with a short, unambiguous answer.

## Instructions

1. Identify every discrete fact, definition, or relationship in the source text.
2. Phrase each as a question that has exactly one correct short answer.
3. Avoid compound questions — split "what and why" into two separate cards.
4. Keep answers to one sentence or a single term.
5. Output as a numbered list of Q: / A: pairs.

## Example

**Input:**

"The French Revolution began in 1789, triggered partly by widespread famine and government debt."

**Output:**

Q: In what year did the French Revolution begin?
A: 1789
