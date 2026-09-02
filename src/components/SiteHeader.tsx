"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!onHome) {
      setActive("");
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      const sections = ["#work", "#process", "#about", "#contact"]
        .map((href) => document.querySelector(href))
        .filter(Boolean) as HTMLElement[];

      const offset = window.scrollY + 120;
      let current = "";
      for (const section of sections) {
        if (section.offsetTop <= offset) current = `/#${section.id}`;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  useEffect(() => {
    if (onHome) return;
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color] duration-300 ${
        scrolled || open || !onHome
          ? "border-line bg-background/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          Almarie<span className="font-display text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                active === link.href ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            Let’s talk
          </a>
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background transition md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-display text-2xl font-semibold text-ink"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="/#contact"
          className="rounded-full bg-ink px-5 py-3 text-base font-semibold text-white"
          onClick={() => setOpen(false)}
        >
          Let’s talk
        </a>
      </div>
    </header>
  );
}
