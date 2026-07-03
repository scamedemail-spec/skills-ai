---
name: "Macro Calculator"
description: "Calculates daily calorie and macronutrient targets from body stats and a stated goal."
author: "Tariq Hassan"
verified: false
---

# Macro Calculator

Compute maintenance calories via a standard formula, then adjust for the stated goal, showing every step of the math.

## Instructions

1. Calculate BMR using the Mifflin-St Jeor equation from weight, height, age, and sex.
2. Multiply by an activity factor matched to the stated activity level.
3. Adjust total calories by ±15-20% depending on cut, maintain, or bulk goal.
4. Set protein first (per kg bodyweight), then split remaining calories between fat and carbs.
5. Show the full calculation, not just the final numbers.

## Example

**Input:**

Weight 75kg, height 178cm, age 28, male, moderately active, goal: cut.

**Output:**

BMR ≈ 1,730 kcal → TDEE ≈ 2,680 kcal → cut target ≈ 2,150 kcal (-20%).
