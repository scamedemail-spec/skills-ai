#!/usr/bin/env python3
"""
normalize_labs.py — unit normalization, plausibility gate, critical screen,
and RCV-based trend analysis for multi-panel lab data.

Usage:
    python normalize_labs.py extracted.json -o normalized.json
    python normalize_labs.py extracted.json -o normalized.json --queue queue.md

Input schema: see references/schemas.md
Exits nonzero if any value fails the plausibility gate — resolve those by
re-reading the source PDF before proceeding.
"""

import argparse
import json
import math
import sys
from collections import defaultdict

# ---------------------------------------------------------------- canonical units
# canonical_unit, and conversion factors FROM other units TO canonical.
UNITS = {
    "glucose":            ("mg/dL",   {"mmol/l": 18.016, "mg/dl": 1.0, "g/l": 100.0}),
    "cholesterol_total":  ("mg/dL",   {"mmol/l": 38.67, "mg/dl": 1.0}),
    "ldl":                ("mg/dL",   {"mmol/l": 38.67, "mg/dl": 1.0}),
    "hdl":                ("mg/dL",   {"mmol/l": 38.67, "mg/dl": 1.0}),
    "triglycerides":      ("mg/dL",   {"mmol/l": 88.57, "mg/dl": 1.0}),
    "creatinine":         ("mg/dL",   {"umol/l": 0.0113, "µmol/l": 0.0113, "mg/dl": 1.0}),
    "bun":                ("mg/dL",   {"mmol/l": 2.8, "mg/dl": 1.0}),
    "calcium":            ("mg/dL",   {"mmol/l": 4.008, "mg/dl": 1.0}),
    "magnesium":          ("mg/dL",   {"mmol/l": 2.431, "mg/dl": 1.0}),
    "phosphate":          ("mg/dL",   {"mmol/l": 3.097, "mg/dl": 1.0}),
    "bilirubin_total":    ("mg/dL",   {"umol/l": 0.0585, "µmol/l": 0.0585, "mg/dl": 1.0}),
    "albumin":            ("g/dL",    {"g/l": 0.1, "g/dl": 1.0}),
    "protein_total":      ("g/dL",    {"g/l": 0.1, "g/dl": 1.0}),
    "hemoglobin":         ("g/dL",    {"g/l": 0.1, "g/dl": 1.0, "mmol/l": 1.611}),
    "uric_acid":          ("mg/dL",   {"umol/l": 0.0168, "µmol/l": 0.0168, "mg/dl": 1.0}),
    "vitamin_d_25oh":     ("ng/mL",   {"nmol/l": 0.4006, "ng/ml": 1.0}),
    "vitamin_b12":        ("pg/mL",   {"pmol/l": 1.355, "pg/ml": 1.0, "ng/l": 1.0}),
    "folate":             ("ng/mL",   {"nmol/l": 0.4413, "ng/ml": 1.0}),
    "ferritin":           ("ng/mL",   {"ug/l": 1.0, "µg/l": 1.0, "ng/ml": 1.0}),
    "iron":               ("ug/dL",   {"umol/l": 5.587, "µmol/l": 5.587, "ug/dl": 1.0, "µg/dl": 1.0}),
    "testosterone_total": ("ng/dL",   {"nmol/l": 28.84, "ng/dl": 1.0}),
    "cortisol":           ("ug/dL",   {"nmol/l": 0.03625, "ug/dl": 1.0, "µg/dl": 1.0}),
    "tsh":                ("mIU/L",   {"uiu/ml": 1.0, "µiu/ml": 1.0, "miu/l": 1.0, "mu/l": 1.0}),
    "free_t4":            ("ng/dL",   {"pmol/l": 0.0777, "ng/dl": 1.0}),
    "free_t3":            ("pg/mL",   {"pmol/l": 0.651, "pg/ml": 1.0}),
    "hba1c":              ("%",       {"%": 1.0, "mmol/mol": None}),  # NGSP conversion handled below
}

# ------------------------------------------------- physiological plausibility gate
# (canonical units) values outside these are almost certainly a parse/unit error,
# not a real result. Wider than critical ranges on purpose.
PLAUSIBLE = {
    "glucose": (10, 2000), "cholesterol_total": (30, 1200), "ldl": (5, 1000),
    "hdl": (5, 200), "triglycerides": (10, 10000), "creatinine": (0.1, 25),
    "bun": (1, 300), "calcium": (3, 20), "magnesium": (0.3, 10),
    "phosphate": (0.5, 20), "bilirubin_total": (0.05, 60), "albumin": (0.5, 7),
    "protein_total": (2, 12), "hemoglobin": (2, 25), "uric_acid": (0.3, 25),
    "vitamin_d_25oh": (1, 200), "vitamin_b12": (50, 20000), "folate": (0.5, 100),
    "ferritin": (1, 40000), "iron": (5, 600), "testosterone_total": (1, 3000),
    "cortisol": (0.2, 100), "tsh": (0.001, 500), "free_t4": (0.05, 12),
    "free_t3": (0.2, 40), "hba1c": (2.5, 20), "sodium": (100, 190),
    "potassium": (1.0, 10), "chloride": (60, 140), "bicarbonate": (3, 60),
    "platelets": (1, 3000), "wbc": (0.05, 500), "alt": (1, 20000),
    "ast": (1, 20000), "alp": (5, 5000), "ggt": (1, 5000),
}

# ------------------------------------------------------------- critical thresholds
# (low_critical, high_critical) in canonical units. None = no threshold that side.
CRITICAL = {
    "sodium": (120, 160), "potassium": (2.5, 6.5), "glucose": (40, 500),
    "calcium": (6.0, 13.0), "magnesium": (1.0, 4.7), "phosphate": (1.0, None),
    "hemoglobin": (7.0, 20.0), "platelets": (20, 1000), "wbc": (2.0, 30.0),
    "bicarbonate": (10, 40), "creatinine": (None, 10.0),
    "alt": (None, 1000), "ast": (None, 1000), "bilirubin_total": (None, 15),
    "inr": (None, 5.0), "ph_arterial": (7.2, 7.6), "lactate": (None, 4.0),
    "troponin": (None, 0.0),  # any positive result — lab flag governs
}
# NOTE: platelets in K/uL, WBC in K/uL.

# ------------------------------------------------------------- RCV table (percent)
RCV = {
    "sodium": 5, "potassium": 14, "chloride": 6, "bicarbonate": 15,
    "calcium": 8, "magnesium": 12, "phosphate": 24, "glucose": 17,
    "hba1c": 8, "creatinine": 19, "egfr": 19, "bun": 35, "uric_acid": 25,
    "protein_total": 10, "albumin": 10, "bilirubin_total": 62, "alt": 57,
    "ast": 36, "alp": 20, "ggt": 40, "cholesterol_total": 19, "ldl": 25,
    "hdl": 22, "triglycerides": 63, "hemoglobin": 9, "hematocrit": 9,
    "mcv": 6, "rbc": 10, "wbc": 35, "neutrophils_abs": 46,
    "lymphocytes_abs": 30, "platelets": 27, "ferritin": 44, "iron": 74,
    "transferrin_saturation": 68, "vitamin_b12": 38, "folate": 68,
    "vitamin_d_25oh": 40, "tsh": 54, "free_t4": 22, "free_t3": 25,
    "pth": 72, "cortisol": 60, "testosterone_total": 29, "insulin": 60,
    "crp": 118, "ck": 65, "ldh": 25,
}
DEFAULT_RCV = 30  # conservative fallback for unlisted analytes


def norm_key(name):
    """Normalize an analyte name to a lookup key."""
    return (name.lower().strip()
            .replace(" ", "_").replace("-", "_").replace(",", "")
            .replace("(", "").replace(")", "").replace(".", ""))


def convert(analyte_key, value, unit):
    """Return (canonical_value, canonical_unit, error_or_None)."""
    if unit is None:
        return value, None, None
    u = unit.lower().strip()

    # HbA1c IFCC -> NGSP
    if analyte_key == "hba1c" and "mmol/mol" in u:
        return round(0.09148 * value + 2.152, 2), "%", None

    spec = UNITS.get(analyte_key)
    if spec is None:
        return value, unit, None  # unknown analyte, pass through unchanged
    canonical, factors = spec
    if u in factors and factors[u] is not None:
        return round(value * factors[u], 4), canonical, None
    # unit not recognized for a known analyte — flag it, don't guess
    return value, unit, f"unrecognized unit '{unit}' for {analyte_key}"


def plausibility(analyte_key, value):
    rng = PLAUSIBLE.get(analyte_key)
    if rng is None:
        return None
    lo, hi = rng
    if value < lo or value > hi:
        return (f"IMPLAUSIBLE: {analyte_key}={value} outside [{lo}, {hi}] "
                f"— likely unit misparse, re-read source PDF")
    return None


def critical_check(analyte_key, value, printed_flag):
    if printed_flag and "crit" in str(printed_flag).lower():
        return "CRITICAL (lab-flagged)"
    thr = CRITICAL.get(analyte_key)
    if thr is None:
        return None
    lo, hi = thr
    if lo is not None and value < lo:
        return f"CRITICAL LOW (<{lo})"
    if hi is not None and value > hi:
        return f"CRITICAL HIGH (>{hi})"
    return None


def range_flag(value, ref_low, ref_high):
    if ref_low is not None and value < ref_low:
        return "L"
    if ref_high is not None and value > ref_high:
        return "H"
    if ref_low is None and ref_high is None:
        return "?"
    return "N"


def analyze(data):
    results = data.get("results", [])
    out, errors = [], []

    for r in results:
        key = norm_key(r["analyte"])
        val, unit, err = convert(key, r["value"], r.get("unit"))
        if err:
            errors.append(f"{r['analyte']} ({r.get('collection_date')}): {err}")
        p = plausibility(key, val)
        if p:
            errors.append(f"{r['analyte']} ({r.get('collection_date')}): {p}")

        # convert reference range to canonical units too
        rl, rh = r.get("ref_low"), r.get("ref_high")
        if rl is not None:
            rl, _, _ = convert(key, rl, r.get("unit"))
        if rh is not None:
            rh, _, _ = convert(key, rh, r.get("unit"))

        out.append({
            "analyte": r["analyte"], "key": key,
            "value": val, "unit": unit,
            "ref_low": rl, "ref_high": rh,
            "flag": range_flag(val, rl, rh),
            "printed_flag": r.get("flag"),
            "critical": critical_check(key, val, r.get("flag")),
            "collection_date": r.get("collection_date"),
            "lab_name": r.get("lab_name"),
            "panel_name": r.get("panel_name"),
            "comment": r.get("comment"),
        })

    # ------------------------------------------------------------ trend analysis
    series = defaultdict(list)
    for o in out:
        if o["collection_date"]:
            series[o["key"]].append(o)

    trends = {}
    for key, items in series.items():
        items.sort(key=lambda x: x["collection_date"])
        if len(items) < 2:
            trends[key] = {"n": len(items), "trend": "single measurement"}
            continue

        rcv = RCV.get(key, DEFAULT_RCV)
        labs = {i["lab_name"] for i in items if i["lab_name"]}
        first, last = items[0], items[-1]
        pct = ((last["value"] - first["value"]) / first["value"] * 100
               if first["value"] else 0.0)

        steps = []
        for a, b in zip(items, items[1:]):
            d = ((b["value"] - a["value"]) / a["value"] * 100) if a["value"] else 0.0
            steps.append({"from": a["collection_date"], "to": b["collection_date"],
                          "pct_change": round(d, 1),
                          "significant": abs(d) > rcv})

        directions = [1 if s["pct_change"] > 0 else -1 if s["pct_change"] < 0 else 0
                      for s in steps]
        monotonic = len(set(directions)) == 1 and directions[0] != 0

        if abs(pct) > rcv:
            label = f"significant {'increase' if pct > 0 else 'decrease'}"
        elif monotonic and len(items) >= 3:
            label = (f"consistent {'upward' if directions[0] > 0 else 'downward'} "
                     f"drift, each step below RCV (pattern claim, not per-interval)")
        else:
            label = "within expected biological + analytical variation"

        in_range_trend = (abs(pct) > rcv
                          and all(i["flag"] == "N" for i in items))

        trends[key] = {
            "n": len(items), "rcv_pct": rcv,
            "first": {"date": first["collection_date"], "value": first["value"]},
            "last": {"date": last["collection_date"], "value": last["value"]},
            "total_pct_change": round(pct, 1),
            "exceeds_rcv": abs(pct) > rcv,
            "trend": label,
            "steps": steps,
            "in_range_trending": in_range_trend,
            "cross_lab": len(labs) > 1,
            "labs": sorted(labs),
        }

    # -------------------------------------------------- multiple comparisons math
    unique = sorted(series.keys() or {o["key"] for o in out})
    n = len(unique)
    p_any = 1 - (0.95 ** n) if n else 0.0

    latest_date = max((o["collection_date"] for o in out if o["collection_date"]),
                      default=None)
    latest = [o for o in out if o["collection_date"] == latest_date]
    abnormal_latest = [o for o in latest if o["flag"] in ("H", "L")]

    return {
        "results": out,
        "trends": trends,
        "unique_analytes": unique,
        "n_unique_analytes": n,
        "panels": sorted({o["collection_date"] for o in out if o["collection_date"]}),
        "labs_involved": sorted({o["lab_name"] for o in out if o["lab_name"]}),
        "multiple_comparisons": {
            "n_analytes": n,
            "p_at_least_one_flag_if_healthy": round(p_any, 3),
            "expected_false_flags": round(n * 0.05, 1),
            "observed_flags_latest_panel": len(abnormal_latest),
            "note": ("Reference intervals are 95% population ranges. Compare "
                     "observed flags against expected_false_flags before "
                     "treating each flag as signal."),
        },
        "critical_values": [o for o in out if o["critical"]],
        "errors": errors,
    }


def write_queue(analysis, path):
    lines = ["# Research queue", "",
             f"Unique analytes: {analysis['n_unique_analytes']} | "
             f"Panels: {len(analysis['panels'])}", ""]
    for key in analysis["unique_analytes"]:
        t = analysis["trends"].get(key, {})
        vals = [r for r in analysis["results"] if r["key"] == key]
        flags = {v["flag"] for v in vals}
        rng = (f"{min(v['value'] for v in vals)}-{max(v['value'] for v in vals)}"
               if len(vals) > 1 else f"{vals[0]['value']}")
        lines.append(f"- [ ] **{key}** | values {rng} {vals[0]['unit'] or ''} "
                     f"| flags {'/'.join(sorted(flags))} | {t.get('trend', 'n/a')}")
    lines += ["", "## Symptoms", "<!-- add one checkbox per reported symptom -->", ""]
    with open(path, "w") as f:
        f.write("\n".join(lines))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("-o", "--output", default="normalized.json")
    ap.add_argument("--queue", help="also write a research queue markdown file")
    args = ap.parse_args()

    with open(args.input) as f:
        data = json.load(f)

    analysis = analyze(data)

    with open(args.output, "w") as f:
        json.dump(analysis, f, indent=2)
    if args.queue:
        write_queue(analysis, args.queue)

    mc = analysis["multiple_comparisons"]
    print(f"Wrote {args.output}")
    print(f"  {analysis['n_unique_analytes']} unique analytes across "
          f"{len(analysis['panels'])} panels")
    print(f"  labs involved: {', '.join(analysis['labs_involved']) or 'unspecified'}")
    print(f"  expected false flags if healthy: {mc['expected_false_flags']} "
          f"| observed in latest panel: {mc['observed_flags_latest_panel']}")
    print(f"  P(>=1 flag in a healthy person): {mc['p_at_least_one_flag_if_healthy']}")

    if analysis["critical_values"]:
        print("\n  *** CRITICAL VALUES ***")
        for c in analysis["critical_values"]:
            print(f"    {c['analyte']} = {c['value']} {c['unit']} "
                  f"[{c['critical']}] ({c['collection_date']})")

    sig = [(k, v) for k, v in analysis["trends"].items() if v.get("exceeds_rcv")]
    if sig:
        print("\n  Trends exceeding RCV:")
        for k, v in sig:
            tag = " (IN-RANGE TREND)" if v["in_range_trending"] else ""
            xl = " [CROSS-LAB, qualitative only]" if v["cross_lab"] else ""
            print(f"    {k}: {v['total_pct_change']:+}% vs RCV {v['rcv_pct']}%{tag}{xl}")

    if analysis["errors"]:
        print("\n  !! UNRESOLVED — re-read source PDFs, do not proceed:")
        for e in analysis["errors"]:
            print(f"    {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
