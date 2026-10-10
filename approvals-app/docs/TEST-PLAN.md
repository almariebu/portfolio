# Test plan

## Goal
Show that the approval workflow cannot be bent: wrong people cannot act, bad
data cannot get in, and repeating an action cannot damage a finished record.

## Risks, ranked
1. A locked enrollment is changed or double-processed. Highest impact.
2. An enrollment is locked without the fee being paid.
3. The wrong role approves a stage.
4. Invalid data (too many units, negative fee) is stored.
5. Anonymous access, or a login that reveals which emails exist.

## Levels
| Level | Tool | Covers |
|---|---|---|
| Unit | Vitest | `rules.ts`: boundary values (0, 1, 24, 25 units), workflow order, stage owners, payment check |
| Database | Vitest + PGlite | migrations apply once, are safe to re-run, and `CHECK` constraints reject bad roles and units |
| API | Vitest + `fastify.inject` | auth, roles, full path, payment gate, safe re-run, locked record, reject and edit, input validation |
| End to end | Playwright | the whole workflow against a running server, plus 401 and 403 cases |

## Key cases
- Units: 24 passes, 25 fails, 0 / negative / fractional fail.
- Payment: 99,999 of 100,000 blocks the lock; 100,000 allows it.
- Replay: approving again returns `replayed: true` and the event count stays the same.
- Enrolled records: edit and payment return `409`.
- Login: wrong password and unknown email return the same response.

## Not covered yet
- Concurrent approvals from two sessions (the code uses row locks; no test races them).
- A live PostgreSQL server (tests use PGlite; CI will add one).
- A browser UI, load, and security scanning.
