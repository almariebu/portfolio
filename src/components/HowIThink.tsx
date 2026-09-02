"use client";

import { principles } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";

export function HowIThink() {
  return (
    <section className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow="How I Think" title="Principles that shape the work." />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item) => (
            <div key={item.title} className="border-t border-line pt-5">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
