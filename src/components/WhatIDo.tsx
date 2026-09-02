"use client";

import { disciplines, roles } from "@/lib/content";
import { useRole } from "@/components/RoleContext";
import { SectionIntro } from "@/components/SectionIntro";

export function WhatIDo() {
  const { role } = useRole();

  return (
    <section id="services" className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="What I Do"
          title="Web applications and ERP systems."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {roles.map((id) => {
            const item = disciplines[id];
            const dimmed = role !== null && role !== id;

            return (
              <article
                key={id}
                className={`transition duration-300 ${dimmed ? "opacity-40" : "opacity-100"}`}
              >
                <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {item.focus.map((focus) => (
                    <li key={focus} className="text-sm text-ink/80">
                      {focus}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
