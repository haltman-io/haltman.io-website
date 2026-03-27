export type ProjectTag = "service" | "cli" | "docs" | "blog";

export type Project = {
  name: string;
  href: string;
  description: string;
  tag: ProjectTag;
  shortLabel: string;
  year: number;
  featured?: boolean;
};

export const tagLabels: Record<ProjectTag, string> = {
  service: "Service",
  cli: "CLI",
  docs: "Docs",
  blog: "Blog",
};

export const projects: Project[] = [
  // ═══════════════════════════════════════════
  // 2026
  // ═══════════════════════════════════════════
  {
    name: "Free Mail Forwarding",
    href: "https://forward.haltman.io/",
    description:
      "Free email forwarder with 17 domains. Unlimited aliases. No tracking.",
    tag: "service",
    shortLabel: "Mail Forwarding",
    year: 2026,
    featured: true,
  },
  {
    name: "Haltman.IO Dev Docs",
    href: "https://dev.haltman.io",
    description:
      "Technical documentation, guides, and developer knowledge base.",
    tag: "docs",
    shortLabel: "Dev Docs",
    year: 2026,
    featured: true,
  },
  {
    name: "Haltman.IO Blog",
    href: "https://blog.haltman.io",
    description: "News, releases, and field notes from the crew.",
    tag: "blog",
    shortLabel: "Blog",
    year: 2026,
  },

  // ═══════════════════════════════════════════
  // 2025
  // ═══════════════════════════════════════════
  {
    name: "Brave-Search",
    href: "https://github.com/haltman-io/brave-search",
    description:
      "CLI tool for Brave Search API. Search the web from your terminal.",
    tag: "cli",
    shortLabel: "Brave-Search",
    year: 2025,
    featured: true,
  },
  {
    name: "IP-THC",
    href: "https://github.com/haltman-io/ip-thc",
    description:
      "Query over 4.7 billion mapped assets from the terminal.",
    tag: "cli",
    shortLabel: "IP-THC",
    year: 2025,
    featured: true,
  },
  {
    name: "Sub-Alter",
    href: "https://github.com/haltman-io/sub-alter",
    description: "Domain and subdomain discovery for reconnaissance.",
    tag: "cli",
    shortLabel: "Sub-Alter",
    year: 2025,
    featured: true,
  },
  {
    name: "Reverse-Whois",
    href: "https://github.com/haltman-io/reverse-whois",
    description:
      "Reverse WHOIS lookup. Find all domains registered by an entity.",
    tag: "cli",
    shortLabel: "Reverse-Whois",
    year: 2025,
  },
  {
    name: "Search-Leaks",
    href: "https://github.com/haltman-io/search-leaks",
    description:
      "Query data breach and leak statistics from the command line.",
    tag: "cli",
    shortLabel: "Search-Leaks",
    year: 2025,
  },
];

// Used by footer
export const activeProjects = projects;
export type ActiveProject = Project;
