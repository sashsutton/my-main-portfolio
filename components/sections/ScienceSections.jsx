"use client";

import { useLang } from "@/components/providers/LanguageProvider";
import { shared } from "@/lib/content";
import { ExternalLink, PageHeader, Section } from "./PageParts";

/** /science: header, the published paper, projects, education. */

export function ScienceHeader() {
  const { t } = useLang();
  return <PageHeader title={t.science.title} lead={t.science.lead} />;
}

/* ------------------------------------------------------------- research -- */

export function Research() {
  const { t } = useLang();
  const { research } = t.science;

  return (
    <Section id="research" title={research.title}>
      {shared.research.publications.map((pub) => {
        const copy = research.entries[pub.id];
        return (
          <article key={pub.id} className="border-l-2 border-phosphor-dim pl-6 sm:pl-8">
            {/* The paper's real French title, verbatim in both locales — a
                citation, not UI copy. */}
            <h3 className="m-0 font-serif text-2xl font-normal leading-snug text-pretty text-paper sm:text-3xl">
              {copy.title}
            </h3>
            <p className="mt-3 mb-0 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              {copy.meta}
            </p>
            <p className="mt-4 mb-0 max-w-[62ch] leading-relaxed text-muted">{copy.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-6 text-phosphor">
              <ExternalLink href={pub.hal}>{research.hal}</ExternalLink>
              {pub.repo && <ExternalLink href={pub.repo}>{research.repo}</ExternalLink>}
            </div>
          </article>
        );
      })}
    </Section>
  );
}

/* ------------------------------------------------------------- projects -- */

export function Projects() {
  const { t } = useLang();
  const { projects } = t.science;

  return (
    <Section id="projects" title={projects.title}>
      <ul className="m-0 list-none p-0">
        {shared.research.projects.map((project) => {
          const copy = projects.entries[project.id];
          return (
            <li
              key={project.id}
              className="grid gap-3 border-t border-rule py-8 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-8"
            >
              <span className="pt-1 font-mono text-xs text-subtle">{project.year}</span>
              <div>
                <h3 className="m-0 font-mono text-lg font-medium text-paper">{copy.title}</h3>
                <p className="mt-2 mb-0 max-w-[62ch] leading-relaxed text-muted">{copy.blurb}</p>
                <p className="mt-3 mb-0 font-mono text-xs text-subtle">{project.stack.join(" · ")}</p>
              </div>
              {(project.repo || project.demo) && (
                <div className="flex gap-6 pt-1 text-phosphor sm:flex-col sm:items-end sm:gap-3">
                  {project.demo && <ExternalLink href={project.demo}>{projects.demo}</ExternalLink>}
                  {project.repo && <ExternalLink href={project.repo}>{projects.repo}</ExternalLink>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------ education -- */

export function Education() {
  const { t } = useLang();
  const { education } = t.science;

  return (
    <Section id="education" title={education.title}>
      <ol className="m-0 list-none p-0">
        {shared.research.education.map((item) => {
          const copy = education.entries[item.id];
          return (
            <li
              key={item.id}
              className="grid gap-2 border-t border-rule py-8 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-8"
            >
              <div className="pt-1 font-mono text-xs leading-relaxed text-subtle">
                {item.from}–{item.to}
                <br />
                {copy.location}
              </div>
              <div>
                <h3 className="m-0 text-lg font-medium text-paper">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline-offset-4 hover:underline"
                    >
                      {copy.place} <span className="text-subtle">↗</span>
                    </a>
                  ) : (
                    copy.place
                  )}
                </h3>
                <p className="mt-1 mb-0 text-muted">{copy.programme}</p>
                {copy.detail && (
                  <p className="mt-3 mb-0 max-w-[62ch] text-sm leading-relaxed text-subtle">{copy.detail}</p>
                )}
                {/* Long coursework lists stay folded until asked for. */}
                {copy.coursework && (
                  <details className="group mt-4">
                    <summary className="cursor-pointer list-none font-mono text-xs uppercase tracking-[0.14em] text-phosphor-dim hover:text-phosphor [&::-webkit-details-marker]:hidden">
                      <span className="inline-block w-4 group-open:hidden">+</span>
                      <span className="hidden w-4 group-open:inline-block">−</span>
                      {education.coursework}
                    </summary>
                    <p className="mt-3 mb-0 max-w-[62ch] text-sm leading-relaxed text-subtle">
                      {copy.coursework}
                    </p>
                  </details>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
