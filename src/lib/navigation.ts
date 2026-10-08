export const detailPanels = [
  { id: "practice", label: "What I do" },
  { id: "work", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const panelIds = ["home", ...detailPanels.map((panel) => panel.id)] as const;

export type PanelId = (typeof panelIds)[number];

export const workParts = [
  "overview",
  "problem",
  "approach",
  "shipped",
  "result",
] as const;

export type WorkPart = (typeof workParts)[number];

export function isPanelId(value: string | null | undefined): value is PanelId {
  return !!value && (panelIds as readonly string[]).includes(value);
}

export function isWorkPart(value: string | null | undefined): value is WorkPart {
  return !!value && (workParts as readonly string[]).includes(value);
}

const hashAliases: Record<string, PanelId> = {
  home: "home",
  "what-i-do": "practice",
  practice: "practice",
  work: "work",
  "product-thinking": "practice",
  process: "practice",
  skills: "practice",
  erp: "practice",
  about: "about",
  testimonials: "about",
  contact: "contact",
};

/** Old in-page anchors (`/#work`) still open the matching tab. */
export function panelFromHash(hash: string): {
  panel: PanelId;
  study: string | null;
} | null {
  const raw = hash.replace(/^#/, "");
  if (!raw) return null;
  const [head, study] = raw.split("/");
  const panel = hashAliases[head];
  if (!panel) return null;
  return {
    panel,
    study: panel === "work" && study ? study : null,
  };
}

export function panelHref(
  panel: PanelId,
  study: string | null,
  part: WorkPart,
) {
  if (panel === "home") return "/";
  const params = new URLSearchParams();
  params.set("panel", panel);
  if (panel === "work" && study) {
    params.set("study", study);
    if (part !== "overview") params.set("part", part);
  }
  return `/?${params.toString()}`;
}

export function workHref(study: string, part: WorkPart) {
  return panelHref("work", study, part);
}
