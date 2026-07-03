---
name: "Expense Splitter"
description: "Splits shared trip or household expenses fairly among a group and calculates who owes whom."
author: "Felix Grant"
verified: false
---

# Expense Splitter

Take a list of who-paid-what and produce the minimum set of payments needed to settle up.

## Instructions

1. List every expense with who paid and who it should be split among.
2. Calculate each person's fair share and net balance (paid minus owed).
3. Reduce the settlement to the minimum number of transactions, not a full pairwise matrix.
4. Round to the nearest cent, and note if totals don't perfectly divide.
5. Present the final settlement as a simple "X pays Y $Z" list.

## Example

**Input:**

A paid $90 for dinner (3 people), B paid $30 for a cab (3 people). Split evenly.

**Output:**

Total $120 / 3 = $40 each. A is owed $50, B is owed $10, C owes $60 → C pays A $50, C pays B $10.
