"use client";

import { useRef, type KeyboardEvent } from "react";
import { roleMeta, roles } from "@/lib/content";
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
    <div>
      <div
        ref={listRef}
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Choose a discipline"
        onKeyDown={onKeyDown}
      >
        {roles.map((id, index) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`path-${id}`}
            aria-selected={role === id}
            aria-controls="main-content"
            tabIndex={role === id || (role === null && index === 0) ? 0 : -1}
            onClick={() => selectRole(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              role === id
                ? "bg-ink text-white"
                : "bg-surface-soft text-ink hover:bg-accent-soft"
            }`}
          >
            {roleMeta[id].label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {role
          ? `Viewing ${roleMeta[role].label} — click again to reset.`
          : "Choose a path to reframe the page."}
      </p>
    </div>
  );
}
