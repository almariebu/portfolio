# Roadmap to April 1, 2027

Goal: move from the Frappe stack to **full-stack engineer with a testing
strength and AI-feature experience**. Fallback target: QA automation / SDET.
Contract ends April 1, so offers should land before then. Start applying
late January or February, not March.

Rule from `CONTENT-CHECKLIST.md` still applies: do not list React,
TypeScript, or Tailwind on the site or CVs until a live project uses them.

## Stack to learn

TypeScript, React, Tailwind CSS, Node (or Python + FastAPI), PostgreSQL,
Vitest, Playwright, GitHub Actions. Python, SQL, Git are already yours.

## Phase 1: Foundations (Oct to Nov, weeks 1 to 8)

- [ ] TypeScript basics: types, generics, narrowing, async.
- [ ] React: components, state, effects, forms, accessibility.
- [ ] Tailwind CSS: layout, responsive, dark mode.
- [ ] Testing: Vitest + Testing Library for components.
- [ ] Playwright: first end-to-end test.
- [x] **Project 1: UI component kit** (separate repo). Buttons, inputs,
      modal, table, toast. Responsive, keyboard accessible.
  - [x] Unit tests for every component.
  - [x] One Playwright test per key flow.
  - [ ] GitHub Actions runs lint + tests on every push.
  - [x] Live demo (Vercel) and README with screenshots.

## Phase 2: Full-stack project (Dec to Jan, weeks 9 to 16)

- [ ] **Project 2: approvals app** (built in `approvals-app/`, move to its own repo). A simplified version of
      your enrollment workflow: Draft, reviewer, approver, finance.
  - [x] Login and roles (permissions per role).
  - [x] PostgreSQL schema and migrations.
  - [x] REST API with validation rules (limits, payment check).
  - [x] Safe re-runs (idempotent actions).
  - [x] API tests + Playwright tests for the full workflow (HTTP level, no UI yet).
  - [ ] CI, live demo, README with architecture notes.
- [x] Write a short test plan for it (`approvals-app/docs/TEST-PLAN.md`).

## Phase 3: AI feature + evals (late Jan to Feb, weeks 16 to 20)

- [ ] **Project 3: AI feature added to Project 2.** For example a question
      answering assistant over the app's own documents.
  - [ ] Build an eval set (30 or more cases with expected answers).
  - [ ] Automated pass/fail checks and a results table in the README.
  - [ ] Document failures you found and how you fixed them.
- [ ] Keep notes on what you checked or corrected when using AI coding tools.
      This is the judgment employers want to see.

## Phase 4: Apply (Feb to Mar)

- [ ] Add live projects to the site, then update the CVs and regenerate PDFs
      (`bash scripts/check-cv.sh public/cv-developer.html`).
- [ ] Rewrite CV bullets as outcomes (validation rules, safe re-runs,
      production fixes). Add numbers where you have them.
- [ ] Make a full-stack CV and a QA automation CV (two versions only).
- [ ] 5 applications per week. Track them in a sheet.
- [ ] Interview practice: coding, system design basics, explaining your
      projects.

## Check-ins

- [ ] End of November: Project 1 live?
- [ ] End of January: Project 2 live? If not, cut scope, do not skip tests.
- [ ] Mid-February: applications going out?
- [ ] Runway: at least 3 months of expenses covered after April 1.
