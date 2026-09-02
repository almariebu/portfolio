"use client";

import { tools } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";
import { useRole } from "@/components/RoleContext";

export function Tools() {
  const { role } = useRole();

  return (
    <section className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Tools & Technologies"
          title="The stack I work with every day."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((group) => {
            const related =
              group.id === "systems"
                ? true
                : role === null || group.id === role;

            return (
              <div
                key={group.category}
                className={`transition duration-300 ${
                  related ? "opacity-100" : "opacity-35"
                }`}
              >
                <h3 className="font-display text-sm font-semibold tracking-[0.12em] text-accent uppercase">
                  {group.category}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-ink/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
