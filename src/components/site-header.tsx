"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Home,
  ImageIcon,
  Library,
  Menu,
  User,
  X,
} from "lucide-react";
import * as simpleIcons from "simple-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resourceLinks, socialLinks } from "@/config/links";
import { activeProjects } from "@/config/projects";
import { cn } from "@/lib/utils";

type CollapsibleSection = "resources" | "projects" | "join";

type MobileMenuLink = {
  href: string;
  label: string;
  external?: boolean;
  simpleIconSlug?: string;
};

function SimpleIcon({ slug, className }: { slug: string; className?: string }) {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof simpleIcons;
  const icon = simpleIcons[key] as { path: string } | undefined;
  if (!icon) return null;
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={icon.path} />
    </svg>
  );
}

const pageLinks = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/about", label: "ABOUT", icon: User },
  { href: "/arts", label: "ARTS", icon: ImageIcon },
  { href: "/collections", label: "COLLECTIONS", icon: Library },
] as const;

const mobileExternalGroups: Record<CollapsibleSection, MobileMenuLink[]> = {
  resources: resourceLinks.map((link) => ({
    href: link.href,
    label: link.label,
    external: true,
  })),
  projects: activeProjects.map((project) => ({
    href: project.href,
    label: project.name,
    external: true,
  })),
  join: socialLinks.map((link) => ({
    href: link.href,
    label: link.label,
    simpleIconSlug: link.simpleIconSlug,
    external: true,
  })),
};

function MobileMenuSection({
  label,
  items,
  expanded,
  onToggle,
  onSelect,
}: {
  label: string;
  items: MobileMenuLink[];
  expanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="rounded-md border border-[var(--red-border)] bg-[rgba(255,255,255,0.02)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-[0.58rem] uppercase tracking-[0.18em] text-[var(--foreground)]"
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 text-[var(--muted-foreground)] transition-transform",
            expanded && "rotate-180 text-[var(--foreground)]",
          )}
        />
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-200",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="space-y-1 border-t border-[var(--red-border)] px-2 py-2">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={onSelect}
                className="group flex items-center gap-2 rounded-sm px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.12em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {item.simpleIconSlug ? (
                  <SimpleIcon
                    slug={item.simpleIconSlug}
                    className="size-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--red)]"
                  />
                ) : (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--red)] opacity-70" />
                )}
                <span>{item.label}</span>
                {item.external && (
                  <ExternalLink className="ml-auto size-3 text-[var(--muted-foreground)] group-hover:text-[var(--red)]" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<CollapsibleSection, boolean>>({
    resources: false,
    projects: false,
    join: false,
  });

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenSections({
      resources: false,
      projects: false,
      join: false,
    });
  };

  const toggleSection = (section: CollapsibleSection) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-4 z-50 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"
    >
      <div className="panel flex items-center justify-between gap-3 rounded-lg px-3 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        {/* Left — OPS badge + Logo */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--red-border)] bg-[rgba(255,42,42,0.1)] px-2.5 py-1 text-[0.56rem] uppercase tracking-[0.2em] text-[var(--red)]">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--red)]"
              style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }}
            />
            OPS
          </span>
          <Link
            href="/"
            className="font-display hidden rounded-full px-2.5 py-1 text-[0.67rem] uppercase tracking-[0.26em] text-[var(--foreground)] transition-colors hover:text-white sm:inline-flex"
          >
            HALTMAN
          </Link>
        </div>

        {/* Center — Navigation */}
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
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-all hover:text-[var(--foreground)]",
                  active && "bg-[rgba(255,42,42,0.12)] text-[var(--foreground)]",
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}

          {/* Resources dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-all hover:text-[var(--foreground)]">
                RESOURCES <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-64 border-[var(--red-border)] bg-[rgba(5,5,5,0.96)] p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-[0.58rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Resources
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--red-border)]" />
              {resourceLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  asChild
                  className="cursor-pointer rounded-md"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="text-[0.64rem] uppercase tracking-[0.12em] text-[var(--foreground)]">
                      {link.label}
                    </span>
                    <ExternalLink className="ml-auto size-3 text-[var(--muted-foreground)] group-hover:text-[var(--red)]" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Projects dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-all hover:text-[var(--foreground)]">
                PROJECTS <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-64 border-[var(--red-border)] bg-[rgba(5,5,5,0.96)] p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-[0.58rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Active Projects
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--red-border)]" />
              {activeProjects.map((project) => (
                <DropdownMenuItem
                  key={project.href}
                  asChild
                  className="cursor-pointer rounded-md"
                >
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <span className="text-[0.64rem] uppercase tracking-[0.12em] text-[var(--foreground)]">
                      {project.name}
                    </span>
                    <ExternalLink className="ml-auto size-3 text-[var(--muted-foreground)] group-hover:text-[var(--red)]" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Join Us dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-all hover:text-[var(--foreground)]">
                JOIN US <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-56 border-[var(--red-border)] bg-[rgba(5,5,5,0.96)] p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-[0.58rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Community
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--red-border)]" />
              {socialLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  asChild
                  className="cursor-pointer rounded-md"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2"
                  >
                    <SimpleIcon
                      slug={link.simpleIconSlug}
                      className="size-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--red)]"
                    />
                    <span className="text-[0.64rem] uppercase tracking-[0.12em] text-[var(--foreground)]">
                      {link.label}
                    </span>
                    <ExternalLink className="ml-auto size-3 text-[var(--muted-foreground)] group-hover:text-[var(--red)]" />
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--red-border)] bg-[rgba(255,255,255,0.03)] text-[var(--foreground)] transition-colors hover:border-[var(--red)] lg:hidden"
        >
          {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="panel mt-2 rounded-lg p-3 shadow-[0_20px_40px_rgba(0,0,0,0.45)] lg:hidden"
        >
          <nav aria-label="Mobile primary" className="space-y-2">
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
                    onClick={closeMobileMenu}
                    className={cn(
                      "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-[0.58rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]",
                      active && "bg-[rgba(255,42,42,0.12)] text-[var(--foreground)]",
                    )}
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <MobileMenuSection
              label="RESOURCES"
              items={mobileExternalGroups.resources}
              expanded={openSections.resources}
              onToggle={() => toggleSection("resources")}
              onSelect={closeMobileMenu}
            />
            <MobileMenuSection
              label="PROJECTS"
              items={mobileExternalGroups.projects}
              expanded={openSections.projects}
              onToggle={() => toggleSection("projects")}
              onSelect={closeMobileMenu}
            />
            <MobileMenuSection
              label="JOIN US"
              items={mobileExternalGroups.join}
              expanded={openSections.join}
              onToggle={() => toggleSection("join")}
              onSelect={closeMobileMenu}
            />
          </nav>
        </div>
      )}
    </motion.header>
  );
}
