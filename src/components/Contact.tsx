import { site } from "@/lib/content";

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-line px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Contact
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4.2vw,2.75rem)] font-semibold leading-tight tracking-tight text-ink">
            Let’s Build Something Useful
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Have a product idea, a business process that needs improvement, or an
            ERP system that needs customization?
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-ink px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
          >
            Start a Conversation →
          </a>
          <div className="mt-8 flex flex-wrap gap-6 text-sm font-medium text-muted">
            <a href={`mailto:${site.email}`} className="transition hover:text-ink">
              Email
            </a>
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
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Almarie Bu</p>
        <p>Product Ownership · Web Development · Frappe ERP</p>
      </div>
    </footer>
  );
}
