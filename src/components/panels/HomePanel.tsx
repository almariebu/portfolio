"use client";

import { Identity } from "@/components/Identity";

export function HomePanel({
  onWork,
  onContact,
}: {
  onWork: () => void;
  onContact: () => void;
}) {
  return (
    <div className="min-h-full rounded-2xl bg-paper px-5 py-6 text-ink">
      <Identity variant="home" onWork={onWork} onContact={onContact} />
    </div>
  );
}
