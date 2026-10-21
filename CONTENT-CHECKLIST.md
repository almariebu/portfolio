# Content checklist

All site copy lives in `src/lib/content.ts`. The CV is a separate file in
`public/` (`cv-developer.html` and `Almarie_Bullo_Developer_CV.pdf`) and must say
the same thing as the site. The Frappe / ERPNext CV was dropped; `/cv.html` and
its PDF redirect to the main CV (see `next.config.ts`).

## Confirmed

- Current role: **Product Owner, Livro Systems, Inc., January 2026 – Present.**
  The site and the CV agree. No restructuring note on either.
- Public contact: email, LinkedIn, GitHub on the site. The CV also lists a
  mobile number, WhatsApp and Telegram (owner-approved, 2026-10-07).
- Public address: `https://portfolio-almariebu.vercel.app`, open to logged-out
  visitors. `site.url` matches it; it drives the canonical URL, sitemap,
  robots.txt, OG image and structured data. The CV links to the same address.

## Open

- [ ] Case studies (`caseStudies`, 9 entries) are pending a demo site. They
      render only inside the Work panel, canonicalize to the home page and are
      not in the sitemap. Revisit once the demo exists.
- [ ] Case-study claims have no source ledger yet. Read each one as if an
      interviewer will ask about it.

## When something changes

- Role or dates: update `experience` and the `about` paragraphs/facts in
  `content.ts`, then the CV HTML file, then regenerate the PDF.
- Domain: update `site.url` in `content.ts`, then the portfolio link in the CV
  HTML file, then regenerate the PDF.
- Run `bash scripts/check-cv.sh public/cv-developer.html` after any CV edit.
