"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/LanguageProvider";
import { shared } from "@/lib/content";

/**
 * Building blocks shared by the reading pages (/science, /music): a plain
 * header, titled sections separated by hairlines, and a footer. No canvas,
 * no loader — these pages are meant to be read.
 *
 * Tailwind Preflight is not loaded yet (see globals.css), so margins and list
 * styles are reset explicitly with m-0 / p-0 / list-none where it matters.
 */

export function PageMain({ children }) {
  return <main className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">{children}</main>;
}

export function PageHeader({ title, lead }) {
  return (
    <header className="pt-36 pb-14 sm:pt-44 sm:pb-20">
      <h1 className="m-0 font-serif text-5xl font-normal leading-none tracking-tight text-balance text-paper sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 mb-0 max-w-[40ch] text-lg leading-relaxed text-pretty text-muted sm:text-xl">
        {lead}
      </p>
    </header>
  );
}

export function Section({ id, title, children }) {
  return (
    <section id={id} className="reveal scroll-mt-24 border-t border-rule py-14 sm:py-20">
      <h2 className="m-0 mb-10 font-serif text-3xl font-normal tracking-tight text-paper sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Opens in a new tab; the arrow marks it as leaving the site. */
export function ExternalLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`font-mono text-xs uppercase tracking-[0.14em] underline-offset-4 hover:underline focus-visible:underline ${className}`}
    >
      {children} ↗
    </a>
  );
}

export function PageFooter() {
  const { t } = useLang();
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-rule py-10 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
      <Link href="/" className="text-paper underline-offset-4 hover:underline">
        ← {t.nav.back}
      </Link>
      <span>
        © {new Date().getFullYear()} {shared.name}
      </span>
    </footer>
  );
}
