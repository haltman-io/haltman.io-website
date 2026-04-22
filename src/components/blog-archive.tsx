"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BlogPostCard } from "@/components/blog-post-card";
import type { BlogPostEntry } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

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
            {filtered.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
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
