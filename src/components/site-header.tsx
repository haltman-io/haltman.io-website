"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import * as simpleIcons from "simple-icons";
import { socialLinks } from "@/config/links";
import { cn } from "@/lib/utils";

function SimpleIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const key =
    `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof simpleIcons;
  const icon = simpleIcons[key] as { path: string } | undefined;
  if (!icon) return null;
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/our-work", label: "Our Work" },
  { href: "/arts", label: "Arts" },
  { href: "/collections", label: "Collections" },
  { href: "/join", label: "Join" },
] as const;

const headerSocialLinks = socialLinks.filter(
  (l) => l.simpleIconSlug === "github" || l.simpleIconSlug === "telegram",
);

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const activePage =
    pageLinks.find((item) => isActiveLink(item.href))?.label ?? "Directory";

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-[var(--red-border)] bg-[rgba(5,5,5,0.85)] backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto max-w-7xl px-6 py-2.5 sm:px-8 lg:px-12">
        <div className="flex items-stretch gap-2.5">
          <Link
            href="/"
            className="flex shrink-0 items-center border border-[var(--red-border)] bg-[rgba(10,10,10,0.92)] px-4 py-2.5 transition-colors duration-200 hover:border-[rgba(255,42,42,0.32)] hover:bg-[rgba(14,14,14,0.96)] sm:px-5"
          >
            <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white sm:text-[0.92rem]">
              HALTMAN.IO
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden min-w-0 flex-1 overflow-hidden border border-[var(--red-border)] bg-[rgba(9,9,9,0.72)] shadow-[0_12px_28px_rgba(0,0,0,0.24)] lg:grid lg:grid-cols-7"
          >
            {pageLinks.map((item, index) => {
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex min-h-16 flex-col justify-between border-l border-[rgba(255,42,42,0.12)] px-4 py-2.5 transition-[background-color,color] duration-200 first:border-l-0 hover:bg-[rgba(255,42,42,0.06)]",
                    active &&
                      "bg-[linear-gradient(180deg,rgba(255,42,42,0.08),rgba(255,42,42,0.02))] text-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7d7d7d] transition-colors duration-200 group-hover:text-[var(--red)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)] shadow-[0_0_10px_var(--red-glow)]" />
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-sm font-medium tracking-[0.01em] text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-white",
                      active && "text-white",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden w-52 shrink-0 overflow-hidden border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(7,7,7,1))] px-4 py-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.24)] xl:flex xl:items-center xl:justify-between">
            <div className="flex items-center gap-2">
              {headerSocialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex size-9 items-center justify-center border border-[rgba(255,42,42,0.16)] bg-[rgba(255,42,42,0.04)] text-[var(--muted-foreground)] transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,42,42,0.45)] hover:text-white"
                >
                  <SimpleIcon slug={link.simpleIconSlug} className="size-4" />
                </a>
              ))}
            </div>

            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666]">
                Route
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-[#d4d4d4]">
                {activePage}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex size-12 shrink-0 items-center justify-center border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(14,14,14,0.96),rgba(7,7,7,1))] text-[var(--foreground)] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition-colors hover:border-[rgba(255,42,42,0.45)] lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto max-w-7xl px-6 pb-3 sm:px-8 lg:hidden lg:px-12">
          <nav
            id="mobile-navigation"
            aria-label="Mobile primary"
            className="overflow-hidden border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(12,12,12,0.96),rgba(6,6,6,1))] shadow-[0_18px_38px_rgba(0,0,0,0.3)]"
          >
            <div className="border-b border-[rgba(255,42,42,0.12)] px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)]">
                Navigation
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Public routes and official quick links.
              </p>
            </div>

            <div>
            {pageLinks.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group block border-b border-[rgba(255,42,42,0.12)] px-4 py-3 last:border-b-0 hover:bg-[rgba(255,42,42,0.05)]",
                    active && "bg-[rgba(255,42,42,0.06)]",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8c8c]">
                        Route
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-white",
                          active && "text-white",
                        )}
                      >
                        {item.label}
                      </p>
                    </div>

                    <ArrowUpRight
                      className={cn(
                        "size-4 shrink-0 text-[#666] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--red)]",
                        active && "text-[var(--red)]",
                      )}
                    />
                  </div>
                </Link>
              );
            })}
            </div>

            <div className="border-t border-[rgba(255,42,42,0.12)] px-4 py-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)]">
                    Official channels
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="inline-flex size-9 items-center justify-center border border-[rgba(255,42,42,0.16)] bg-[rgba(255,42,42,0.04)] text-[var(--muted-foreground)] transition-[border-color,color] duration-200 hover:border-[rgba(255,42,42,0.45)] hover:text-white"
                      >
                        <SimpleIcon slug={link.simpleIconSlug} className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666]">
                    Active
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-[#d4d4d4]">
                    {activePage}
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
