export function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[clamp(1.65rem,3.8vw,2.4rem)] font-medium leading-tight tracking-tight text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
