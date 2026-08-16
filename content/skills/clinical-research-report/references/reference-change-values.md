# Reference change values (trend noise floor)

With 5-10 panels, the dominant failure mode is narrating noise as a trend. Every analyte varies between draws for reasons that have nothing to do with disease: analytical imprecision of the assay (CVa) and within-subject biological variation (CVi). A change smaller than the combined variation is not information.

## The formula

```
RCV = 2^(1/2) × Z × sqrt(CVa² + CVi²)
```

At 95% significance, bidirectional, Z = 1.96, giving `RCV ≈ 2.77 × sqrt(CVa² + CVi²)`. A change between two results is statistically significant only if the percentage change exceeds the RCV.

`scripts/normalize_labs.py` applies this automatically using the table below.

## Approximate RCVs

These use published within-subject biological variation estimates (EFLM / Westgard-type compilations) paired with typical analytical imprecision. **They are approximate.** Real CVa is lab- and assay-specific. Treat them as a screening threshold, and if a trend claim is load-bearing in the report, verify the analyte's biological variation directly rather than relying on this table.

| Analyte | ~CVi (%) | ~RCV (%) |
|---|---|---|
| Sodium | 0.6 | 5 |
| Potassium | 4.6 | 14 |
| Chloride | 1.2 | 6 |
| Bicarbonate | 4.8 | 15 |
| Calcium (total) | 2.1 | 8 |
| Magnesium | 3.6 | 12 |
| Phosphate | 8.2 | 24 |
| Glucose (fasting) | 5.7 | 17 |
| HbA1c | 1.9 | 8 |
| Creatinine | 6.0 | 19 |
| eGFR (creatinine-derived) | — | 19 |
| BUN / Urea | 12.3 | 35 |
| Uric acid | 8.6 | 25 |
| Total protein | 2.8 | 10 |
| Albumin | 3.1 | 10 |
| Total bilirubin | 21.8 | 62 |
| ALT | 19.4 | 57 |
| AST | 12.3 | 36 |
| ALP | 6.4 | 20 |
| GGT | 13.8 | 40 |
| Total cholesterol | 6.0 | 19 |
| LDL cholesterol | 8.3 | 25 |
| HDL cholesterol | 7.1 | 22 |
| Triglycerides | 22.0 | 63 |
| Hemoglobin | 2.8 | 9 |
| Hematocrit | 2.8 | 9 |
| MCV | 1.3 | 6 |
| RBC | 3.2 | 10 |
| WBC | 11.6 | 35 |
| Neutrophils (abs) | 16.0 | 46 |
| Lymphocytes (abs) | 10.0 | 30 |
| Platelets | 9.1 | 27 |
| Ferritin | 15.0 | 44 |
| Serum iron | 26.5 | 74 |
| Transferrin saturation | 24.0 | 68 |
| Vitamin B12 | 13.0 | 38 |
| Folate | 24.0 | 68 |
| 25-OH vitamin D | 12.0 | 40 |
| TSH | 19.3 | 54 |
| Free T4 | 5.7 | 22 |
| Free T3 | 7.9 | 25 |
| PTH | 25.0 | 72 |
| Cortisol (AM) | 20.9 | 60 |
| Testosterone (total) | 9.3 | 29 |
| Insulin | 21.1 | 60 |
| CRP (hs) | 42.0 | 118 |
| CK | 22.8 | 65 |
| LDH | 8.6 | 25 |

## How to read this

**Large RCV means the analyte is inherently noisy.** TSH at 54% means a move from 2.0 to 2.9 is within expected variation and is not a trend. CRP above 100% means it needs to roughly double before a change is interpretable. Triglycerides, ferritin, iron studies, and CK are all in this category, and all four are routinely over-interpreted.

**Small RCV means small moves are real.** Sodium at 5% and MCV at 6% are tightly regulated; a change that would be trivial for ferritin is meaningful here.

## Rules for the report

- Report direction and magnitude only for changes exceeding the RCV. Label everything else as within expected biological and analytical variation. Say it plainly rather than hedging around it.
- With three or more panels, a consistent monotonic direction across several draws can be meaningful even when adjacent changes each fall below RCV. Note the pattern, and note that it is a pattern claim rather than a per-interval significance claim.
- **In-range trending matters.** An analyte moving persistently within its reference interval, by more than its RCV, is often more useful than an isolated out-of-range flag. Surface it.
- **Cross-lab comparison degrades all of this.** These RCVs assume a consistent assay. Across labs or after an assay change, add method variability and treat the comparison as qualitative. Ferritin, TSH, vitamin D, testosterone, and PTH are the worst offenders for inter-method disagreement.
