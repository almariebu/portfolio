import Image from "next/image";
import { disciplines, site } from "@/lib/content";
import { PanelHeading } from "@/components/ui";

export function PracticePanel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 md:hidden">
        <Image
          src={site.photo}
          alt="Portrait of Almarie Bullo"
          width={663}
          height={1024}
          className="size-14 shrink-0 rounded-2xl object-cover object-[center_18%]"
        />
        <div>
          <p className="font-display text-sm font-semibold text-night-ink">{site.name}</p>
          <p className="text-xs text-night-muted">{site.roles.join(" · ")}</p>
        </div>
      </div>

      <PanelHeading
        eyebrow="What I do"
        title="Web applications, from the interface to the database"
      />

      <div className="grid gap-3">
        {disciplines.map((discipline) => (
          <article
            key={discipline.id}
            className="rounded-2xl border border-night-line bg-night-soft p-4 md:p-5"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
              {discipline.label}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-night-ink">
              {discipline.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-night-ink">
              {discipline.description}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {discipline.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-full bg-night-raised px-3 py-1 text-sm text-night-ink"
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
