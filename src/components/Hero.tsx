"use client";

import Image from "next/image";
import { roleHeroCopy, site } from "@/lib/content";
import { useRole } from "@/components/RoleContext";
import { RolePaths } from "@/components/RolePaths";

export function Hero() {
  const { role } = useRole();
  const copy = roleHeroCopy[role ?? "default"];

  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,20rem)] lg:gap-16">
        <div className="order-2 text-left lg:order-1">
          <p className="animate-rise text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
            Web Developer × ERP Developer
          </p>

          <p className="animate-rise mt-4 font-display text-[clamp(3rem,8vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-ink">
            {site.name}
          </p>

          <div key={role ?? "default"} className="animate-fade mt-7 max-w-xl">
            <h1 className="font-display text-[clamp(1.35rem,2.6vw,1.85rem)] font-medium leading-snug tracking-tight text-ink">
              {copy.headline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {copy.support}
            </p>
          </div>

          <div className="animate-rise-delay mt-8">
            <RolePaths />
          </div>

          <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-accent"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-ink underline-offset-4 transition hover:underline"
            >
              Let’s work together
            </a>
          </div>
        </div>

        <div className="animate-rise-delay order-1 mx-auto w-full max-w-[18rem] lg:order-2 lg:mx-0 lg:max-w-none">
          <div className="relative">
            <div
              className="absolute -right-3 top-5 bottom-[-0.75rem] left-5 -z-10 bg-ink"
              aria-hidden="true"
            />
            <div className="overflow-hidden bg-surface-soft">
              <Image
                src={site.photo}
                alt="Portrait of Almarie Bu"
                width={663}
                height={1024}
                priority
                className="aspect-[4/5] w-full object-cover object-[50%_12%]"
              />
            </div>
          </div>
          <p className="mt-5 text-center text-[0.7rem] font-semibold tracking-[0.18em] text-muted uppercase lg:text-left">
            Frappe · ERPNext · Python
          </p>
        </div>
      </div>
    </section>
  );
}
