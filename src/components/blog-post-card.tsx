"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { BlogPostEntry } from "@/lib/blog-types";

export function BlogPostCard({
  post,
}: {
  post: BlogPostEntry;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex h-full min-h-[18.5rem] flex-col overflow-hidden border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(13,13,13,0.95),rgba(5,5,5,0.98))] px-5 py-5 shadow-[0_18px_36px_rgba(0,0,0,0.3)] transition-[transform,border-color,box-shadow,background-color] duration-200 hover:-translate-y-1 hover:border-[rgba(255,42,42,0.65)] hover:bg-[linear-gradient(180deg,rgba(18,18,18,0.98),rgba(7,7,7,1))] hover:shadow-[0_24px_50px_rgba(255,42,42,0.08)] focus-visible:outline-none focus-visible:border-[var(--red)] focus-visible:shadow-[0_0_0_1px_var(--red)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,42,42,0.85),transparent)] opacity-70" />
        <div className="pointer-events-none absolute left-0 top-8 h-20 w-px bg-[linear-gradient(180deg,rgba(255,42,42,0),rgba(255,42,42,0.75),rgba(255,42,42,0))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,42,42,0.08),transparent_26%,transparent_72%,rgba(255,42,42,0.04))] opacity-80" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex border border-[var(--red-border)] bg-[rgba(255,42,42,0.08)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f6c0c0]">
                {post.category}
              </div>
            </div>

            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#666]">
                Published
              </p>
              <time
                dateTime={post.date}
                className="mt-2 block font-mono text-[11px] tracking-[0.08em] text-[var(--foreground)]"
              >
                {post.dateFormatted}
              </time>
            </div>
          </div>

          <div className="mt-6 h-px bg-[linear-gradient(90deg,rgba(255,42,42,0.45),rgba(255,42,42,0.04))]" />

          <h3 className="font-display mt-6 max-w-[14ch] line-clamp-3 text-[1.25rem] font-bold uppercase leading-[0.96] tracking-[0.02em] text-white transition-colors group-hover:text-[#fff1f1] sm:text-[1.4rem]">
            {post.title}
          </h3>

          <p className="mt-4 max-w-[34ch] flex-1 text-sm leading-7 text-[var(--muted-foreground)] line-clamp-3">
            {post.description}
          </p>

          <div className="mt-8 border-t border-[rgba(255,42,42,0.16)] pt-4">
            <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)] transition-transform duration-200 group-hover:translate-x-1">
              Open
              <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}