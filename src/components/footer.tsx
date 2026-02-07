import { ArrowUpRight } from "lucide-react";
import * as simpleIcons from "simple-icons";
import { contactEmails, socialLinks } from "@/config/links";
import { activeProjects } from "@/config/projects";

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

function EndpointChip({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="sys-chip"
    >
      <span className="sys-chip-dot" />
      {label}
      {external && <ArrowUpRight className="size-2.5 opacity-40 transition-opacity group-hover:opacity-100" />}
    </a>
  );
}

export function Footer() {
  return (
    <footer aria-label="System panel" className="space-y-0">
      {/* Top divider */}
      <div className="flex items-center gap-3 px-1 pb-4">
        <div className="h-px flex-1 bg-[var(--red-border)]" />
        <span className="text-[0.45rem] uppercase tracking-[0.3em] text-[var(--muted-foreground)] opacity-30">
          sys.panel
        </span>
        <div className="h-px flex-1 bg-[var(--red-border)]" />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {/* ── 01 CONTACT / ROUTING ── */}
        <div className="panel rounded-lg p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-display text-sm font-bold text-[var(--red)] opacity-25">
              01
            </span>
            <p className="label-xs">Contact / Routing</p>
          </div>

          <p className="text-[0.6rem] leading-relaxed uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            Route via email endpoint:
          </p>

          <div className="mt-3 flex flex-col gap-1.5">
            {contactEmails.map((email) => (
              <EndpointChip
                key={email}
                href={`mailto:${email}`}
                label={email}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex size-7 items-center justify-center rounded-sm border border-[var(--red-border)] text-[var(--muted-foreground)] transition-all hover:border-[var(--red)] hover:text-[var(--red)] hover:-translate-y-px hover:shadow-[0_0_8px_rgba(255,42,42,0.12)] focus-visible:border-[var(--red)] focus-visible:text-[var(--red)] focus-visible:shadow-[0_0_0_1px_var(--red)]"
              >
                <SimpleIcon slug={link.simpleIconSlug} className="size-3" />
              </a>
            ))}
          </div>
        </div>

        {/* ── 02 NOTICE / POLICY ── */}
        <div className="panel rounded-lg p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-display text-sm font-bold text-[var(--red)] opacity-25">
              02
            </span>
            <p className="label-xs">Notice</p>
          </div>

          <div className="rounded-md border border-[var(--red-border)] bg-[rgba(0,0,0,0.4)] p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--red)] opacity-50" />
              <span className="text-[0.48rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)] opacity-50">
                policy.txt
              </span>
            </div>
            <p className="text-[0.6rem] leading-[1.9] text-[var(--muted-foreground)]">
              We do not engage in illegal activity. 
              We break systems to understand them, not laws to avoid them.
              No affiliations. No franchises.
            </p>
          </div>
        </div>

        {/* ── 03 SYSTEM / MODULES ── */}
        <div className="panel rounded-lg p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-display text-sm font-bold text-[var(--red)] opacity-25">
              03
            </span>
            <p className="label-xs">System / Modules</p>
          </div>

          <p className="text-[0.48rem] uppercase tracking-[0.14em] text-[var(--muted-foreground)] opacity-50">
            Modules
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {activeProjects.map((project) => (
              <EndpointChip
                key={project.href}
                href={project.href}
                label={project.shortLabel}
                external
              />
            ))}
          </div>

          <div className="mt-4 border-t border-[var(--red-border)] pt-3">
            <p className="text-[0.48rem] uppercase tracking-[0.12em] text-[var(--muted-foreground)] opacity-30">
              Powered by haltman.io &middot; BR
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
