"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, tagLabels, type Project } from "@/config/projects";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex items-start gap-3 border-b border-[rgba(255,42,42,0.08)] py-4 transition-colors hover:bg-[rgba(255,42,42,0.04)] sm:items-center sm:gap-5"
    >
      {/* Red dash prefix */}
      <span
        aria-hidden
        className="mt-0.5 select-none font-mono text-[var(--red)] opacity-30 sm:mt-0"
      >
        &ndash;
      </span>

      {/* Name + description */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
        <span className="shrink-0 font-mono text-sm font-medium text-white transition-colors group-hover:text-[var(--red)] sm:w-48">
          {project.name}
        </span>
        <span className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:flex-1 sm:truncate">
          {project.description}
        </span>
      </div>

      {/* Tag + arrow */}
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden rounded-full border border-[var(--red-border)] bg-[var(--red-subtle)] px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-[var(--muted-foreground)] sm:inline-flex">
          {tagLabels[project.tag]}
        </span>
        <ArrowUpRight className="size-4 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:text-[var(--red)] group-hover:opacity-100" />
      </div>
    </motion.a>
  );
}

export function ProjectGrid() {
  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  const grouped = useMemo(() => {
    const map = new Map<number, Project[]>();
    for (const p of featured) {
      const list = map.get(p.year) || [];
      list.push(p);
      map.set(p.year, list);
    }
    return [...map.entries()].sort(([a], [b]) => b - a);
  }, [featured]);

  return (
    <section
      id="projects"
      className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mb-12">
        <p className="label-xs">Public Output</p>
        <h2 className="font-display mt-3 text-2xl font-bold uppercase tracking-[0.04em] text-white sm:text-3xl">
          Our Work
        </h2>
        <div className="mt-4 h-px w-16 bg-gradient-to-r from-[var(--red)] to-transparent" />
      </div>

      <div className="space-y-10">
        {grouped.map(([year, items], groupIdx) => {
          const baseIndex = grouped
            .slice(0, groupIdx)
            .reduce((sum, [, g]) => sum + g.length, 0);

          return (
            <div key={year}>
              {/* Year header */}
              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-white sm:text-4xl">
                  {year}
                </span>
                <span className="font-display text-3xl font-bold text-[var(--red)] sm:text-4xl">
                  .
                </span>
              </div>

              {/* Rows */}
              <div>
                {items.map((project, i) => (
                  <ProjectRow
                    key={project.href}
                    project={project}
                    index={baseIndex + i}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full archive link */}
      <div className="mt-10 border-t border-[var(--red-border)] pt-6">
        <Link
          href="/our-work"
          className="group inline-flex items-center gap-2 font-mono text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--red)]"
        >
          View full archive
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
