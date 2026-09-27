"use client";

import Image from "next/image";
import { caseStudies, screenshotNote, type CaseStudy } from "@/lib/content";
import { workHref } from "@/lib/navigation";
import { PanelHeading } from "@/components/ui";

export function WorkPanel({
  slug,
  onSlug,
}: {
  slug: string;
  onSlug: (slug: string) => void;
}) {
  const study = caseStudies.find((item) => item.slug === slug) ?? caseStudies[0];

  function selectStudy(event: React.MouseEvent<HTMLAnchorElement>, next: string) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onSlug(next);
  }

  return (
    <div className="flex min-h-full flex-col gap-4 md:h-full md:min-h-0 md:overflow-hidden">
      <PanelHeading
        eyebrow="Work"
        title="Livro Systems, Inc."
        description="School system from 2020 to now: admission, enrollment, billing, and grading. ERP Livro is the internal employee process."
      />

      <div className="grid gap-3 md:min-h-0 md:flex-1 md:grid-cols-[minmax(0,14.5rem)_minmax(0,1fr)] md:overflow-hidden">
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:min-h-0 md:flex-col md:overflow-y-auto md:pb-0 [&::-webkit-scrollbar]:hidden">
          {caseStudies.map((item) => {
            const selected = item.slug === study.slug;
            return (
              <li key={item.slug} className="shrink-0 md:shrink">
                <a
                  href={workHref(item.slug, "overview")}
                  aria-current={selected ? "true" : undefined}
                  onClick={(event) => selectStudy(event, item.slug)}
                  className={`block w-52 rounded-xl border px-3 py-2.5 transition md:w-full ${
                    selected
                      ? "border-gold/50 bg-night-raised"
                      : "border-night-line bg-night-soft hover:border-gold/30"
                  }`}
                >
                  <span className="text-[0.62rem] font-semibold tracking-[0.14em] text-gold uppercase">
                    {item.category}
                  </span>
                  <span className="mt-1.5 block font-display text-sm font-semibold leading-snug text-night-ink">
                    {item.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <StudyDetail study={study} />
      </div>
    </div>
  );
}

function StudyDetail({ study }: { study: CaseStudy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-night-line bg-night-soft md:min-h-0 md:overflow-hidden">
      {study.image ? (
        <figure className="shrink-0 border-b border-night-line">
          <Image
            src={study.image}
            alt={study.imageAlt ?? study.title}
            width={1400}
            height={900}
            className="h-36 w-full object-cover object-left-top sm:h-40"
          />
          <figcaption className="px-4 py-2 text-[0.7rem] leading-snug text-night-muted sm:px-5">
            {screenshotNote}
          </figcaption>
        </figure>
      ) : null}
      <div className="pane-scroll space-y-4 px-4 py-4 sm:px-5 sm:py-5 md:min-h-0 md:flex-1 md:overflow-y-auto">
        <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-night-ink">
          {study.title}
        </h3>
        <p className="text-sm leading-relaxed text-night-muted">{study.summary}</p>
        <div>
          <h4 className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold uppercase">
            What I did
          </h4>
          <ul className="mt-2 space-y-2">
            {study.did.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-night-muted">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm leading-relaxed text-night-ink">{study.outcome}</p>
        <ul className="flex flex-wrap gap-1.5">
          {study.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-night-line px-2.5 py-1 text-[0.72rem] text-night-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
