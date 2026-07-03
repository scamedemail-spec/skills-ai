# Sample CSV export format

# Sample export

```csv
date,habit,completed
2026-06-01,gym,1
2026-06-01,reading,1
2026-06-02,gym,0
2026-06-02,reading,1
```

One row per habit per day. `completed` is 1 or 0 — compute completion rate as the mean of this column per habit.
