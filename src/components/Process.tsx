"use client";

import { processSteps } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";
import { useRole } from "@/components/RoleContext";

const roleEmphasis: Record<string, number[]> = {
  web: [1, 2, 3],
  frappe: [0, 2, 4],
};

export function Process() {
  const { role } = useRole();
  const emphasis = role ? roleEmphasis[role] : null;

  return (
    <section id="process" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="How I Work"
          title="From requirement to a working system"
          description="I take operational needs through build, launch, and ongoing maintenance."
        />

        <ol className="mt-14 divide-y divide-line border-y border-line">
          {processSteps.map((step, index) => {
            const highlighted = emphasis === null || emphasis.includes(index);

            return (
              <li
                key={step.id}
                className={`grid gap-3 py-6 transition duration-300 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline ${
                  highlighted ? "opacity-100" : "opacity-35"
                }`}
              >
                <span className="font-display text-sm text-accent">{step.id}</span>
                <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
