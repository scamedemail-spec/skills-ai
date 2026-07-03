---
name: "API Doc Generator"
description: "Generates endpoint documentation (params, responses, examples) from route handler code."
author: "Curated"
verified: true
---

# API Doc Generator

Read the handler code, not just its name, to document real behavior — including error responses the code actually returns.

## Instructions

1. Identify the HTTP method, path, and every parameter the handler reads (query, body, headers).
2. Document each parameter's type and whether it is required, based on the code's own validation.
3. List every distinct response the handler can return, including error status codes.
4. Add one realistic example request and response.
5. Do not document behavior the code doesn't actually implement.

## Example

**Input:**

Handler reads `req.query.slug`, 404s if missing, otherwise returns a JSON record.

**Output:**

### GET /api/items/:slug
**Params:** `slug` (string, required, path)
**Responses:** 200 with item JSON · 404 if slug not found
