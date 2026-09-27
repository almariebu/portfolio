import Image from "next/image";
import { disciplines, site } from "@/lib/content";
import { PanelHeading } from "@/components/ui";

export function PracticePanel() {
  return (
    <div className="flex min-h-full flex-col gap-4 md:h-full md:min-h-0 md:overflow-hidden">
      <div className="flex items-center gap-3 md:hidden">
        <Image
          src={site.photo}
          alt="Portrait of Almarie Bu"
          width={663}
          height={1024}
          className="size-14 shrink-0 rounded-2xl object-cover object-[center_18%]"
        />
        <div>
          <p className="font-display text-sm font-semibold text-night-ink">{site.name}</p>
          <p className="text-xs text-night-muted">Web developer · ERPNext developer</p>
        </div>
      </div>

      <PanelHeading
        eyebrow="What I do"
        title="Two kinds of work, from the same job"
        description="Product Development at Livro Systems, Inc. School system for admission, enrollment, billing, and grading. ERP Livro for onboarding, offboarding, and user access."
      />

      <div className="grid gap-3 md:min-h-0 md:flex-1 md:grid-rows-2 md:overflow-hidden">
        {disciplines.map((discipline) => (
          <article
            key={discipline.id}
            className="flex flex-col rounded-2xl border border-night-line bg-night-soft p-4 md:min-h-0 md:overflow-y-auto md:p-5"
          >
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-night-muted uppercase">
              {discipline.label}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-night-ink">
              {discipline.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-night-muted">
              {discipline.description}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {discipline.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-full bg-night-raised px-2.5 py-1 text-[0.72rem] text-night-muted"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
