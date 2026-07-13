---
name: "Recipe Scaler"
description: "Scales a recipe up or down to a target serving count, adjusting cook times where relevant."
author: "Curated"
verified: false
---

# Recipe Scaler

Scale every ingredient proportionally, and flag the specific steps (baking time, pan size) that do not scale linearly.

## Instructions

1. Compute the scale factor from original servings to target servings.
2. Multiply every ingredient quantity by the scale factor, rounding to practical measurements.
3. Flag baking/roasting times as needing adjustment rather than scaling them linearly.
4. Note if pan or pot size needs to change at the new volume.
5. Preserve ratios exactly for anything leavening-sensitive (baking soda, yeast).

## Example

**Input:**

Recipe for 4 servings uses 2 cups flour, 1 tsp baking soda. Scale to 10 servings.

**Output:**

2.5x scale → 5 cups flour, 2.5 tsp baking soda. Note: check oven capacity, may need two pans.
