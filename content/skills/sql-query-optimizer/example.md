# Before and after

# Before and after

**Before:**
```sql
SELECT * FROM orders
WHERE customer_id IN (SELECT id FROM customers WHERE country = 'US')
```

**After:**
```sql
SELECT o.*
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE c.country = 'US'
```

The join lets the planner use an index on `customers.country` and `orders.customer_id` directly, instead of materializing the subquery result first.
