"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, tagLabels, type Project } from "@/config/projects";

function ArchiveRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group flex items-start gap-4 border-b border-[rgba(255,42,42,0.08)] py-5 transition-colors hover:bg-[rgba(255,42,42,0.04)] sm:items-center"
    >
      {/* Red dash prefix */}
      <span
        aria-hidden
        className="mt-1 select-none font-mono text-[var(--red)] opacity-30 sm:mt-0"
      >
        &ndash;
      </span>

      {/* Name + description */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-5">
        <span className="shrink-0 font-mono text-sm font-semibold text-white transition-colors group-hover:text-[var(--red)] sm:w-52">
          {project.name}
        </span>
        <span className="flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {project.description}
        </span>
      </div>

      {/* Tag + arrow */}
      <div className="flex shrink-0 items-center gap-3">
        <span className="rounded-full border border-[var(--red-border)] bg-[var(--red-subtle)] px-2.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-[var(--muted-foreground)]">
          {tagLabels[project.tag]}
        </span>
        <ArrowUpRight className="size-4 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:text-[var(--red)] group-hover:opacity-100" />
      </div>
    </motion.a>
  );
}

export function WorkArchive() {
  const grouped = useMemo(() => {
    const map = new Map<number, Project[]>();
    for (const p of projects) {
      const list = map.get(p.year) || [];
      list.push(p);
      map.set(p.year, list);
    }
    return [...map.entries()].sort(([a], [b]) => b - a);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 sm:pb-32 lg:px-12">
      <div className="space-y-16">
        {grouped.map(([year, items], groupIdx) => {
          const baseIndex = grouped
            .slice(0, groupIdx)
            .reduce((sum, [, g]) => sum + g.length, 0);

          return (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {/* Year header */}
              <div className="mb-2 flex items-end gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-white sm:text-5xl">
                    {year}
                  </span>
                  <span className="font-display text-4xl font-bold text-[var(--red)] sm:text-5xl">
                    .
                  </span>
                </div>
                <span className="mb-1.5 font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] opacity-50">
                  {items.length} {items.length === 1 ? "release" : "releases"}
                </span>
              </div>
              <div className="mb-4 h-px bg-[var(--red-border)]" />

              {/* Rows */}
              <div>
                {items.map((project, i) => (
                  <ArchiveRow
                    key={project.href}
                    project={project}
                    index={baseIndex + i}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total count */}
      <div className="mt-12 text-right">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] opacity-50">
          {projects.length} entries &middot; {grouped.length} years
        </p>
      </div>
    </div>
  );
}
