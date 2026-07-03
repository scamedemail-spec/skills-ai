# Full endpoint doc example

# Example

### POST /api/orders

**Body:**
```json
{ "customerId": "string", "items": [{ "sku": "string", "qty": "number" }] }
```

**Responses:**
- `201` — order created, returns the order object
- `400` — missing or invalid `items`
- `404` — `customerId` not found
