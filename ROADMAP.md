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

## Phase 1: Foundations (Oct to early Dec, 8 weeks, about 10 hours a week)

Study notes and lesson plans live in `learn/`. Each lesson: read the docs, watch
one video, build a commit, write a teach-back note. About 1 hour of reading or
watching for every 2 hours of building. A week with no commit is not done.
Testing is learned early and used while building, not added at the end.

- [ ] Weeks 1 to 2 (12 to 25 Oct): TypeScript basics (types, narrowing, generics,
      async) and Vitest basics. Build: type the approvals-app API and fix its
      deferred review issues test-first. (`learn/01-typescript-vitest.md`)
- [ ] Weeks 3 to 5 (26 Oct to 15 Nov): React (components, state, effects, forms,
      accessibility) with Testing Library. Build: an accessible form in the UI kit,
      tested as you go. (`learn/02-react-testing-library.md`)
- [ ] Week 6 (16 to 22 Nov): Tailwind CSS (layout, responsive, dark mode). Build:
      dark mode and a responsive pass on the UI kit. (`learn/03-tailwind.md`)
- [ ] Week 7 (23 to 29 Nov): Playwright. Build: an end-to-end test of the form
      flow. (`learn/04-playwright.md`)
- [ ] Week 8 (30 Nov to 6 Dec): buffer. Catch up and tidy the teach-back notes.
      If two weeks were missed, cut Tailwind depth first, not testing.
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
