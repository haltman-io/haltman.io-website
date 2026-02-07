"use client";

import {
  ArrowUpRight,
  BookOpen,
  Database,
  Globe,
  Search,
  Terminal,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { collections, type CollectionItem } from "@/config/collections";

function iconForTag(tag: CollectionItem["tag"]) {
  switch (tag) {
    case "search-engine":
      return Search;
    case "magazine":
      return BookOpen;
    case "tool":
      return Terminal;
    case "database":
      return Database;
    case "community":
      return Users;
    case "reference":
      return Globe;
  }
}

export function CollectionGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((item, index) => {
        const Icon = iconForTag(item.tag);
        return (
          <motion.a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="group panel flex flex-col justify-between rounded-lg p-5 transition-shadow hover:shadow-[0_0_30px_rgba(255,42,42,0.08)]"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--red-border)] bg-[var(--red-subtle)] text-[var(--red)]">
                  <Icon className="size-4" />
                </div>
                <ArrowUpRight className="size-4 text-[var(--muted-foreground)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--red)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {item.name}
              </h3>
              <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                {item.description}
              </p>
            </div>
            <span className="chip mt-4 w-fit">{item.tag}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
