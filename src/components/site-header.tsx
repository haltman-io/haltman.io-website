"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-[var(--red-border)] bg-[rgba(5,5,5,0.85)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--foreground)] transition-colors hover:text-white"
        >
          HALTMAN.IO
        </Link>

        {/* Center nav — desktop */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {pageLinks.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-4 py-2 text-sm tracking-wide text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]",
                  active && "text-[var(--foreground)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Social icons — desktop */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {headerSocialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex size-9 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                <SimpleIcon slug={link.simpleIconSlug} className="size-4" />
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md text-[var(--foreground)] lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile primary"
          className="border-t border-[var(--red-border)] px-6 py-4 lg:hidden"
        >
          <div className="space-y-1">
            {pageLinks.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]",
                    active && "text-[var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-[var(--red-border)] pt-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex size-9 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                <SimpleIcon slug={link.simpleIconSlug} className="size-4" />
              </a>
            ))}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
