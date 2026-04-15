"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/config/projects";

function getHostLabel(href: string): string {
  try {
    return new URL(href).host;
  } catch {
    return href.replace(/^https?:\/\//, "");
  }
}

function ArchiveRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const serial = String(index + 1).padStart(2, "0");
  const hostLabel = getHostLabel(project.href);

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, delay: index * 0.035 }}
      className="group relative block overflow-hidden border-b border-[rgba(255,42,42,0.12)] bg-[linear-gradient(90deg,rgba(255,42,42,0.03),transparent_18%,transparent)] px-5 py-5 transition-[background-color,border-color,transform] duration-200 hover:border-[rgba(255,42,42,0.4)] hover:bg-[linear-gradient(90deg,rgba(255,42,42,0.08),rgba(255,255,255,0.02)_22%,transparent_72%)] sm:px-7 sm:py-6 lg:px-8"
    >
      <div className="relative z-10 grid gap-5 sm:grid-cols-[4.25rem_minmax(0,1fr)_11rem] sm:items-start lg:grid-cols-[4.5rem_minmax(0,1fr)_11.75rem]">
        <div className="flex items-center gap-3 sm:block">
          <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--red)]">
            {serial}
          </span>
        </div>

        <div className="min-w-0 pr-1 sm:pr-4 lg:pr-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8c8c]">
            {project.shortLabel}
          </p>
          <h3 className="mt-2 max-w-[24ch] text-[1.05rem] font-semibold leading-[1.05] tracking-[0.01em] text-white transition-colors duration-200 group-hover:text-[#fff1f1] sm:text-[1.18rem]">
            {project.name}
          </h3>
          <p className="mt-3 max-w-[68ch] text-sm leading-7 text-[var(--muted-foreground)]">
            {project.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 sm:min-w-[11rem] sm:flex-col sm:items-end lg:min-w-[11.75rem]">
          <ArrowUpRight className="size-4 shrink-0 text-[#666] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--red)]" />

          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666]">
              Endpoint
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-[#adadad]">
              {hostLabel}
            </p>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export function WorkArchive() {
  const grouped = useMemo(() => {
    const map = new Map<number, Project[]>();

    for (const project of projects) {
      const list = map.get(project.year) || [];
      list.push(project);
      map.set(project.year, list);
    }

    return [...map.entries()].sort(([a], [b]) => b - a);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 sm:pb-32 lg:px-12">
      <div className="space-y-12">
        {grouped.map(([year, items], groupIdx) => {
          const baseIndex = grouped
            .slice(0, groupIdx)
            .reduce((sum, [, groupItems]) => sum + groupItems.length, 0);

          return (
            <motion.section
              key={year}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(12,12,12,0.92),rgba(6,6,6,0.98))] shadow-[0_18px_38px_rgba(0,0,0,0.28)]"
            >
              <div className="relative z-10 border-b border-[rgba(255,42,42,0.12)] px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-end gap-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold leading-none text-white sm:text-5xl">
                        {year}
                      </span>
                      <span className="font-display text-4xl font-bold leading-none text-[var(--red)] sm:text-5xl">
                        .
                      </span>
                    </div>
                    <div className="pb-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                        Release batch
                      </p>
                      <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-[#d4d4d4]">
                        {items.length} {items.length === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {items.map((project, index) => (
                  <ArchiveRow
                    key={project.href}
                    project={project}
                    index={baseIndex + index}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
