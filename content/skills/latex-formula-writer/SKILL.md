---
name: "LaTeX Formula Writer"
description: "Converts a plain-English math description into correct LaTeX notation."
author: "Curated"
verified: true
---

# LaTeX Formula Writer

Translate a spoken or written description of an equation into valid LaTeX, ready to paste into a document.

## Instructions

1. Identify the mathematical structure first (fraction, summation, integral, matrix) before writing symbols.
2. Use standard packages only (amsmath) — do not invent custom macros.
3. Wrap the result in the correct environment: inline `$...$` vs. display `\[...\]` based on context.
4. Double-check bracket and brace matching before returning the output.
5. Show the rendered description in a comment above the code if the formula is complex.

## Example

**Input:**

"the sum from i equals 1 to n of x sub i squared, all over n"

**Output:**

\[
\frac{\sum_{i=1}^{n} x_i^2}{n}
\]
