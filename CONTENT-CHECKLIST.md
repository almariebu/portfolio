# Content checklist

All site copy lives in `src/lib/content.ts`. The CVs are separate files in
`public/` (`cv.html`, `cv-developer.html` and their PDFs) and must say the same
thing as the site.

## Confirmed

- Current role: **Product Owner, Livro Systems, Inc., January 2026 – Present.**
  The site and all four CVs agree. No restructuring note on either.
- Public contact: email, LinkedIn, GitHub on the site. The CVs also list a
  mobile number, WhatsApp and Telegram (owner-approved, 2026-10-07).
- Public address: `https://portfolio-almariebu.vercel.app`, open to logged-out
  visitors. `site.url` matches it; it drives the canonical URL, sitemap,
  robots.txt, OG image and structured data, so change it if the domain changes.

## Open

- [ ] Case studies (`caseStudies`, 9 entries) are pending a demo site. They
      render only inside the Work panel, canonicalize to the home page and are
      not in the sitemap. Revisit once the demo exists.
- [ ] Case-study claims have no source ledger yet. Read each one as if an
      interviewer will ask about it.

## When something changes

- Role or dates: update `experience` and the `about` paragraphs/facts in
  `content.ts`, then both CV HTML files, then regenerate both PDFs.
- Run `bash scripts/check-cv.sh public/cv.html` and
  `bash scripts/check-cv.sh public/cv-developer.html` after any CV edit.
