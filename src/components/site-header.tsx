"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ChevronDown, ExternalLink, Home, Library, User } from "lucide-react";
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
  { href: "/collections", label: "COLLECTIONS", icon: Library },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

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
            className="font-display rounded-full px-2.5 py-1 text-[0.67rem] uppercase tracking-[0.26em] text-[var(--foreground)] transition-colors hover:text-white"
          >
            HALTMAN
          </Link>
        </div>

        {/* Center — Navigation */}
        <nav aria-label="Primary" className="flex items-center gap-1">
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
      </div>
    </motion.header>
  );
}
