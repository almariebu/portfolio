import { site } from "@/lib/content";

export function Contact() {
  return (
    <section id="contact" className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-accent uppercase">
          Contact
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-tight tracking-tight text-ink">
          Need ERPNext customization or a web application?
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          I reply to Frappe, ERPNext, and web development work.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-10 inline-block font-display text-[clamp(1.4rem,3vw,2rem)] font-medium text-ink underline decoration-line underline-offset-8 transition hover:text-accent hover:decoration-accent"
        >
          {site.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-6 text-sm font-medium text-muted">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-ink"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Almarie Bu</p>
        <p>Web Development · Frappe / ERPNext</p>
      </div>
    </footer>
  );
}
