import * as simpleIcons from "simple-icons";
import { contactEmails, resourceLinks, socialLinks } from "@/config/links";
import { activeProjects } from "@/config/projects";

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

export function Footer() {
  return (
    <footer className="border-t border-[var(--red-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contact */}
          <div>
            <p className="label-xs mb-6">Contact</p>
            <div className="space-y-2.5">
              {contactEmails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="block font-mono text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  {email}
                </a>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--red-border)] text-[var(--muted-foreground)] transition-all hover:border-[var(--red)] hover:text-[var(--red)]"
                >
                  <SimpleIcon slug={link.simpleIconSlug} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="label-xs mb-6">Resources</p>
            <div className="space-y-2.5">
              {resourceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="label-xs mb-4 mt-8">Projects</p>
            <div className="flex flex-wrap gap-2">
              {activeProjects.map((project) => (
                <a
                  key={project.href}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip"
                >
                  {project.shortLabel}
                </a>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div>
            <p className="label-xs mb-6">Notice</p>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              We do not engage in illegal activity. We break systems to
              understand them, not laws to avoid them. No affiliations. No
              franchises.
            </p>
            <a
              href="/join"
              className="mt-6 inline-block font-mono text-sm text-[var(--red)] transition-colors hover:text-white"
            >
              Join the collective &rarr;
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--red-border)] pt-8">
          <p className="font-mono text-xs text-[var(--muted-foreground)] opacity-50">
            Haltman.IO &middot; BR
          </p>
        </div>
      </div>
    </footer>
  );
}
