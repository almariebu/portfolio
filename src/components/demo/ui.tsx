import Link from "next/link";

export const inputClass =
  "w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-deep";

const btnBase =
  "inline-flex min-h-10 items-center justify-center rounded-md px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  primary: `${btnBase} bg-ink text-paper hover:bg-ink/85`,
  gold: `${btnBase} bg-gold-deep text-white hover:bg-gold-deep/90`,
  ghost: `${btnBase} border border-paper-line bg-white text-ink hover:bg-paper-soft`,
  danger: `${btnBase} border border-red-700 bg-white text-red-800 hover:bg-red-50`,
};

export function DemoShell({
  title,
  intro,
  tryThis,
  backHref,
  onReset,
  children,
}: {
  title: string;
  intro: string;
  tryThis: string[];
  backHref: string;
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pane-scroll h-full overflow-y-auto bg-night text-night-ink">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href={backHref}
          className="text-sm font-medium text-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          &larr; Back to the case study
        </Link>
        <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          Live demo
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-night-muted sm:text-base">
          {intro}
        </p>
        <div className="mt-5 max-w-3xl rounded-xl border border-night-line bg-night-soft p-4">
          <h2 className="text-sm font-semibold text-night-ink">Try this</h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-night-muted">
            {tryThis.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div className="mt-6 text-ink">{children}</div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-night-muted">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-night-line px-3.5 py-2 font-semibold text-night-ink hover:bg-night-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Reset demo
          </button>
          <span>Changes are saved in this browser only.</span>
        </div>
      </div>
    </div>
  );
}

export function Desk({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-paper-line bg-paper p-3 shadow-sm sm:p-5">
      {children}
    </div>
  );
}

export function RoleSwitcher({
  label = "Logged in as",
  roles,
  value,
  onChange,
}: {
  label?: string;
  roles: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="role-switcher" className="text-sm font-semibold">
        {label}
      </label>
      <select
        id="role-switcher"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} !w-auto min-w-48`}
      >
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-paper-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-paper-line px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

const pillTone: Record<string, string> = {
  Draft: "bg-paper-soft text-ink-muted",
  "Pending Dean": "bg-amber-100 text-amber-900",
  "Pending Registrar": "bg-amber-100 text-amber-900",
  "Pending Finance": "bg-sky-100 text-sky-900",
  Enrolled: "bg-emerald-100 text-emerald-900",
  Active: "bg-emerald-100 text-emerald-900",
  Withdrawn: "bg-paper-soft text-ink-muted",
  Rejected: "bg-red-100 text-red-900",
};

export function Pill({ children }: { children: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        pillTone[children] ?? "bg-paper-soft text-ink-muted"
      }`}
    >
      {children}
    </span>
  );
}

/** Errors are announced immediately; notices politely. Both regions stay mounted. */
export function Messages({
  error,
  notice,
}: {
  error: string | null;
  notice: string | null;
}) {
  return (
    <div className="space-y-2">
      <div role="alert" aria-live="assertive">
        {error ? (
          <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
            <strong>Error:</strong> {error}
          </p>
        ) : null}
      </div>
      <div role="status" aria-live="polite">
        {notice ? (
          <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export { fmtMoney as money } from "@/lib/demo/logic";
