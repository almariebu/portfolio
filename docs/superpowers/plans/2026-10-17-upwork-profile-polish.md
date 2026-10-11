# Upwork Profile Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Most steps are done by Almarie in the Upwork editor; a helper may only prepare copy and screenshots, never click Save/Submit or buy Connects without her yes.

**Goal:** Turn the Upwork profile from "QA learner, portfolio in development, 1 item" into a hireable Frappe/ERPNext + React/Next.js + workflow-automation developer profile with 10+ portfolio items, then win the first contract.

**Architecture:** Reuse what already exists in this repo (8 school-system case studies with live demos, the Frappe contract tracker, the React UI kit, the approvals API, and this Next.js site) as Upwork portfolio items. Rewrite title, overview, rate, skills, employment and the project catalog around three services. Split into two specialized profiles. Fill the Vue.js and "automation tool" gaps with two small new builds before claiming them.

**Tech Stack:** Upwork profile editor; screenshots from `public/work/*.png` and the live site `https://portfolio-almariebu.vercel.app`; GitHub `github.com/almariebu`.

**Spec:** The user's request in this session (sell ERPNext *and* automations *and* React / Next.js / Vue; add portfolio items; get a client ASAP) plus the current profile at `https://www.upwork.com/freelancers/~01d42a6699f8f1efb3`, read on 2026-10-17.

## What the profile shows today (2026-10-17)

| Area | Now | Problem |
|---|---|---|
| Title | Web Developer \| Software QA & API Testing | Sells QA, which she is still learning. Hides 6 years of Frappe. |
| Overview | "expanding into QA… portfolio is currently in development" | Tells clients she is a beginner. First 2 lines (shown in search) don't name a client problem. |
| Rate | $8/hr | Reads as junior; filters her out of serious ERPNext jobs. |
| Portfolio | 1 item (Discount feature) | Clients scan portfolio first. 1 item = no proof. |
| Skills | 7 skills, no React/Next.js/automation | Upwork search can't match her to React/Next.js/automation jobs. |
| Employment | Wela "Senior Web Developer, Feb 2024 – Present" | Out of date: CV says Wela ended Dec 2025 and she is Product Owner at Livro Systems since Jan 2026. |
| Project catalog | 1 project, "From $20, 5 days" | Price signals low quality; one service only. |
| Connects | 0 | She cannot send a single proposal. This is the #1 blocker to "a client ASAP". |
| Video intro, certifications | Empty | Missed trust signals. |

## Global Constraints

- Truth only. Every claim must come from her CV (`docs/superpowers/plans/2026-10-07-developer-cv.md` → Source facts) or a project in this repo. No invented clients, metrics or years.
- Do **not** list Vue.js as a skill, title word or service until Task 7's Vue project is live. Do **not** list n8n/Zapier/Make until Task 8 is live.
- Never mention restructuring or a September 2026 role change (same rule as the CV).
- Banned words: passionate, dynamic, results-driven, innovative, rockstar, ninja, synergy.
- Profile title ≤ 70 characters. Portfolio item description ≤ 600 characters. Up to 5 skills per portfolio item (Upwork limits).
- Portfolio screenshots must show demo data only — no real school, student or employee names.
- Links in portfolio items: live site and GitHub only. Upwork forbids contact details (email, phone, Telegram) anywhere on the profile.

## Review Focus

- A client clicks a portfolio link and lands on a redirect or 404 → each link is opened in a private window before saving (Task 3 step 4). Checked 2026-10-17: all 5 `/demo/*` links, the UI kit and the tracker repo return 200; `/work/<slug>` redirects to `/?panel=work&study=<slug>` by design, so link `/demo/<slug>` in Upwork.
- A screenshot shows a real school or student name from production → Task 3 step 1 checks every image.
- The overview promises Vue/automation tools she cannot yet show → Global Constraints gate; Task 7/8 add them only after the demo is live.
- The new rate scares away first clients with zero reviews → Task 2 sets an entry rate with a planned raise, not a final rate.
- Proposals go out with 0 Connects or to jobs that need 3+ years on Upwork → Task 9 buys Connects first and filters jobs.

---

### Task 1: Fix the facts (employment, languages, availability)

**Files:** Upwork → Profile → Employment history, Languages, Hours per week.

- [ ] **Step 1: Add a new employment entry**
  - Company: `Livro Systems, Inc.` · Title: `Product Owner` · `January 2026 – Present`
  - Description (copy from CV facts):
    ```
    Own the school management system and ERP Livro (Frappe/ERPNext) and keep delivering with the team.
    - Delivered updates for enrollment status, tellering, billing, and SMS sent from the school system.
    - Built and maintained employee onboarding, offboarding and user access request workflows in ERP Livro.
    - Maintained online enrollment forms and payment allocation.
    - Moved the SMS billing gateway from Smart to Globe.
    ```
- [ ] **Step 2: Edit Wela "Senior Web Developer" end date** to `December 2025`.
- [ ] **Step 3: Languages** — set English to the level that is true for her (Conversational / Fluent). If she writes proposals unaided in clear English, `Fluent` is honest and widens the job pool.
- [ ] **Step 4: Check** — profile page shows Livro Systems on top with "Present"; no other role says "Present".

### Task 2: Title, rate, overview

**Files:** Upwork → Profile → Title, Hourly rate, Overview.

- [ ] **Step 1: Title** (63 chars):
  ```
  Frappe/ERPNext Developer | React & Next.js | Workflow Automation
  ```
- [ ] **Step 2: Rate** — set `$15.00/hr`. Plan to raise to `$20/hr` after 3 five-star reviews, and to `$25+/hr` after 10. ($8 for 6 years of ERPNext work signals a beginner.)
- [ ] **Step 3: Overview** — paste exactly (the first two lines are what clients see in search):
  ```
  I build and fix Frappe/ERPNext systems and the web apps around them — enrollment, billing, payments, approvals, and the automations that remove manual work.

  6+ years developing school management and ERP systems on Frappe and ERPNext, now Product Owner of a live school ERP. I can take a messy business process and turn it into a tool your staff uses every day.

  What I can do for you
  - Frappe / ERPNext: custom doctypes, workflows and approvals, role permissions, print formats, reports, client and server scripts, bug fixes on live sites.
  - Billing and payments: fee allocation, discounts, statements of account, cashiering, online payment integrations.
  - Workflow automation: email and SMS notifications, scheduled jobs, approval routing, REST API integrations between your ERP and other tools.
  - Data migration: moving records from spreadsheets or old systems into ERPNext, with checks before go-live.
  - Web apps: React, Next.js and TypeScript front ends, accessible forms and tables, Node.js/Fastify + PostgreSQL APIs.

  Proof (see my portfolio — every item has a live demo or code)
  - College admission and enrollment flow, account closing and cashiering, student discounts, online payments, SMS/email notifications — all built on Frappe.
  - A Frappe app with contracts, payments, approval workflow and 11 unit tests.
  - A React + TypeScript component kit with 29 automated tests.
  - A multi-step approval API in TypeScript, Fastify and PostgreSQL.

  How I work
  - I confirm the expected behavior before I code, then show you a working version early.
  - Clear daily or end-of-task updates, in your time zone overlap (I'm in the Philippines, UTC+8, flexible and evening hours).
  - Tested changes and short notes so your next developer can pick it up.

  Send me your ERPNext problem or the process you want automated — I'll reply with how I'd approach it.
  ```
- [ ] **Step 4: Check** — no "QA learner", "portfolio in development", or banned word remains; preview shows the first line in search card.

### Task 3: Portfolio — publish 8 items from what already exists

**Files:** Upwork → Portfolio → Add. Images from `public/work/` (`college.png`, `closing.png`, `discounts.png`, `bed.png`, `migration.png`, `ui-kit.png`); take new screenshots of the live demos for items without one.

Each item: **Title / Role / Description (≤600 chars) / Skills (5) / Content (cover image first, then link)**. Use problem → what I built → result.

- [ ] **Step 1: Check every screenshot** for real names; retake from the demo pages if any appear.
- [ ] **Step 2: Rewrite the existing item** "Frappe/Erpnext Customize Discount Feature" → title `Student Discounts Engine on Frappe/ERPNext`, description from `src/lib/content.ts` slug `student-discounts`, link `https://portfolio-almariebu.vercel.app/demo/student-discounts`, image `discounts.png`.
- [ ] **Step 3: Add these items** (descriptions come from the matching entry in `src/lib/content.ts`, trimmed to ≤600 chars):

  | # | Upwork title | Source in repo | Skills (5) | Link |
  |---|---|---|---|---|
  | 1 | College Admission & Enrollment System (Frappe) | `college-enrollment` | Frappe, ERPNext, Python, JavaScript, MariaDB | `/demo/college-enrollment` |
  | 2 | Account Closing & Cashiering Module (ERPNext) | `account-closing` | Frappe, ERPNext, Python, SQL, Accounting | `/demo/account-closing` |
  | 3 | Online Payment Integration for a School ERP | `online-payments` | Frappe, Python, Payment Gateway Integration, REST API, ERPNext | `/demo/online-payments` |
  | 4 | Automated SMS & Email Notifications (Frappe) | `sms-and-email` | Business Process Automation, Frappe, Python, API Integration, ERPNext | `/demo/sms-and-email` |
  | 5 | Roles, Permissions & Data Migration to Frappe | `roles-and-migration` | Data Migration, Frappe, Python, SQL, Linux | `/demo/roles-and-migration` |
  | 6 | Frappe Contract & Payment Tracker App | project "Frappe contract tracker" | Frappe, Python, JavaScript, MariaDB, Unit Testing | `github.com/almariebu/frappe-contract-tracker` |
  | 7 | Accessible React + TypeScript UI Component Kit | project "UI component kit" | React, TypeScript, Tailwind CSS, Playwright, Vitest | `https://ui-kit-almariebu.vercel.app/` |
  | 8 | Developer Portfolio Built with Next.js 16 | this repo | Next.js, React, TypeScript, Tailwind CSS, Vercel | `https://portfolio-almariebu.vercel.app` |

  Links in the table are relative to `https://portfolio-almariebu.vercel.app` unless they start with a domain.
- [ ] **Step 4: Verify every link** in a private browser window: it loads (200, not 404), shows the demo, and needs no login.
- [ ] **Step 5: Order** — pin items in this order: College Enrollment, Online Payments, SMS/Email Automation, UI Kit, Contract Tracker, Discounts, Account Closing, Migration, Portfolio site. (Mix of ERPNext, automation and React in the first 4 so every client type sees a match.)
- [ ] **Step 6: Check** — profile shows 9 published items, 0 drafts left behind.

### Task 4: Add the approvals API as a portfolio item

**Files:** `approvals-app/` (README already explains it). Optional: move to its own GitHub repo first, as its README suggests.

- [ ] **Step 1:** Push `approvals-app` to `github.com/almariebu/approvals-app` (or link the folder in `almariebu/portfolio`). Confirm the README renders.
- [ ] **Step 2:** Take one screenshot: the README's API table or a terminal/Playwright run showing tests passing.
- [ ] **Step 3:** Add Upwork item `Multi-Step Approval Workflow API (TypeScript + PostgreSQL)` — Skills: TypeScript, Node.js, PostgreSQL, REST API, Fastify. Description: Draft → Dean → Registrar → Finance → Enrolled; role permissions; payment required before lock; safe retries; full audit trail.
- [ ] **Step 4: Check** — 10 published items.

### Task 5: Skills and specialized profiles

**Files:** Upwork → Profile → Skills; Upwork → Specialized profiles.

- [ ] **Step 1: Main profile skills** (Upwork allows 15): `ERPNext`, `Frappe`, `Python`, `JavaScript`, `React`, `Next.js`, `TypeScript`, `Business Process Automation`, `API Integration`, `REST API`, `MariaDB`, `PostgreSQL`, `Data Migration`, `Workflow Automation`, `Tailwind CSS`.
- [ ] **Step 2: Specialized profile A — "ERPNext & Frappe Developer"**: title `ERPNext & Frappe Developer | Custom Apps, Workflows, Billing`; portfolio items 1–6 + Discounts + Account Closing; rate $15.
- [ ] **Step 3: Specialized profile B — "React & Next.js Developer"**: title `React, Next.js & TypeScript Developer | Business Web Apps`; overview = Task 2 overview with the Web-apps bullet moved to the top; items UI Kit, Portfolio site, Approvals API (+ Vue app after Task 7); rate $15.
- [ ] **Step 4: Check** — searching Upwork talent for "Frappe" and for "Next.js" each shows the matching specialized profile (may take a day to index).

### Task 6: Project catalog (fixed-price offers)

**Files:** Upwork → Your project catalog → Manage projects.

- [ ] **Step 1: Rewrite the existing project** into 3 tiers:
  - Title: `You will get ERPNext / Frappe customization, bug fix, or workflow`
  - Basic `$50` — 1 bug fix or small customization (field, script, print format), 2 days.
  - Standard `$150` — 1 custom doctype or workflow with permissions and a report, 5 days.
  - Premium `$400` — a small custom Frappe app or module (up to 4 doctypes, workflow, tests), 10 days.
- [ ] **Step 2: Add project 2:** `You will get a React or Next.js web page or dashboard` — Basic `$60` landing/one page, Standard `$180` multi-page app with forms, Premium `$450` dashboard connected to your API.
- [ ] **Step 3: Add project 3:** `You will get an automated email/SMS or approval workflow for your ERP` — Basic `$60` one notification, Standard `$160` approval routing + notifications, Premium `$380` integration with an external API.
- [ ] **Step 4:** Use a portfolio screenshot as each project's gallery image; ask 3 qualifying questions in requirements (ERPNext version, hosting, access).
- [ ] **Step 5: Check** — 3 projects show "Active".

### Task 7: Build the Vue.js proof (only then claim Vue)

**Files:** new repo `github.com/almariebu/vue-enrollment-dashboard`.

- [ ] **Step 1:** Build a small Vue 3 + Vite + TypeScript app that reads the Frappe REST API pattern (mock JSON is fine): enrollment list with search/filter, status badges, a detail drawer, one form with validation. Deploy to Vercel.
- [ ] **Step 2:** One Vitest test for the filter logic, so the item can say "tested".
- [ ] **Step 3:** Add portfolio item `Vue 3 Enrollment Dashboard for a Frappe Backend` — Skills: Vue.js, TypeScript, Vite, REST API, Frappe. Add `Vue.js` to profile skills and specialized profile B title: `React, Next.js & Vue.js Developer | Business Web Apps`.
- [ ] **Step 4: Check** — live URL loads on phone width; item published.

### Task 8: Build one no-code automation proof

**Files:** new repo or Loom video.

- [ ] **Step 1:** Build with n8n (free self-host or cloud trial): "New ERPNext Sales Invoice → post to Slack/Email + append row to Google Sheet", triggered by a Frappe webhook.
- [ ] **Step 2:** Record a 60–90 s Loom/video showing it fire end to end; export the n8n workflow JSON to the repo.
- [ ] **Step 3:** Add portfolio item `ERPNext → Slack & Google Sheets Automation (n8n + Webhooks)` with the video. Add `n8n` and `Zapier`-style skills only for tools actually used.
- [ ] **Step 4: Check** — video plays from the portfolio item without login.

### Task 9: Win the first client (start this the same day as Task 3)

**Files:** Upwork → Connects, Find Work, Proposals.

- [ ] **Step 1: Get Connects.** Buy 80–100 (each proposal costs ~6–16). Ask Almarie before purchasing.
- [ ] **Step 2: Turn on the "Available now" badge** and keep it on.
- [ ] **Step 3: Saved searches** (filter: Payment verified, < 10 proposals, posted in last 24 h, Entry/Intermediate): `ERPNext`, `Frappe`, `ERPNext customization`, `Next.js bug`, `React fix`, `workflow automation API`.
- [ ] **Step 4: Proposal template** (personalize line 1 every time, ≤ 150 words):
  ```
  Hi [name], you need [their exact problem in their words].

  I've done this before: [one matching portfolio item + link]. On a live school ERP I [one relevant fact from CV].

  How I'd approach yours:
  1. [first concrete step]
  2. [second]
  3. [how you'll show/verify it]

  Quick question: [one smart question about their setup, e.g. ERPNext version / hosting].

  I can start today. — Almarie
  ```
- [ ] **Step 5: Volume** — send 3–5 tailored proposals every day for 14 days. Small fixed-price jobs ($30–$150) first: they close fastest and bring the first review.
- [ ] **Step 6: Reply within 1 hour** during your waking hours (turn on Upwork mobile notifications).
- [ ] **Step 7: After the first job** — over-deliver, ask for feedback, then raise the rate per Task 2 step 2.
- [ ] **Step 8: Track** — a simple sheet: date, job, Connects spent, viewed?, replied?, hired? Review every Sunday; drop searches with 0 replies.

### Task 10: Trust extras (after Tasks 1–3)

- [ ] **Step 1:** Record a 60 s video intro: who you are, the 3 services, one project on screen, invite to message. Upload in Profile → Video introduction.
- [ ] **Step 2:** Add a certification you actually hold (or earn a free one, e.g. a Frappe School course certificate) under Certifications.
- [ ] **Step 3:** Complete "Working style" and set a contract-to-hire preference (Open) to show up in more searches.
- [ ] **Step 4: Check** — Upwork's profile-completeness meter is at 100%.
