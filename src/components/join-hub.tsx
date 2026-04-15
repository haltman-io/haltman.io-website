"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, BookText, Mail, ShieldCheck } from "lucide-react";
import * as simpleIcons from "simple-icons";
import { contactEmails, resourceLinks, socialLinks } from "@/config/links";

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

type DirectoryItem = {
  label: string;
  href: string;
  eyebrow: string;
  description: string;
  destination: string;
  icon: ReactNode;
};

const emailRouting: Record<
  string,
  { eyebrow: string; description: string }
> = {
  "root@haltman.io": {
    eyebrow: "General contact",
    description:
      "First route for public communication, introductions, and anything that does not already have a narrower owner.",
  },
  "admin@haltman.io": {
    eyebrow: "Technical route",
    description:
      "Infrastructure questions, documentation issues, public systems, and anything operational that needs a precise handoff.",
  },
};

const channelDescriptions: Record<string, string> = {
  Telegram:
    "Main public channel for discussion, updates, and direct contact with the crew's open surface.",
  GitHub:
    "Source code, issue tracking, release history, and the most concrete way to inspect public output.",
  Mastodon:
    "Verified federated profile for short updates and public infosec-facing communication.",
  Bluesky:
    "Secondary public profile for announcements, links, and outward-facing posts.",
};

function getDestinationLabel(href: string): string {
  if (href.startsWith("mailto:")) {
    return href.replace(/^mailto:/, "");
  }

  try {
    const url = new URL(href);
    return `${url.host}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return href;
  }
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function DirectoryRow({
  item,
  isLast,
}: {
  item: DirectoryItem;
  isLast?: boolean;
}) {
  const rowClasses = [
    "group relative block overflow-hidden bg-[linear-gradient(90deg,rgba(255,42,42,0.03),transparent_18%,transparent)] px-5 py-5 transition-[background-color,border-color,transform] duration-200 hover:border-[rgba(255,42,42,0.4)] hover:bg-[linear-gradient(90deg,rgba(255,42,42,0.08),rgba(255,255,255,0.02)_22%,transparent_72%)] sm:px-7 sm:py-6 lg:px-8",
    !isLast ? "border-b border-[rgba(255,42,42,0.12)]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const linkProps = isExternalHref(item.href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a href={item.href} className={rowClasses} {...linkProps}>
      <div className="pointer-events-none absolute left-0 top-5 h-12 w-px bg-[linear-gradient(180deg,rgba(255,42,42,0),rgba(255,42,42,0.8),rgba(255,42,42,0))]" />

      <div className="relative z-10 grid gap-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_12rem] sm:items-start lg:grid-cols-[4rem_minmax(0,1fr)_13rem]">
        <div className="flex items-center">
          <div className="flex size-10 shrink-0 items-center justify-center border border-[var(--red-border)] bg-[rgba(255,42,42,0.07)] text-[#bdbdbd] transition-colors duration-200 group-hover:text-[var(--red)] sm:size-11">
            {item.icon}
          </div>
        </div>

        <div className="min-w-0 pr-1 sm:pr-4 lg:pr-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8c8c8c]">
            {item.eyebrow}
          </p>
          <h3 className="mt-2 max-w-[26ch] text-[1.05rem] font-semibold leading-[1.05] tracking-[0.01em] text-white transition-colors duration-200 group-hover:text-[#fff1f1] sm:text-[1.18rem]">
            {item.label}
          </h3>
          <p className="mt-3 max-w-[68ch] text-sm leading-7 text-[var(--muted-foreground)]">
            {item.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 sm:min-w-[12rem] sm:flex-col sm:items-end lg:min-w-[13rem]">
          <ArrowUpRight className="size-4 shrink-0 text-[#666] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--red)]" />

          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666]">
              Destination
            </p>
            <p className="mt-2 break-all font-mono text-[10px] tracking-[0.08em] text-[#adadad]">
              {item.destination}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

function DirectorySection({
  sectionLabel,
  title,
  subtitle,
  items,
}: {
  sectionLabel?: string;
  title: string;
  subtitle: string;
  items: DirectoryItem[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(12,12,12,0.92),rgba(6,6,6,0.98))] shadow-[0_18px_38px_rgba(0,0,0,0.28)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,42,42,0.85),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.03)_0,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_22px)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-14 w-14 border-r border-t border-[rgba(255,42,42,0.14)]" />

      <div className="relative z-10 border-b border-[rgba(255,42,42,0.12)] px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
        <div>
          <div>
            {sectionLabel ? (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)]">
                {sectionLabel}
              </p>
            ) : null}
            <h2
              className={`${sectionLabel ? "mt-3 " : ""}text-2xl font-semibold tracking-[0.01em] text-white sm:text-[1.9rem]`}
            >
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-[0.97rem]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div>
        {items.map((item, index) => (
          <DirectoryRow
            key={`${sectionLabel}-${item.href}`}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </motion.section>
  );
}

export function JoinHub() {
  const contactItems: DirectoryItem[] = contactEmails.map((email) => ({
    label: email,
    href: `mailto:${email}`,
    eyebrow: emailRouting[email]?.eyebrow ?? "Official inbox",
    description:
      emailRouting[email]?.description ??
      "Direct route maintained by the collective.",
    destination: email,
    icon: <Mail className="size-4" />,
  }));

  const profileItems: DirectoryItem[] = socialLinks.map((link) => ({
    label: link.label,
    href: link.href,
    eyebrow: "Official profile",
    description:
      channelDescriptions[link.label] ??
      "Verified external profile for public communication.",
    destination: getDestinationLabel(link.href),
    icon: <SimpleIcon slug={link.simpleIconSlug} className="size-4" />,
  }));

  const referenceItems: DirectoryItem[] = resourceLinks.map((link) => ({
    label: link.label,
    href: link.href,
    eyebrow: "Public reference",
    description: link.description,
    destination: getDestinationLabel(link.href),
    icon: <BookText className="size-4" />,
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
      <div className="space-y-16 pb-24 sm:space-y-20 sm:pb-32">
        <DirectorySection
          sectionLabel={undefined}
          title="Official contact routes"
          subtitle="Use these inboxes when you need to reach the collective directly. They are the narrow public routes maintained on purpose."
          items={contactItems}
        />

        <DirectorySection
          sectionLabel={undefined}
          title="Official network profiles"
          subtitle="Verified external surfaces for updates, source code, open discussion, and public-facing contact."
          items={profileItems}
        />

        <DirectorySection
          sectionLabel="References"
          title="Public references"
          subtitle="Places where the collective publishes notes, documentation, and release context."
          items={referenceItems}
        />

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden border border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(12,12,12,0.92),rgba(6,6,6,0.98))] shadow-[0_18px_38px_rgba(0,0,0,0.28)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,42,42,0.85),transparent)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-14 w-14 border-r border-t border-[rgba(255,42,42,0.14)]" />

          <div className="relative z-10 border-b border-[rgba(255,42,42,0.12)] px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)]">
                  Participation
                </p>
                <h2 className="mt-3 flex items-center gap-3 text-2xl font-semibold tracking-[0.01em] text-white sm:text-[1.9rem]">
                  <ShieldCheck className="size-5 text-[var(--red)]" />
                  How to approach
                </h2>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                No HR / no recruiting / no funnel
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-8 px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-8">
            <div className="space-y-4 text-sm leading-7 text-[var(--muted-foreground)] sm:text-[0.97rem]">
              <p className="text-[var(--foreground)]">
                This is not a hiring page. It is the directory people should use
                when they want to reach Haltman.IO, find official profiles, or
                make a credible approach.
              </p>
              <p>
                If you want to be part of the orbit, keep it direct. Use one of
                the official routes above, point to public work, and make it
                obvious why you are writing.
              </p>
              <p>
                Cold partnership decks, recruiting mail, investor outreach, and
                vague introductions without evidence are noise. Repositories,
                research, writing, and operational work are signal.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)]">
                  Signal
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  <li className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[var(--red)]" />
                    <span>Link public work, repos, write-ups, or research.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[var(--red)]" />
                    <span>Say why you are reaching out and what route fits.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[var(--red)]" />
                    <span>Use only the official profiles and inboxes listed here.</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f8f8f]">
                  Noise
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  <li className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[#5f5f5f]" />
                    <span>Recruiting pipelines, investor decks, and generic pitches.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[#5f5f5f]" />
                    <span>Requests for private access, paid membership, or consultancy.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-[#5f5f5f]" />
                    <span>Messages with no work attached and no concrete reason to exist.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
