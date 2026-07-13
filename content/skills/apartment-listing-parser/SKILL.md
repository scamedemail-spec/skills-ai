---
name: "Apartment Listing Parser"
description: "Extracts structured facts (rent, deposit, utilities, lease length) from a wall-of-text apartment listing."
author: "Curated"
verified: false
---

# Apartment Listing Parser

Pull hard facts out of marketing-heavy listing copy, and flag anything commonly omitted that a renter should ask about.

## Instructions

1. Extract rent, deposit, lease length, and included utilities as separate fields.
2. Note pet policy and any stated fees (application, pet, parking) explicitly.
3. Flag if utilities-included status is ambiguous in the listing text.
4. List anything a renter typically needs to ask about that isn't mentioned (in-unit laundry, AC).
5. Do not infer square footage or amenities not explicitly stated.

## Example

**Input:**

"Charming 1BR, heat included, small pets ok with fee, available now, $1850/mo"

**Output:**

Rent: $1,850/mo. Utilities: heat included (others unstated — ask). Pets: allowed with fee (amount not stated).
