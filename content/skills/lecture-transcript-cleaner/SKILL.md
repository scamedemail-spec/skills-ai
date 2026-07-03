---
name: "Lecture Transcript Cleaner"
description: "Cleans up an auto-generated lecture transcript into readable notes with headings by topic."
author: "Sam Okafor"
verified: false
---

# Lecture Transcript Cleaner

Auto-transcripts are full of filler words and no structure. Clean the text and add headings at natural topic shifts.

## Instructions

1. Remove filler words ("um", "so yeah", false starts) without changing the actual content.
2. Insert a heading whenever the lecture shifts to a new topic.
3. Fix obvious transcription errors for technical terms using context (e.g. a misheard term repeated correctly elsewhere).
4. Preserve any example or problem the lecturer worked through in full.
5. Do not summarize or shorten content — this is cleanup, not summarization.

## Example

**Input:**

"so um today we're gonna like talk about, uh, big O notation and stuff"

**Output:**

## Big O Notation

Today we're going to talk about Big O notation.
