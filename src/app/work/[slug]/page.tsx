import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects, site } from "@/lib/content";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/Contact";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Work not found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} · ${site.name}`,
      description: project.description,
      type: "article",
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const index = projects.findIndex((item) => item.id === project.id);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/#work"
            className="text-sm font-medium text-muted transition hover:text-ink"
          >
            ← All work
          </Link>

          <p className="mt-8 text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
            {project.category}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-tight tracking-tight text-ink">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {project.description}
          </p>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover"
            >
              Open live app →
            </a>
          ) : null}

          <div className="mt-12 overflow-hidden bg-surface-soft">
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1600}
              height={900}
              priority
              className="aspect-video w-full object-cover"
            />
          </div>

          <Section index="01" title="Problem">
            <p>{project.problem}</p>
          </Section>

          <Section index="02" title="Role">
            <p>{project.roleDetail}</p>
          </Section>

          <Section index="03" title="Solution">
            <ul className="space-y-3">
              {project.solution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section index="04" title="Stack">
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((tech) => (
                <li
                  key={tech}
                  className="border border-line px-3 py-1.5 text-sm text-ink/80"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Section>

          <Section index="05" title="Result">
            <p>{project.result}</p>
          </Section>

          <Section index="06" title="Screenshots">
            <p className="mb-5 text-sm text-muted">
              Interface preview with dummy data. Live school systems are not
              shown.
            </p>
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1600}
              height={900}
              className="aspect-video w-full bg-surface-soft object-cover"
            />
          </Section>

          <Section index="07" title="Technical details">
            <ul className="space-y-3">
              {project.technical.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        </article>

        <div className="mx-auto mt-20 flex max-w-3xl flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
              Next
            </p>
            <Link
              href={`/work/${next.id}`}
              className="mt-3 block font-display text-2xl font-medium tracking-tight text-ink transition hover:text-accent"
            >
              {next.title}
            </Link>
          </div>
          <Link
            href="/#contact"
            className="text-sm font-semibold text-accent transition hover:text-accent-hover"
          >
            Let’s work together →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <p className="font-display text-sm text-accent">
        {index} — {title}
      </p>
      <div className="mt-4 text-base leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}
