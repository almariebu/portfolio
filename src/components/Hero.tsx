"use client";

import { roleHeroCopy, site } from "@/lib/content";
import { useRole } from "@/components/RoleContext";
import { RolePaths } from "@/components/RolePaths";

export function Hero() {
  const { role } = useRole();
  const copy = roleHeroCopy[role ?? "studio"];

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,#dce7f0_0%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef2f5_0%,#f3f5f7_45%,#ebe7e1_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <p className="animate-rise font-display text-[clamp(2.5rem,9vw,4.75rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
          {site.name}
        </p>

        <div className="animate-rise-delay mt-10 flex w-full justify-center">
          <RolePaths />
        </div>

        <div key={role ?? "studio"} className="animate-fade mt-10 w-full max-w-2xl">
          <h1 className="font-display text-[clamp(1.25rem,3vw,1.85rem)] font-semibold leading-snug tracking-tight text-ink">
            {copy.headline}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {copy.support}
          </p>
        </div>

        <div className="animate-rise-delay-2 mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#work"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-surface px-5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
          >
            Let’s Work Together
          </a>
        </div>
      </div>
    </section>
  );
}
