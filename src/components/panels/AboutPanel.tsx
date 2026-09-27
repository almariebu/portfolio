import { about, experience } from "@/lib/content";
import { PanelHeading } from "@/components/ui";

export function AboutPanel() {
  return (
    <div className="flex min-h-full flex-col gap-4 md:h-full md:min-h-0 md:overflow-hidden">
      <PanelHeading eyebrow={about.eyebrow} title={about.title} />

      <div className="grid gap-4 md:min-h-0 md:flex-1 md:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.72fr)] md:overflow-hidden">
        <div className="pane-scroll space-y-4 md:min-h-0 md:overflow-y-auto md:pr-1">
          {experience.map((group) => (
            <section key={group.org}>
              <h3 className="font-display text-sm font-semibold text-night-ink">
                {group.org}
              </h3>
              <p className="mt-0.5 text-xs text-night-muted">
                {group.org === "Livro Systems, Inc."
                  ? "Product Development"
                  : "Same company, before the rename"}
              </p>
              <ul className="mt-2 space-y-2">
                {group.roles.map((role) => (
                  <li key={`${group.org}-${role.title}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm text-night-ink">{role.title}</p>
                      <p className="shrink-0 text-right text-xs text-night-muted">
                        {role.dates}
                      </p>
                    </div>
                    {role.note ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-night-muted">
                        {role.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="space-y-3 border-t border-night-line pt-4">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-night-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="pane-scroll md:min-h-0 md:overflow-y-auto">
          <dl className="rounded-2xl border border-night-line bg-night-soft p-5">
            {about.facts.map((fact, index) => (
              <div
                key={fact.label}
                className={index === 0 ? "" : "mt-4 border-t border-night-line pt-4"}
              >
                <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-night-muted/70 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-night-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
