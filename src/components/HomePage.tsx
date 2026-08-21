"use client";

import { Suspense } from "react";
import { RoleProvider } from "@/components/RoleContext";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { WhatIDo } from "@/components/WhatIDo";
import { Process } from "@/components/Process";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { HowIThink } from "@/components/HowIThink";
import { Tools } from "@/components/Tools";
import { About } from "@/components/About";
import { Contact, SiteFooter } from "@/components/Contact";

function Studio() {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="studio-content">
        <Hero />
        <WhatIDo />
        <Process />
        <FeaturedProjects />
        <HowIThink />
        <Tools />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

export function HomePage() {
  return (
    <Suspense fallback={<StudioShell />}>
      <RoleProvider>
        <Studio />
      </RoleProvider>
    </Suspense>
  );
}

function StudioShell() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 pt-28 sm:px-8">
        <div className="mx-auto h-14 max-w-md animate-pulse rounded-lg bg-surface-soft" />
        <div className="mx-auto mt-10 h-28 max-w-3xl animate-pulse rounded-xl bg-surface-soft" />
        <div className="mx-auto mt-8 h-8 max-w-xl animate-pulse rounded bg-surface-soft" />
      </div>
    </div>
  );
}
