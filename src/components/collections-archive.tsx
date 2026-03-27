"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { motion } from "motion/react";
import {
  collections,
  categoryLabels,
  type CollectionCategory,
  type CollectionEntry,
} from "@/config/collections";
import { cn } from "@/lib/utils";

const categoryOptions: { value: CollectionCategory | "all"; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "our-work", label: "Our Work" },
    { value: "tool", label: "Tools" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "knowledge", label: "Knowledge" },
    { value: "community", label: "Community" },
  ];

function CollectionCard({
  item,
  index,
}: {
  item: CollectionEntry;
  index: number;
}) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group panel flex flex-col rounded-lg p-6 transition-shadow hover:shadow-[0_0_40px_rgba(255,42,42,0.08)]"
    >
      {/* Badges + Arrow */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.legendary && (
            <span className="rounded-full border border-[var(--red)] bg-[rgba(255,42,42,0.12)] px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-[var(--red)]">
              Legendary
            </span>
          )}
          {item.crewApproved && (
            <span className="rounded-full border border-[var(--red-border)] bg-[var(--red-subtle)] px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-[var(--muted-foreground)]">
              Crew Approved
            </span>
          )}
          {item.featured && !item.legendary && !item.crewApproved && (
            <span className="rounded-full border border-[var(--red-border)] bg-[var(--red-subtle)] px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-[var(--muted-foreground)]">
              Featured
            </span>
          )}
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--red)] group-hover:opacity-100" />
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-white">{item.name}</h3>

      {/* Source */}
      {item.source && (
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
          {item.source}
        </p>
      )}

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {item.description}
      </p>

      {/* Editorial note */}
      {item.note && (
        <p className="mt-3 border-l-2 border-[var(--red)] pl-3 text-sm italic text-[var(--muted-foreground)]">
          &ldquo;{item.note}&rdquo;
        </p>
      )}

      {/* Tags + Category */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-[var(--red-border)] bg-[var(--red-subtle)] px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-[var(--red)]">
          {categoryLabels[item.category]}
        </span>
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[rgba(255,255,255,0.04)] px-2 py-0.5 font-mono text-[0.5625rem] text-[var(--muted-foreground)]"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export function CollectionsArchive() {
  const [activeCategory, setActiveCategory] = useState<
    CollectionCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return collections.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (searchQuery === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q)) ||
        (item.source && item.source.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  const featured = useMemo(
    () => collections.filter((item) => item.featured),
    [],
  );

  const showFeatured =
    activeCategory === "all" && searchQuery === "" && featured.length > 0;

  const countForCategory = (cat: CollectionCategory | "all") =>
    cat === "all"
      ? collections.length
      : collections.filter((c) => c.category === cat).length;

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
            placeholder="Search tools, resources, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--red-border)] bg-[rgba(255,255,255,0.03)] py-2.5 pl-10 pr-4 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--red)] focus:outline-none"
          />
        </div>
      </div>

      {/* Featured section */}
      {showFeatured && (
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--red-border)]" />
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              Featured
            </span>
            <div className="h-px flex-1 bg-[var(--red-border)]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((item, i) => (
              <CollectionCard key={item.href} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="mt-12">
        {showFeatured && (
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--red-border)]" />
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              Archive
            </span>
            <div className="h-px flex-1 bg-[var(--red-border)]" />
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <CollectionCard key={item.href} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-[var(--muted-foreground)]">
              No results found.
            </p>
          </div>
        )}
      </div>

      {/* Count */}
      <div className="mt-8 text-right">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] opacity-50">
          {filtered.length} of {collections.length} entries
        </p>
      </div>
    </div>
  );
}
