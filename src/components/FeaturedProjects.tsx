"use client";

import Image from "next/image";
import Link from "next/link";
import { projects, type RoleId } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";
import { useRole } from "@/components/RoleContext";

export function FeaturedProjects() {
  const { role } = useRole();
  const ordered = role
    ? [
        ...projects.filter((project) => project.role === role),
        ...projects.filter((project) => project.role !== role),
      ]
    : projects;

  return (
    <section id="work" className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Selected Work"
          title="Applications and ERP systems I have built."
          description={
            role
              ? `Highlighting ${roleLabel(role)} first — switch paths in the hero to reframe the work.`
              : "Confidential education ERP on Frappe, plus a public web app. Each piece has a case study."
          }
        />

        <div className="mt-14 divide-y divide-line border-y border-line">
          {ordered.map((project, index) => {
            const dimmed = role !== null && role !== project.role;

            return (
              <article
                key={project.id}
                className={`grid gap-6 py-10 transition duration-300 lg:grid-cols-[4rem_minmax(14rem,20rem)_1fr] lg:items-start ${
                  dimmed ? "opacity-40" : "opacity-100"
                }`}
              >
                <p className="font-display text-sm text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <Link href={`/work/${project.id}`} className="overflow-hidden bg-surface-soft">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    width={1600}
                    height={900}
                    className="aspect-video w-full object-cover"
                  />
                </Link>
                <div>
                  <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-muted uppercase">
                    {project.category}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink">
                    <Link href={`/work/${project.id}`} className="hover:text-accent">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <p className="mt-4 text-sm text-ink/70">{project.tags.join(" · ")}</p>
                  <Link
                    href={`/work/${project.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-hover"
                  >
                    Read case study
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function roleLabel(role: RoleId) {
  return role === "web" ? "web development" : "Frappe / ERPNext work";
}
