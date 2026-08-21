"use client";

import { disciplines, roles, type RoleId } from "@/lib/content";
import { useRole } from "@/components/RoleContext";
import { SectionIntro } from "@/components/SectionIntro";

export function WhatIDo() {
  const { role, selectRole } = useRole();

  return (
    <section id="services" className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow="What I Do" title="Three disciplines. One workflow." />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {roles.map((id) => (
            <DisciplineCard
              key={id}
              id={id}
              selected={role === id}
              dimmed={role !== null && role !== id}
              onSelect={selectRole}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DisciplineCard({
  id,
  selected,
  dimmed,
  onSelect,
}: {
  id: RoleId;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: RoleId) => void;
}) {
  const item = disciplines[id];

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`rounded-xl border p-6 text-left transition duration-300 sm:p-7 ${
        selected
          ? "border-accent/35 bg-accent-soft"
          : "border-line bg-surface"
      } ${dimmed ? "opacity-40 hover:opacity-70" : "opacity-100"}`}
    >
      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
      <p className="mt-6 text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
        Focus
      </p>
      <ul className="mt-3 space-y-2">
        {item.focus.map((focus) => (
          <li key={focus} className="flex items-start gap-2 text-sm text-ink/80">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {focus}
          </li>
        ))}
      </ul>
    </button>
  );
}
