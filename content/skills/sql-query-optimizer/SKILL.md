---
name: "SQL Query Optimizer"
description: "Rewrites a slow SQL query for better performance and explains the reasoning behind each change."
author: "Curated"
verified: true
---

# SQL Query Optimizer

Optimize for the query planner, not just shorter SQL. Explain the cost each change avoids so the rewrite is auditable.

## Instructions

1. Identify what the query is scanning: full table scan, missing index, unnecessary subquery.
2. Replace correlated subqueries with joins or window functions where equivalent.
3. Push filtering conditions as early as possible (before joins, not after).
4. Suggest an index only when it addresses the actual scan pattern shown in the query.
5. State the expected complexity improvement in one sentence per change.

## Example

**Input:**

`SELECT * FROM orders WHERE id IN (SELECT order_id FROM refunds)`

**Output:**

`SELECT o.* FROM orders o JOIN refunds r ON r.order_id = o.id` — replaces the subquery with a join, letting the planner use an index on refunds.order_id instead of materializing the subquery result.
