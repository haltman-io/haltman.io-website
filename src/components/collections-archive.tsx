"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { motion } from "motion/react";
import {
  collections,
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
      className="group relative flex h-full min-h-52 flex-col overflow-hidden border border-(--red-border) bg-[linear-gradient(180deg,rgba(13,13,13,0.96),rgba(4,4,4,0.99))] px-5 py-5 shadow-[0_16px_32px_rgba(0,0,0,0.26)] transition-[transform,border-color,box-shadow,background-color] duration-200 hover:-translate-y-1 hover:border-[rgba(255,42,42,0.65)] hover:bg-[linear-gradient(180deg,rgba(18,18,18,0.98),rgba(7,7,7,1))] hover:shadow-[0_22px_44px_rgba(255,42,42,0.08)] focus-visible:outline-none focus-visible:border-(--red) focus-visible:shadow-[0_0_0_1px_var(--red)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,42,42,0.85),transparent)] opacity-70" />
      <div className="pointer-events-none absolute left-0 top-7 h-16 w-px bg-[linear-gradient(180deg,rgba(255,42,42,0),rgba(255,42,42,0.75),rgba(255,42,42,0))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,42,42,0.08),transparent_26%,transparent_72%,rgba(255,42,42,0.04))] opacity-80" />

      <div className="relative z-10 flex h-full flex-col">
        <h3 className="font-display mt-5 max-w-[17ch] text-[1.08rem] font-bold uppercase leading-[0.96] tracking-[0.02em] text-white transition-colors duration-200 group-hover:text-[#fff1f1] sm:text-[1.15rem]">
          {item.name}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">
          {item.description}
        </p>

        {item.note && (
          <p className="mt-3 line-clamp-2 border-l-2 border-[rgba(255,42,42,0.55)] pl-3 text-sm italic leading-6 text-[#d0d0d0]">
            &ldquo;{item.note}&rdquo;
          </p>
        )}

        <div className="mt-5 border-t border-[rgba(255,42,42,0.16)] pt-4">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-(--red) transition-transform duration-200 group-hover:translate-x-1">
            Open
            <ArrowUpRight className="size-3" />
          </span>
        </div>
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

  const archiveItems = useMemo(() => {
    if (!showFeatured) {
      return filtered;
    }

    const featuredHrefs = new Set(featured.map((item) => item.href));
    return filtered.filter((item) => !featuredHrefs.has(item.href));
  }, [featured, filtered, showFeatured]);

  const displayedItems = showFeatured ? [...featured, ...archiveItems] : filtered;

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
                  ? "border border-(--red) bg-[rgba(255,42,42,0.12)] text-white"
                  : "border border-(--red-border) text-muted-foreground hover:border-(--red) hover:text-white",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools, resources, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-(--red-border) bg-[rgba(255,255,255,0.03)] py-2.5 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-(--red) focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-12">
        {displayedItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedItems.map((item, i) => (
              <CollectionCard key={item.href} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              No results found.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
