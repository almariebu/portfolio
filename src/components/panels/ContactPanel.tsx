"use client";

import { useState } from "react";
import { contact, site } from "@/lib/content";
import { Eyebrow } from "@/components/ui";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-night-line bg-night px-3.5 py-2.5 text-sm text-night-ink placeholder:text-night-muted focus:border-gold focus:outline-none";

export function ContactPanel() {
  const [type, setType] = useState(contact.projectTypes[0]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = `${type} enquiry from ${name}`;
    const body = `${message}\n\n—\n${name}\n${from}`;

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="md:pr-2">
        <Eyebrow>{contact.eyebrow}</Eyebrow>
        <h2 className="mt-2 max-w-md font-display text-[clamp(1.35rem,2vw,1.85rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-night-ink">
          {contact.title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-night-ink">
          {contact.lead}
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-5 block text-base font-semibold text-gold transition hover:text-gold-bright"
        >
          {site.email}
        </a>
        <p className="mt-2 text-sm text-night-muted">{contact.responseTime}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-10 items-center rounded-full border border-night-line px-4 text-sm font-semibold text-night-ink transition hover:border-gold/40 hover:text-gold"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-10 items-center rounded-full border border-night-line px-4 text-sm font-semibold text-night-ink transition hover:border-gold/40 hover:text-gold"
          >
            GitHub
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-10 items-center rounded-full border border-night-line px-4 text-sm font-semibold text-night-ink transition hover:border-gold/40 hover:text-gold"
          >
            CV
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-night-line bg-night-soft p-4 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-night-ink">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-night-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={fieldClass}
            />
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-night-ink">
            What do you need?
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {contact.projectTypes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setType(option)}
                aria-pressed={type === option}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  type === option
                    ? "border-gold bg-gold/12 text-gold-bright"
                    : "border-night-line text-night-ink hover:border-gold/40"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="message" className="text-sm font-medium text-night-ink">
            What are you trying to solve?
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="What the project is, and roughly how long it should take."
            className={`${fieldClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gold px-5 text-sm font-bold text-night transition hover:bg-gold-bright"
        >
          Open email draft
        </button>
        <p className="mt-2 text-center text-sm text-night-muted">
          Opens an email draft. You can also use the address on this page.
        </p>
      </form>
    </div>
  );
}
