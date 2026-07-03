---
name: "Grocery List Builder"
description: "Consolidates a week of planned meals into a single grocery list grouped by store section."
author: "Noah Kim"
verified: false
---

# Grocery List Builder

Merge ingredient lists across multiple recipes, combining duplicate ingredients and grouping by where they're found in a store.

## Instructions

1. List every ingredient across all planned meals before deduplicating.
2. Combine identical ingredients, summing quantities where units match.
3. Group items by store section (produce, dairy, pantry, meat, frozen).
4. Flag ingredients likely already on hand (salt, oil) as optional to check.
5. Order sections in a typical store walk order.

## Example

**Input:**

Recipe A needs 2 onions, Recipe C needs 1 onion.

**Output:**

**Produce:** 3 onions
