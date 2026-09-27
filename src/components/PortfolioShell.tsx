"use client";

import { useEffect, useRef, useState } from "react";
import { caseStudies, site } from "@/lib/content";
import {
  detailPanels,
  isPanelId,
  isWorkPart,
  panelFromHash,
  panelHref,
  type PanelId,
  type WorkPart,
} from "@/lib/navigation";
import { Identity } from "@/components/Identity";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { ContactPanel } from "@/components/panels/ContactPanel";
import { HomePanel } from "@/components/panels/HomePanel";
import { PracticePanel } from "@/components/panels/PracticePanel";
import { WorkPanel } from "@/components/panels/WorkPanel";

const tabs: { id: PanelId; label: string }[] = [
  { id: "home", label: "Home" },
  ...detailPanels,
];

function resolvedStudy(slug: string | null) {
  return caseStudies.some((study) => study.slug === slug)
    ? slug!
    : caseStudies[0].slug;
}

function writeUrl(
  panel: PanelId,
  study: string | null,
  part: WorkPart,
  mode: "push" | "replace",
) {
  const url = new URL(window.location.href);
  url.hash = "";
  if (panel === "home") {
    url.searchParams.delete("panel");
    url.searchParams.delete("study");
    url.searchParams.delete("part");
  } else {
    url.searchParams.set("panel", panel);
    if (panel === "work" && study) {
      url.searchParams.set("study", study);
      if (part !== "overview") url.searchParams.set("part", part);
      else url.searchParams.delete("part");
    } else {
      url.searchParams.delete("study");
      url.searchParams.delete("part");
    }
  }

  const next = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (next === current && window.location.hash === "") return;

  const state = { panel, study, part };
  if (mode === "push") window.history.pushState(state, "", next);
  else window.history.replaceState(state, "", next);
}

function readUrl(): { panel: PanelId; study: string | null; part: WorkPart } {
  const params = new URLSearchParams(window.location.search);
  const rawPanel = params.get("panel");
  const panel = isPanelId(rawPanel) ? rawPanel : "practice";
  const rawPart = params.get("part");
  return {
    panel,
    study: params.get("study"),
    part: isWorkPart(rawPart) ? rawPart : "overview",
  };
}

function revealTab(id: PanelId) {
  const tab = document.getElementById(`tab-${id}`);
  const parent = tab?.parentElement;
  if (!tab || !parent) return;
  const left = tab.offsetLeft;
  const right = left + tab.offsetWidth;
  if (left < parent.scrollLeft) parent.scrollLeft = Math.max(0, left - 12);
  else if (right > parent.scrollLeft + parent.clientWidth) {
    parent.scrollLeft = right - parent.clientWidth + 12;
  }
}

function desktopHomeToPractice(panel: PanelId) {
  if (typeof window === "undefined") return panel;
  const desktop = window.matchMedia("(min-width: 48rem)").matches;
  return desktop && panel === "home" ? "practice" : panel;
}

export function PortfolioShell({
  initialPanel,
  initialStudy,
  initialPart,
}: {
  initialPanel: PanelId;
  initialStudy: string | null;
  initialPart: WorkPart;
}) {
  const [panel, setPanel] = useState<PanelId>(initialPanel);
  const [study, setStudy] = useState(resolvedStudy(initialStudy));
  const [part, setPart] = useState<WorkPart>(initialPart);
  const panelRef = useRef(panel);
  panelRef.current = panel;

  useEffect(() => {
    const fromHash = panelFromHash(window.location.hash);
    if (fromHash) {
      const next = desktopHomeToPractice(fromHash.panel);
      setPanel(next);
      if (fromHash.study) setStudy(resolvedStudy(fromHash.study));
      writeUrl(
        next,
        next === "work" ? resolvedStudy(fromHash.study) : null,
        "overview",
        "replace",
      );
    }

    const onPop = () => {
      const next = readUrl();
      const resolved = desktopHomeToPractice(next.panel);
      setPanel(resolved);
      setStudy(resolvedStudy(next.study));
      setPart(next.part);
    };

    const desktop = window.matchMedia("(min-width: 48rem)");
    const onDesktop = () => {
      if (desktop.matches && panelRef.current === "home") {
        setPanel("practice");
        writeUrl("practice", null, "overview", "replace");
      }
    };

    window.addEventListener("popstate", onPop);
    desktop.addEventListener("change", onDesktop);
    onDesktop();
    return () => {
      window.removeEventListener("popstate", onPop);
      desktop.removeEventListener("change", onDesktop);
    };
  }, []);

  function selectPanel(next: PanelId) {
    const resolved = desktopHomeToPractice(next);
    setPanel(resolved);
    writeUrl(resolved, resolved === "work" ? study : null, part, "push");
    revealTab(resolved);
  }

  function selectStudy(next: string) {
    setStudy(next);
    setPart("overview");
    setPanel("work");
    writeUrl("work", next, "overview", "push");
  }

  function onTabClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: PanelId,
  ) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    selectPanel(id);
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const list = event.currentTarget.parentElement;
    if (!list) return;
    const visible = Array.from(
      list.querySelectorAll<HTMLAnchorElement>('[role="tab"]'),
    ).filter((tab) => tab.offsetParent !== null);
    const index = visible.indexOf(event.currentTarget);
    if (index < 0) return;
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % visible.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + visible.length) % visible.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = visible.length - 1;
    const id = visible[nextIndex]?.dataset.panel;
    if (!isPanelId(id)) return;
    selectPanel(id);
    document.getElementById(`tab-${id}`)?.focus();
  }

  const shown: PanelId = panel === "home" ? "home" : panel;

  return (
    <div className="portfolio-frame">
      <a
        href="#stage"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to section
      </a>

      <header className="area-header flex items-center justify-between gap-3 border-b-2 border-gold bg-paper px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => selectPanel("home")}
          className="flex min-w-0 items-center gap-2.5 text-left"
        >
          <img
            src={site.photo}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full object-cover object-[center_18%]"
          />
          <span className="min-w-0">
            <h1 className="truncate font-display text-xs font-semibold tracking-[0.14em] text-ink uppercase">
              {site.name}
            </h1>
            <span className="block truncate text-[0.7rem] text-ink-muted">
              {site.headlineLead} {site.headlineAccent}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => selectPanel("contact")}
          className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-ink px-3.5 text-xs font-semibold text-paper"
        >
          Contact
        </button>
      </header>

      <aside className="area-rail relative hidden bg-paper text-ink md:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_0%_0%,#f6eeda_0%,transparent_58%)]"
        />
        <div className="rail-scroll relative flex h-full min-h-0 w-full flex-col overflow-y-auto px-7 py-7 xl:px-8">
          <Identity
            variant="rail"
            onWork={() => selectPanel("work")}
            onContact={() => selectPanel("contact")}
          />
        </div>
      </aside>

      <main className="area-main flex min-h-0 flex-col bg-night text-night-ink">
        <div
          role="tablist"
          aria-label="Portfolio sections"
          aria-orientation="horizontal"
          className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-night-line px-3 py-3 [scrollbar-width:none] md:px-5 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const active = panel === tab.id;
            return (
              <a
                key={tab.id}
                id={`tab-${tab.id}`}
                href={panelHref(tab.id, study, part)}
                role="tab"
                data-panel={tab.id}
                aria-selected={active}
                aria-controls="stage"
                tabIndex={active ? 0 : -1}
                onClick={(event) => onTabClick(event, tab.id)}
                onKeyDown={onTabKeyDown}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  tab.id === "home" ? "md:hidden" : ""
                } ${
                  active
                    ? "bg-gold text-night"
                    : tab.id === "contact"
                      ? "text-gold ring-1 ring-gold/40 hover:bg-gold/10"
                      : "text-night-muted hover:bg-night-raised hover:text-night-ink"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        <div
          id="stage"
          role="tabpanel"
          aria-labelledby={`tab-${shown}`}
          tabIndex={0}
          className="stage-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 outline-none sm:p-5 md:overflow-hidden md:p-6"
        >
          <div key={shown} className="panel-in h-full min-h-full md:min-h-0">
            {shown === "home" ? (
              <HomePanel
                onWork={() => selectPanel("work")}
                onContact={() => selectPanel("contact")}
              />
            ) : null}
            {shown === "practice" ? <PracticePanel /> : null}
            {shown === "work" ? (
              <WorkPanel slug={study} onSlug={selectStudy} />
            ) : null}
            {shown === "about" ? <AboutPanel /> : null}
            {shown === "contact" ? <ContactPanel /> : null}
          </div>
        </div>
      </main>
    </div>
  );
}
