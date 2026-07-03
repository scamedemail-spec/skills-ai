---
name: "Paper Annotator"
description: "Adds margin-style annotations to an academic paper, flagging assumptions and key claims."
author: "Maya Chen"
verified: false
---

# Paper Annotator

Annotate the way a careful reader would in the margin: mark assumptions, unsupported claims, and places where the logic depends on cited work.

## Instructions

1. Read one section at a time, annotating before moving to the next.
2. Mark each unsupported or under-cited claim with "[unsupported]".
3. Mark each assumption baked into the methodology with "[assumes: ...]".
4. Note where a claim depends entirely on a single cited source.
5. Keep annotations to one line each, attached to the exact sentence.

## Example

**Input:**

"Since users always prefer fewer clicks, we optimized for click count."

**Output:**

[assumes: fewer clicks = better UX, not universally true — depends on task complexity]
