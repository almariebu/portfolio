# Content checklist

Everything below is a real claim about you that I could not invent. All of it
lives in `src/lib/content.ts`.

## How placeholders work

There are two kinds, and both are deliberately visible:

- **`null` values** render as a dashed em-dash box on the page. Hovering shows a
  hint like `Needs content — e.g. 60%`. Replace `null` with a string.
- **`TODO:` text** appears inline in prose paragraphs. Rewrite the sentence
  containing it in your own words.

Nothing false is on the page right now, but the gaps *are* visible to visitors.
Fill these in before sharing the link widely.

To find everything still outstanding:

```bash
rg 'null|TODO:' src/lib/content.ts
```

## 1. Identity and contact — `site`

- [ ] `email` — currently `hello@almariebu.com`. Confirm or change.
- [ ] `linkedin` — currently a placeholder `https://linkedin.com`.
- [ ] `github` — currently a placeholder `https://github.com`.
- [ ] `location` — e.g. `"Manila, Philippines"`.
- [ ] `resume` — path to your CV, e.g. `"/almarie-bu-cv.pdf"` (drop the file in
      `public/`). Until set, the About section shows "CV available on request"
      instead of a download button.
- [ ] `url` — currently `https://almariebu.vercel.app`. Update if you attach a
      custom domain, since it drives canonical URLs, the sitemap, and OG tags.
- [ ] `availability` — the pill at the top of the hero.

## 2. Headline proof — `proofStats`

These four numbers sit high on the page and carry a lot of weight, so they need
to be defensible if someone asks in an interview.

- [ ] Years across product & delivery
- [ ] Products & systems shipped
- [ ] ERP implementations led
- [ ] Teams / users supported

## 3. Case studies — `caseStudies`

Five studies, each following Problem → Role → Approach → Solution → Result →
Tech stack. The methodology prose is written from your existing process notes and
should be broadly true, but **read every line and make it yours** — an
interviewer will ask about specifics.

For each of the five:

- [ ] `client` — the real name, or `"Confidential"` if you can't name it.
- [ ] `year` and `duration`.
- [ ] `problem` — replace the `TODO:` sentence with the real situation.
- [ ] `solution` — replace the `TODO:` bullet with what actually shipped.
- [ ] `results` — three metrics each. **The most important field on the site.**
- [ ] `stack` — I guessed based on your skills; correct it.
- [ ] Set `draft: false` once the above are done. This removes the amber "Draft"
      badge from the card and the case study page.

The five, in the order they appear:

| Slug | Angle |
| --- | --- |
| `erpnext-implementation` | ERP consulting + system implementation |
| `product-discovery-to-release` | Product ownership + discovery/requirements |
| `business-process-automation` | Business process improvement |
| `web-application` | Web development |
| `systems-integration` | Technical project + APIs |

If a study doesn't match real work, delete it or repoint it. Three real studies
beat five thin ones. The homepage, routing, and sitemap all read from this array,
so adding or removing entries needs no other code changes.

## 4. About — `about`

- [ ] Third paragraph is a `TODO:` — two or three sentences of your own story.
- [ ] `facts` — "Based in" and "Availability" are `null`.

## 5. Testimonials — `testimonials`

Currently three empty slots. The section shows dashed "Pending" cards until at
least one has both a `quote` and a `name`, then it switches to the real layout
and only renders filled entries. If you'd rather hide it entirely for now,
remove `<Testimonials />` from `src/app/page.tsx`.

## Not done yet

Two items from your list I deliberately left out:

- **Analytics** — you marked it "Later". When you want it, Vercel Analytics is
  the least effort: `npm i @vercel/analytics` and add `<Analytics />` to the root
  layout.
- **Project imagery** — the reference designs lean hard on screenshots, and the
  cards currently carry metrics instead. Real screenshots or UI mockups of your
  work would close most of the remaining visual gap.
