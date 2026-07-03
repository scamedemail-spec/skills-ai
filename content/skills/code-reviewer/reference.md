# Review risk checklist

# Risk checklist

- Unvalidated or unsanitized user input (injection, path traversal)
- Missing error handling around I/O (network, filesystem, DB)
- Off-by-one errors in loop bounds and array slicing
- Race conditions in concurrent or async code paths
- Secrets or credentials committed in plaintext
- N+1 query patterns in loops that hit a database
- Missing null/undefined checks on optional fields
