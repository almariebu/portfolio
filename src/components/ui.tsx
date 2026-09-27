import type { Pending } from "@/lib/content";

/**
 * Renders unfilled content as an obvious gap instead of inventing a value.
 * The `hint` surfaces on hover so it's clear what belongs here.
 */
export function PendingValue({
  value,
  hint,
  tone = "dark",
}: {
  value: Pending<string>;
  hint: string;
  tone?: "dark" | "light";
}) {
  if (value) return <>{value}</>;

  return (
    <span
      title={`Needs content — ${hint}`}
      className={`inline-block min-w-10 rounded border border-dashed px-1.5 align-middle text-center ${
        tone === "dark"
          ? "border-night-muted/50 text-night-muted/70"
          : "border-ink-muted/40 text-ink-muted/60"
      }`}
    >
      &mdash;
    </span>
  );
}

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`text-xs font-semibold tracking-[0.16em] uppercase ${
        tone === "dark" ? "text-gold" : "text-gold-deep"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  tone = "dark",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] ${
          tone === "dark" ? "text-night-ink" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            tone === "dark" ? "text-night-muted" : "text-ink-muted"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Tag({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        tone === "dark"
          ? "bg-night-raised text-night-ink"
          : "border border-paper-line bg-paper-soft text-ink-muted"
      }`}
    >
      {children}
    </span>
  );
}

export function PanelHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="max-w-3xl shrink-0">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 font-display text-[clamp(1.35rem,2vw,1.85rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-night-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-night-ink">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function DraftBadge() {
  return (
    <span
      title="This case study still has placeholder content to fill in."
      className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-gold uppercase"
    >
      Draft
    </span>
  );
}
