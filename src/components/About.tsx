import { about } from "@/lib/content";
import { SectionIntro } from "@/components/SectionIntro";

export function About() {
  return (
    <section id="about" className="bg-surface-soft/50 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <SectionIntro
          eyebrow="About Me"
          title="Product thinking meets technical execution."
        />
        <div className="space-y-5 text-lg leading-relaxed text-ink/85">
          <p>{about.lead}</p>
          <p className="text-muted">{about.body}</p>
          <p className="text-muted">{about.close}</p>
        </div>
      </div>
    </section>
  );
}
