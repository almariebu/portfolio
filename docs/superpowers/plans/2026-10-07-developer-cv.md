# Developer CV (CV #2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a second ATS-friendly, 2-page CV aimed at Senior Web / Full-Stack / Software / Application / Backend / Python / JavaScript developer roles, written only from the uploaded CV, and publish it beside CV #1 as an HTML page with a PDF download.

**Architecture:** One static page `public/cv-developer.html`. It copies the markup and CSS of `public/cv.html` (CV #1) and swaps the content. The PDF is printed from that page with headless Chrome. A plain-text check script confirms the page has no forbidden content and contains the required keywords.

**Tech Stack:** Static HTML/CSS in the Next.js `public/` folder, headless Google Chrome for the PDF, PDFKit via `swift -e` to count pages, and `grep` for the checks.

**Spec:** The user's CV #2 brief in this conversation. The only source of facts is `/Users/almariebullo/Downloads/Almarie_Bullo_Web_Developer_CV.pdf`, which is summarized under "Source facts" below.

## Global Constraints

- Every claim must trace to a line in **Source facts**. No invented experience, metrics, technologies or responsibilities.
- Header title, verbatim: `Senior Web Developer | Python | JavaScript | Frappe | ERPNext`
- Contact details: `almariebullo@gmail.com`, `Mobile +63 905 964 8728 · WhatsApp · Telegram @almariebu`, LinkedIn `https://www.linkedin.com/in/almarie-alim-bullo/`, GitHub `https://github.com/almarieeebu`, Portfolio `https://portfolio-iota-two-fvnb10jumo.vercel.app/` (the same values used in CV #1).
- Drop the "Web Developer, Livro Systems, September 2026 – Present" entry. Treat "Product Owner, Livro Systems, Inc. · January 2026 – Present" as the current role.
- Never mention restructuring, a September 2026 role change, or the word "restructuring".
- Banned words: passionate, dynamic, results-driven, innovative, rockstar, ninja, synergy.
- Section headings, in this order: Professional Summary, Technical Skills, Professional Experience, Selected Systems / Project Experience.
- Leave out Education and Certifications. The source CV has neither, so the section would have to be invented. Flag this to the user rather than filling it in.
- ATS rules: a single column, no tables, no images or icons, no skill bars, and selectable text.
- The PDF must be exactly 2 pages or fewer, on A4.
- Development comes first. The Product Owner role keeps its real title, but its bullets lead with technical delivery.
- Do not describe her as "Full-Stack" or "Backend" in the title or summary. The source does not use those labels. Matching the job titles comes from the keywords for the underlying skills, not from new titles.

## Source facts (complete; nothing else may be used)

- Headline: Web Developer | Python, JavaScript, Frappe & ERPNext · Product Development
- Summary: 6+ years developing school management and ERP systems. Python, JavaScript, Frappe, ERPNext. Enrollment, billing, payment allocation, grading, employee access workflows. Career progression includes senior development and product ownership.
- Availability: remote contract/freelance work, flexible or evening hours, Philippine time (UTC+8)
- Skills, School systems: Admission, enrollment, pre-enrollment, grading, grade slips, matriculation
- Skills, ERP: ERPNext, Frappe, ERP Livro, onboarding and offboarding, user access, role permissions
- Skills, Billing and payments: Tellering, fee allocation, discounts, statements of account, online payments, SMS billing
- Skills, Engineering: Python, JavaScript, REST APIs, Git, MariaDB, Linux, Docker, CI/CD
- Livro Systems (folded into the Product Owner role from the dropped entry): develop and maintain features on the school management system and ERP Livro, including employee onboarding, offboarding and user access requests. Maintain online enrollment forms and payment allocation. Updated the SMS billing gateway from Smart to Globe.
- Product Owner, Livro Systems, Inc., Jan 2026 – Present: owned the school management system and ERP Livro and continued delivery with the team. Delivered updates for enrollment status, tellering, billing, and SMS sent from the school system.
- Senior Web Developer, Wela School Systems, Feb 2024 – Dec 2025: tellering and billing (payment status, fee allocation, matriculation, discounts, statements of account). Pre-enrollment and enrollment for basic education and college, including enrollment status. Maintained grading and SMS billing. Configured access for finance and registrar users.
- Mid-Senior Web Developer, Wela School Systems, Sep 2023 – Feb 2024: maintained school billing on live sites (ledger adjustments, discounts, statements of account). Updated matriculation so excess discounts are credited to previous balances.
- Junior Web Developer, Wela School Systems, Mar 2020 – Sep 2023: online enrollment forms for admissions (from 2020). Grade slips and grading rules. College billing (matriculation, fees, enrollment ledger).

## Review Focus

1. **Claim drift from rewording.** A phrase like "designed REST APIs" or "built CI/CD pipelines" turns a skill-list item into a responsibility the CV never states. REST APIs, MariaDB, Linux, Docker and CI/CD may appear only in Technical Skills and the "Technologies" line, never as verbs inside role bullets. This is pinned by Task 1, Step 2, check `no-tech-verbs`.
2. **Production-support claim.** The only evidence is "live sites" in the Mid-Senior role, plus "maintained" across the roles. Wording like "maintained features on live production systems" is fine. "24/7 on-call" or "incident response" is not. This is pinned by check `no-oncall`.
3. **Page overflow.** Adding Programming, Frameworks and Tools categories lengthens the skills section, which could push the PDF to 3 pages. This is pinned by Task 2, Step 2.
4. **Wrong role identity.** The Product Owner role must not turn into a product manager résumé, so it must not mention roadmaps, KPIs or OKRs. This is pinned by check `no-pm-terms`.
5. **Leaked removed role.** "September 2026" must not appear anywhere. This is pinned by check `no-sept-2026`.

---

### Task 1: Write the CV page and its content checks

**Files:**
- Create: `public/cv-developer.html`
- Create: `scripts/check-cv.sh`

**Interfaces:**
- Consumes: the markup and CSS of `public/cv.html`, copied verbatim. Change only `<title>` to `Almarie Bullo Developer CV`, the meta description, and the toolbar download link to `/Almarie_Bullo_Developer_CV.pdf`.
- Produces: `public/cv-developer.html`, served at `/cv-developer.html`. Also `scripts/check-cv.sh <html-file>`, which exits 0 when every check passes and prints the name of each check that fails.

- [ ] **Step 1: Write `scripts/check-cv.sh`.** It strips tags (`sed 's/<[^>]*>//g'`) and then runs these named checks:
  - `no-sept-2026`: no match for `September 2026`
  - `no-restructuring`: no match for `restructur` (case-insensitive)
  - `no-buzzwords`: no match for `passionate|dynamic|results-driven|innovative` (case-insensitive)
  - `no-tech-verbs`: no match for `(built|designed|developed|implemented|set up|configured) [^.]{0,40}(REST API|CI/CD|Docker|pipeline)` (case-insensitive)
  - `no-oncall`: no match for `on-call|24/7|incident` (case-insensitive)
  - `no-pm-terms`: no match for `roadmap|KPI|OKR` (case-insensitive)
  - `has-keywords`: each of `Python`, `JavaScript`, `Frappe`, `ERPNext`, `REST APIs`, `MariaDB`, `Git`, `Linux`, `Docker`, `CI/CD`, `production` is present
  - `has-progression`: the titles `Junior Web Developer`, `Mid-Senior Web Developer`, `Senior Web Developer` and `Product Owner` all appear
  - `no-tables`: the raw HTML has no `<table` or `<img`

- [ ] **Step 2: Run the script against a file that does not exist yet**

  Run: `bash scripts/check-cv.sh public/cv-developer.html`
  Expected: a non-zero exit, because the file is missing.

- [ ] **Step 3: Write `public/cv-developer.html`** with this content:
  - **Header:** the title from Global Constraints, then the contact lines.
  - **Professional Summary:** 3–4 sentences covering 6+ years of building and maintaining business web applications for school management and ERP; Python, JavaScript, Frappe and ERPNext; experience with REST APIs, MariaDB and supporting production systems; progression from Junior to Senior Web Developer; and current Product Owner work as an added strength.
  - **Technical Skills:**
    - Programming: Python, JavaScript
    - Frameworks: Frappe Framework
    - ERP: ERPNext, ERP Livro, Role Permissions, User Access Management
    - Databases: MariaDB
    - APIs: REST APIs, Online Payments, SMS Billing Gateway Integration
    - DevOps / Infrastructure: Linux, Docker, CI/CD
    - Tools: Git
    - Business Domains: Enrollment, Billing, Payments, Grading, Employee Workflows
  - **Professional Experience:** the four roles from Source facts in reverse order.
    - Product Owner gets 5–6 bullets. Lead with development and maintenance (onboarding, offboarding and user access; enrollment forms and payment allocation; the SMS gateway move from Smart to Globe). Then delivery (enrollment status, tellering, billing, SMS updates). End with one ownership bullet.
    - Senior Web Developer gets 4 bullets, Mid-Senior gets 2–3, and Junior gets 3.
    - Use the verbs built, maintained, updated, configured, migrated and delivered, each applied only to what the source states.
  - **Selected Systems / Project Experience:** four entries.
    - School Management System: Enrollment and Admissions
    - School Management System: Billing and Payment Processing
    - School Management System: Grading
    - ERP Livro: Employee Workflows and Access Management
    - Close with a "Technologies:" line.

- [ ] **Step 4: Run the checks**

  Run: `bash scripts/check-cv.sh public/cv-developer.html`
  Expected: exit 0 and no check names printed.

- [ ] **Step 5: Manual claim audit.** Read each bullet and match it to a Source facts line. Delete any bullet that has no match.

- [ ] **Step 6: Commit**

  ```bash
  git add public/cv-developer.html scripts/check-cv.sh
  git commit -m "Add developer-targeted CV page and content checks."
  ```

### Task 2: Generate the PDF and link it from the site

**Files:**
- Create: `public/Almarie_Bullo_Developer_CV.pdf`
- Modify: `src/components/Identity.tsx` and `src/components/panels/ContactPanel.tsx`. Next to the existing `CV` link, add a `Developer CV` link to `/cv-developer.html`.
- Modify: `src/lib/content.ts`. Add `resumeDeveloper: "/cv-developer.html"` to `site` and use it in both components.

**Interfaces:**
- Consumes: `public/cv-developer.html` from Task 1, and `site.resume` from CV #1.
- Produces: `site.resumeDeveloper: string`.

- [ ] **Step 1: Print the PDF**

  Run: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=public/Almarie_Bullo_Developer_CV.pdf "file://$PWD/public/cv-developer.html"`

- [ ] **Step 2: Check the page count and that the text is selectable**

  Run: `swift -e 'import PDFKit; let d=PDFDocument(url:URL(fileURLWithPath:"public/Almarie_Bullo_Developer_CV.pdf"))!; print(d.pageCount, d.string!.contains("ERPNext"))'`
  Expected: `2 true` (or `1 true`). If it prints 3, cut the shortest-value bullets and go back to Step 1.

- [ ] **Step 3: Add the links and the `resumeDeveloper` field.** Use the same anchor markup and classes as the existing `CV` links.

- [ ] **Step 4: Verify the build**

  Run: `npx tsc --noEmit && npm run lint && npm run build`
  Expected: all three succeed.

- [ ] **Step 5: Commit on `add-ats-cv`.** If that PR has already merged, commit on a new branch off `main` instead.

  ```bash
  git add public/Almarie_Bullo_Developer_CV.pdf src/lib/content.ts src/components/Identity.tsx src/components/panels/ContactPanel.tsx
  git commit -m "Link the developer CV and its PDF from the portfolio."
  ```

- [ ] **Step 6: Report to the user.** Return the finished CV content as text, as the brief asks. Note that Education and Certifications were left out because the source has neither.
