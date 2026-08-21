"use client";

import { useRef, type KeyboardEvent } from "react";
import { roleMeta, roles, type RoleId } from "@/lib/content";
import { useRole } from "@/components/RoleContext";

export function RolePaths() {
  const { role, selectRole, setRole } = useRole();
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = role ? roles.indexOf(role) : -1;
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % roles.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex =
        currentIndex < 0
          ? roles.length - 1
          : (currentIndex - 1 + roles.length) % roles.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = roles.length - 1;
    } else {
      return;
    }

    setRole(roles[nextIndex]);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <p
        className="mb-4 text-center text-[0.7rem] font-semibold tracking-[0.24em] text-muted sm:text-xs"
        aria-hidden="true"
      >
        PRODUCT <span className="text-accent/70">×</span> CODE{" "}
        <span className="text-accent/70">×</span> ERP
      </p>

      <div
        ref={listRef}
        className="grid grid-cols-1 gap-2 rounded-xl border border-line bg-surface p-2 shadow-[0_1px_2px_rgba(26,35,50,0.04)] sm:grid-cols-3"
        role="tablist"
        aria-label="Choose a discipline"
        onKeyDown={onKeyDown}
      >
        {roles.map((id, index) => (
          <RolePathButton
            key={id}
            id={id}
            active={role === id}
            tabbable={role === id || (role === null && index === 0)}
            onSelect={selectRole}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-muted" aria-live="polite">
        {role
          ? `Viewing through ${roleMeta[role].label} — click again to reset.`
          : "Select a path to reshape the page."}
      </p>
    </div>
  );
}

function RolePathButton({
  id,
  active,
  tabbable,
  onSelect,
}: {
  id: RoleId;
  active: boolean;
  tabbable: boolean;
  onSelect: (id: RoleId) => void;
}) {
  const meta = roleMeta[id];
  const [line1, line2] = splitTitle(meta.label);

  return (
    <button
      type="button"
      role="tab"
      id={`path-${id}`}
      aria-selected={active}
      aria-controls="studio-content"
      tabIndex={tabbable ? 0 : -1}
      onClick={() => onSelect(id)}
      className={`flex min-h-[5.25rem] flex-col items-center justify-center rounded-lg px-4 py-4 text-center transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        active
          ? "bg-accent-soft ring-1 ring-accent/30"
          : "hover:bg-surface-soft/70"
      }`}
    >
      <span className="block font-display text-[0.65rem] font-semibold tracking-[0.2em] text-accent">
        {meta.path}
      </span>
      <span className="mt-2 block font-display text-base font-semibold leading-tight tracking-tight text-ink sm:text-lg">
        {line1}
        <br />
        {line2}
      </span>
    </button>
  );
}

function splitTitle(label: string): [string, string] {
  if (label === "Product Owner") return ["Product", "Owner"];
  if (label === "Web Developer") return ["Web", "Developer"];
  return ["Frappe", "Consultant"];
}
