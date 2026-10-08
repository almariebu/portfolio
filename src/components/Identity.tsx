"use client";

import Image from "next/image";
import { site } from "@/lib/content";

export function Identity({
  variant,
  onWork,
  onContact,
}: {
  variant: "rail" | "home";
  onWork: () => void;
  onContact: () => void;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-full w-full flex-1 flex-col">
      <div className={variant === "home" ? "flex items-center gap-4" : "flex items-center gap-3"}>
        <Image
          src={site.photo}
          alt="Portrait of Almarie Bullo"
          width={663}
          height={1024}
          priority
          className="aspect-[4/5] w-28 shrink-0 rounded-2xl object-cover object-[center_18%]"
        />
        <div className="min-w-0">
          {variant === "rail" ? (
            <p className="font-display text-base font-semibold leading-tight tracking-tight text-ink">
              {site.name}
            </p>
          ) : (
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              {site.name}
            </p>
          )}
        </div>
      </div>

      {variant === "rail" ? (
        <h1 className="mt-6 font-display text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink xl:text-[1.95rem]">
          {site.headlineLead}{" "}
          <span className="text-gold-deep">{site.headlineAccent}</span>
        </h1>
      ) : (
        <p className="mt-5 font-display text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
          {site.headlineLead}{" "}
          <span className="text-gold-deep">{site.headlineAccent}</span>
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{site.intro}</p>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-ink">{site.availability}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {site.roles.map((role) => (
          <li
            key={role}
            className="rounded-full border border-paper-line bg-white/70 px-3 py-1 text-sm font-semibold text-ink"
          >
            {role}
          </li>
        ))}
      </ul>

      <div className="pt-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onWork}
            className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper transition hover:bg-gold-deep"
          >
            See the projects
          </button>
          <button
            type="button"
            onClick={onContact}
            className="inline-flex min-h-10 items-center rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink transition hover:border-gold-deep hover:text-gold-deep"
          >
            Contact me
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 text-sm font-semibold [&>a]:py-1">
          <a
            href={`mailto:${site.email}`}
            className="text-gold-deep transition hover:text-ink"
          >
            {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-muted transition hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-muted transition hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-muted transition hover:text-ink"
          >
            CV (ERP)
          </a>
          <a
            href={site.resumeDeveloper}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-muted transition hover:text-ink"
          >
            Developer CV
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          &copy; {year} {site.name}
        </p>
      </div>
    </div>
  );
}
