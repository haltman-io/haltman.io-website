"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import * as simpleIcons from "simple-icons";
import { socialLinks } from "@/config/links";

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

const emailRouting = [
  {
    address: "root@haltman.io",
    purpose: "General contact",
  },
  {
    address: "admin@haltman.io",
    purpose: "Technical inquiries",
  },
  {
    address: "abuse@haltman.io",
    purpose: "Abuse reports",
  },
];

const channelDescriptions: Record<string, string> = {
  Telegram: "Main open channel. Discussions, updates, and crew coordination.",
  GitHub: "Source code, issues, contributions. All projects are public.",
  Mastodon: "Decentralized social presence. Infosec community.",
  Bluesky: "Public updates and announcements.",
};

const resources = [
  {
    href: "https://blog.haltman.io",
    label: "blog.haltman.io",
    description: "News, releases, and field notes.",
  },
  {
    href: "https://dev.haltman.io",
    label: "dev.haltman.io",
    description: "Technical documentation and guides.",
  },
  {
    href: "https://docs.haltman.io",
    label: "docs.haltman.io",
    description: "Legacy knowledge base.",
  },
];

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-3xl font-bold text-[var(--red)] opacity-20">
        //
      </span>
      <span className="label-xs">{label}</span>
      <div className="h-px flex-1 bg-[var(--red-border)]" />
    </div>
  );
}

export function JoinHub() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl pb-16 sm:pb-20"
      >
        <div className="space-y-5 text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg sm:leading-relaxed">
          <p className="text-lg text-[var(--foreground)] sm:text-xl">
            Haltman.IO is not hiring.
            <br />
            We are not recruiting.
          </p>
          <p>
            We are not looking for investors, partners, or growth hackers.
          </p>
          <p>
            If you share our values &mdash; independence, transparency, public
            output, mutual aid, and free software &mdash; you might belong here.
          </p>
          <p>
            We do not have an application form.
            <br />
            We do not have interviews.
            <br />
            We do not have HR.
          </p>
          <p className="text-[var(--foreground)]">
            Reach out. Show your work. That is it.
          </p>
        </div>
      </motion.div>

      <div className="space-y-16 pb-24 sm:space-y-20 sm:pb-32">
        {/* Routing */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionDivider label="Routing" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {emailRouting.map((route) => (
              <a
                key={route.address}
                href={`mailto:${route.address}`}
                className="group panel rounded-lg p-5 transition-shadow hover:shadow-[0_0_30px_rgba(255,42,42,0.06)]"
              >
                <p className="font-mono text-sm text-[var(--foreground)] transition-colors group-hover:text-white">
                  {route.address}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {route.purpose}
                </p>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Channels */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionDivider label="Channels" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group panel flex items-start gap-4 rounded-lg p-5 transition-shadow hover:shadow-[0_0_30px_rgba(255,42,42,0.06)]"
              >
                <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--red-border)] bg-[var(--red-subtle)] text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--red)]">
                  <SimpleIcon slug={link.simpleIconSlug} className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[var(--foreground)]">
                      {link.label}
                    </p>
                    <ArrowUpRight className="size-4 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:text-[var(--red)] group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {channelDescriptions[link.label] || ""}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Resources */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionDivider label="Resources" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {resources.map((res) => (
              <a
                key={res.href}
                href={res.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group panel rounded-lg p-5 transition-shadow hover:shadow-[0_0_30px_rgba(255,42,42,0.06)]"
              >
                <p className="font-mono text-sm text-[var(--foreground)] transition-colors group-hover:text-white">
                  {res.label}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {res.description}
                </p>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Notice */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionDivider label="Notice" />
          <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
            <p>
              We do not engage in illegal activity. We break systems to
              understand them, not laws to avoid them.
            </p>
            <p>
              We are not affiliated with any other hacker group. We are not a
              franchise. We do not inherit politics. We do not inherit baggage.
            </p>
            <p>
              We do not sell access, memberships, certifications, or consulting
              services. Our work is public. Our output is free.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
