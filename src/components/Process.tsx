"use client";

import { processSteps } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";
import { useRole } from "@/components/RoleContext";

const roleEmphasis: Record<string, number[]> = {
  product: [0, 1, 3],
  web: [1, 2, 3],
  frappe: [0, 2, 4],
};

export function Process() {
  const { role } = useRole();
  const emphasis = role ? roleEmphasis[role] : null;

  return (
    <section id="process" className="bg-surface-soft/50 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Selected Work"
          title="From Idea to Production"
          description="I approach projects across the complete product lifecycle."
        />

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => {
            const highlighted =
              emphasis === null || emphasis.includes(index);

            return (
              <li
                key={step.id}
                className={`rounded-xl border border-line bg-surface p-5 transition duration-300 ${
                  highlighted ? "opacity-100" : "opacity-35"
                }`}
              >
                <span className="font-display text-sm font-semibold text-accent">
                  {step.id}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
