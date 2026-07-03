---
name: "Git Commit Messages"
description: "Writes a conventional-commit-style message from a staged diff."
author: "Curated"
verified: true
---

# Git Commit Messages

Generate a commit message that explains why a change was made, following the Conventional Commits format.

## Instructions

1. Read the diff to determine the type: feat, fix, refactor, docs, test, or chore.
2. Write a subject line under 50 characters, imperative mood ("add", not "added").
3. In the body, explain why the change was made, not what changed (the diff already shows that).
4. Reference an issue number only if one was provided — never fabricate one.
5. Keep body lines wrapped at 72 characters.

## Example

**Input:**

Diff: adds a null check before parsing a webhook payload that was crashing the handler.

**Output:**

fix: guard webhook handler against empty payloads

Prevents a crash when the provider sends a heartbeat
request with no body.
