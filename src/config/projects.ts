export type ActiveProject = {
  name: string;
  href: string;
  description: string;
  tag: "service" | "cli-tool";
  shortLabel: string;
};

export const activeProjects: ActiveProject[] = [
  {
    name: "Free Mail Forwarding",
    href: "https://forward.haltman.io/",
    description: "Free email forwarder with 17 domains available to create unlimited aliases.",
    tag: "service",
    shortLabel: "Mail Forwarding",
  },
  {
    name: "Brave-Search",
    href: "https://github.com/haltman-io/brave-search",
    description: "CLI tool for Brave Search API",
    tag: "cli-tool",
    shortLabel: "Brave-Search",
  },
  {
    name: "IP-THC",
    href: "https://github.com/haltman-io/ip-thc",
    description:
      "CLI tool to perform queries on over 4.7 billion mapped assets",
    tag: "cli-tool",
    shortLabel: "IP-THC",
  },
  {
    name: "Sub-Alter",
    href: "https://github.com/haltman-io/sub-alter",
    description: "CLI tool for Domains/Subdomains Discovery",
    tag: "cli-tool",
    shortLabel: "Sub-Alter",
  },
  {
    name: "Reverse-Whois",
    href: "https://github.com/haltman-io/reverse-whois",
    description: "CLI tool for Reverse WHOIS queries",
    tag: "cli-tool",
    shortLabel: "Reverse-Whois",
  },
  {
    name: "Search-Leaks",
    href: "https://github.com/haltman-io/search-leaks",
    description: "CLI tool to query data breach/leak statistics",
    tag: "cli-tool",
    shortLabel: "Search-Leaks",
  },
];
