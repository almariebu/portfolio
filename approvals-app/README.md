# Approvals App

A small TypeScript API for a multi-step approval workflow, modeled on a school
enrollment process: **Draft → Dean → Registrar → Finance → Enrolled (locked)**.
Project 2 of `ROADMAP.md`. Built to move into its own repository.

## What it demonstrates

- Roles and permissions: `encoder`, `dean`, `registrar`, `finance`. Each stage can only be acted on by its owner.
- Validation rules: 1 to 24 units, non-negative fee, and **full payment required before enrollment is locked**.
- Safe re-runs: repeating an approval changes nothing and adds no history. A locked enrollment is never rewritten.
- An audit trail: every transition is stored in `enrollment_events`.
- Rules enforced twice: in code (`src/rules.ts`) and by database `CHECK` constraints.

## API

| Method and path | Role | Notes |
|---|---|---|
| `POST /auth/login` | any | returns a JWT |
| `POST /enrollments` | encoder | creates a draft |
| `PATCH /enrollments/:id` | encoder | drafts only, otherwise `409` |
| `POST /enrollments/:id/submit` | encoder | draft → dean |
| `POST /enrollments/:id/approve` | dean, registrar, finance | advances one stage. `409` if the fee is unpaid at finance |
| `POST /enrollments/:id/reject` | dean, registrar, finance | needs a `reason`, returns to draft |
| `POST /enrollments/:id/payments` | finance | `{ "amountCents": 100000 }` |
| `GET /enrollments/:id` and `/events` | any signed-in user | |

Replayed actions return `200` with `"replayed": true`.

## Architecture

```
src/app.ts      Fastify routes, JWT auth, one transaction per action
src/rules.ts    pure business rules (no I/O), unit tested
src/db.ts       small Db interface with two adapters: PGlite and pg
src/migrate.ts  runs migrations/*.sql in order, records them
migrations/     SQL schema
```

Every state change runs in a transaction with `select ... for update`, so two
people acting on the same enrollment cannot both advance it.

**Why two database adapters:** tests and the local demo use PGlite (PostgreSQL
compiled to WebAssembly, in-process), so no server is needed. Setting
`DATABASE_URL` switches to a real PostgreSQL server through `pg`. Both run the
same SQL.

## Run

```bash
npm install
npm test           # Vitest: rules, database, API
npm run e2e        # Playwright: full workflow against a running server
SEED_DEMO=1 npm start   # in-memory database with demo users
```

Demo users (`encoder@`, `dean@`, `registrar@`, `finance@demo.test`) use the
password `demo-password`. They are created only when `SEED_DEMO=1`.

With a real database: `DATABASE_URL=postgres://... JWT_SECRET=... npm start`
(`JWT_SECRET` is required when `DATABASE_URL` is set).

## Known limits

- The `pg` adapter has not been run against a live PostgreSQL server by the
  author yet. The CI file does this once the folder is its own repo.
- No UI yet; the end-to-end test drives the HTTP API.
- No login rate limiting, refresh tokens, or user management.
- No live demo link yet.

See `docs/TEST-PLAN.md` for what is tested and why.
