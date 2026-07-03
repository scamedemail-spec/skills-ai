---
name: "README Writer"
description: "Drafts a clear project README from a codebase's structure and package manifest."
author: "Curated"
verified: true
---

# README Writer

Write for someone opening the repo for the first time: what it does, how to run it, and where to look next.

## Instructions

1. State what the project does in the first sentence, no preamble.
2. List actual setup commands from the package manifest — do not guess at scripts that don't exist.
3. Include a minimal usage example if the project exposes a CLI or API.
4. Document required environment variables, with which are optional vs. required.
5. Keep total length under one screen unless the project genuinely needs more.

## Example

**Input:**

package.json scripts: dev, build, test. Uses a .env file with API_KEY.

**Output:**

## Setup
```
npm install
cp .env.example .env  # set API_KEY
npm run dev
```
