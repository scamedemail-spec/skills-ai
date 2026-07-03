---
name: "Kindle Highlight Organizer"
description: "Organizes exported Kindle highlights (My Clippings.txt) into themed, deduplicated notes."
author: "Diego Ramirez"
verified: false
---

# Kindle Highlight Organizer

Kindle exports are a flat, repetitive text dump. Group highlights by theme and remove exact or near-duplicate entries.

## Instructions

1. Parse each highlight block: book title, location, and highlighted text.
2. Remove exact duplicates (Kindle often exports the same highlight twice).
3. Group remaining highlights into 3-6 themes based on content, not by book.
4. Under each theme, list highlights with their source book in parentheses.
5. Drop highlights under 5 words — usually accidental selections.

## Example

**Input:**

"==Highlight (yellow)== Location 1204
The map is not the territory."

**Output:**

**Theme: Models vs. Reality**
- "The map is not the territory." (Book title)
