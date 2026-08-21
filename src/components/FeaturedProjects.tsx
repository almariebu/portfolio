"use client";

import { projects, roles, type RoleId } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";
import { useRole } from "@/components/RoleContext";

export function FeaturedProjects() {
  const { role } = useRole();
  const ordered: RoleId[] = role
    ? [role, ...roles.filter((r) => r !== role)]
    : roles;

  return (
    <section id="work" className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Featured Projects"
          title="Proof across the studio."
          description={
            role
              ? `Highlighting ${projects[role].title.toLowerCase()} first — switch paths in the hero to reframe the work.`
              : "Case studies spanning product ownership, web development, and Frappe ERP."
          }
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {ordered.map((id) => {
            const project = projects[id];

            return (
              <article
                key={id}
                className={`flex flex-col rounded-xl border p-6 transition duration-300 sm:p-7 ${
                  role === id
                    ? "border-accent/35 bg-accent-soft"
                    : role && role !== id
                      ? "border-line bg-surface opacity-45"
                      : "border-line bg-surface"
                }`}
              >
                <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
                  {id === "product"
                    ? "Product"
                    : id === "web"
                      ? "Web"
                      : "ERP"}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <p className="mt-5 text-sm font-medium text-ink/75">
                  {project.tags.join(" · ")}
                </p>
                <a
                  href={project.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-hover"
                >
                  View Case Study
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
