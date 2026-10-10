import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const styles: Record<Variant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-700",
  secondary: "border border-slate-300 text-slate-900 hover:bg-slate-100",
  danger: "bg-red-700 text-white hover:bg-red-600",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
