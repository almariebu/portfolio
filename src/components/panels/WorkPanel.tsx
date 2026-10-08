"use client";

import Image from "next/image";
import Link from "next/link";
import { caseStudies, screenshotNote, type CaseStudy } from "@/lib/content";

export function WorkPanel({
  slug,
  onSlug,
}: {
  slug: string;
  onSlug: (slug: string) => void;
}) {
  const featured = caseStudies.filter((study) => study.featured);
  const more = caseStudies.filter((study) => !study.featured);

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Work</p>
        <h2 className="mt-2 font-display text-[clamp(1.35rem,2vw,1.85rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-night-ink">
          Selected work
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-night-ink">
          Three projects from the school system. More of the work is below.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {featured.map((study) => (
          <StudyArticle key={study.slug} study={study} />
        ))}
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-night-ink">More work</h3>
        <div className="mt-3 flex flex-col gap-2">
          {more.map((study) => (
            <details
              key={study.slug}
              open={study.slug === slug}
              className="rounded-2xl border border-night-line bg-night-soft"
            >
              <summary
                className="cursor-pointer list-none px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden"
                onClick={(event) => {
                  event.preventDefault();
                  onSlug(study.slug === slug ? featured[0].slug : study.slug);
                }}
              >
                <span className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                  {study.category}
                </span>
                <span className="mt-1 block font-display text-base font-semibold text-night-ink">
                  {study.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-night-muted">
                  {study.summary}
                </span>
                <span className="mt-2 block text-sm font-semibold text-gold">
                  {study.slug === slug ? "Hide" : "Show"}
                </span>
              </summary>
              <div className="border-t border-night-line px-4 py-4 sm:px-5">
                <StudyBody study={study} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyArticle({ study }: { study: CaseStudy }) {
  return (
    <article className="rounded-2xl border border-night-line bg-night-soft">
      {study.image ? <StudyImage study={study} /> : null}
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {study.category}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold leading-snug tracking-tight text-night-ink">
            {study.title}
          </h3>
        </div>
        <StudyBody study={study} />
      </div>
    </article>
  );
}

function StudyImage({ study }: { study: CaseStudy }) {
  return (
    <figure className="border-b border-night-line">
      <Image
        src={study.image!}
        alt={study.imageAlt ?? study.title}
        width={1400}
        height={900}
        className="h-44 w-full object-cover object-left-top sm:h-52"
      />
      <figcaption className="px-4 py-2 text-sm leading-snug text-night-muted sm:px-5">
        {screenshotNote}
      </figcaption>
    </figure>
  );
}

function StudyBody({ study }: { study: CaseStudy }) {
  return (
    <div className="space-y-4">
      <section>
        <h4 className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Problem</h4>
        <p className="mt-2 text-sm leading-relaxed text-night-ink">{study.problem}</p>
      </section>
      <section>
        <h4 className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          What I did
        </h4>
        <ul className="mt-2 space-y-2">
          {study.responsibility.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-night-ink">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h4 className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Result</h4>
        <p className="mt-2 text-sm leading-relaxed text-night-ink">{study.improvement}</p>
      </section>
      {study.demo ? (
        <p>
          <Link
            href={study.demo}
            className="inline-flex min-h-10 items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-night hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Try the live demo &rarr;
          </Link>
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-1.5">
        {study.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-night-line px-3 py-1 text-sm text-night-ink"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}
