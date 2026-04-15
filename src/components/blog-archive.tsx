"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "motion/react";
import type { BlogPostEntry } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

function PostCard({
  post,
  index,
}: {
  post: BlogPostEntry;
  index: number;
}) {
  const serial = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
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
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--red)]">
                Post {serial}
              </p>
              <div className="mt-2 inline-flex border border-[var(--red-border)] bg-[rgba(255,42,42,0.08)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f6c0c0]">
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

          <h3 className="font-display mt-6 max-w-[14ch] text-[1.25rem] font-bold uppercase leading-[0.96] tracking-[0.02em] text-white transition-colors group-hover:text-[#fff1f1] sm:text-[1.4rem]">
            {post.title}
          </h3>

          <p className="mt-4 max-w-[34ch] flex-1 text-sm leading-7 text-[var(--muted-foreground)] line-clamp-4">
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

export function BlogArchive({ posts }: { posts: BlogPostEntry[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryOptions: { value: string; label: string }[] = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...Array.from(
        new Map(
          posts.map((post) => [
            post.categorySlug,
            { value: post.categorySlug, label: post.category },
          ]),
        ).values(),
      ),
    ];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.categorySlug === activeCategory;
      if (!matchesCategory) return false;
      if (searchQuery === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  const countForCategory = (cat: string) =>
    cat === "all"
      ? posts.length
      : posts.filter((p) => p.categorySlug === cat).length;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 sm:pb-32 lg:px-12">
      {/* Filter + Search bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                activeCategory === cat.value
                  ? "border border-[var(--red)] bg-[rgba(255,42,42,0.12)] text-white"
                  : "border border-[var(--red-border)] text-[var(--muted-foreground)] hover:border-[var(--red)] hover:text-white",
              )}
            >
              {cat.label}
              <span className="ml-1.5 text-[var(--red)] opacity-60">
                {countForCategory(cat.value)}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--red-border)] bg-[rgba(255,255,255,0.03)] py-2.5 pl-10 pr-4 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--red)] focus:outline-none"
          />
        </div>
      </div>

      {/* Posts grid */}
      <div className="mt-12">
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-[var(--muted-foreground)]">
              No posts found.
            </p>
          </div>
        )}
      </div>

      {/* Count */}
      <div className="mt-8 text-right">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] opacity-50">
          {filtered.length} of {posts.length} posts
        </p>
      </div>
    </div>
  );
}
