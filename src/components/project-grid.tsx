"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/config/projects";

function ProjectListItem({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-[rgba(255,42,42,0.08)] last:border-b-0"
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid gap-2.5 py-3.5 transition-colors duration-200 hover:bg-[rgba(255,42,42,0.03)] sm:grid-cols-[13rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
      >
        <h3 className="min-w-0 text-sm font-semibold text-white transition-colors duration-200 group-hover:text-[#fff1f1]">
          {project.name}
        </h3>

        <p className="text-sm leading-6 text-muted-foreground sm:truncate">
          {project.description}
        </p>

        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f] transition-colors duration-200 group-hover:text-(--red)">
          Open
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </a>
    </motion.li>
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
          const headingId = `home-project-year-${year}`;

          return (
            <section key={year} aria-labelledby={headingId}>
              <div className="mb-3 flex items-center gap-3">
                <h3
                  id={headingId}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--red)"
                >
                  {year}
                </h3>
                <div className="h-px flex-1 bg-[rgba(255,42,42,0.12)]" />
              </div>

              <ul className="border-t border-[rgba(255,42,42,0.08)]" role="list">
                {items.map((project, i) => (
                  <ProjectListItem
                    key={project.href}
                    project={project}
                    index={baseIndex + i}
                  />
                ))}
              </ul>
            </section>
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
