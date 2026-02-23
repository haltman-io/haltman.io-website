export type CollectionItem = {
  name: string;
  href: string;
  description: string;
  tag: "search-engine" | "magazine" | "tool" | "database" | "community" | "reference";
};

export const collections: CollectionItem[] = [
  {
    name: "MAIL.THC.ORG (BROWSER-EXTENSION)",
    href: "https://addons.mozilla.org/en-US/firefox/addon/email-alias-manager-free/",
    description: "Mozilla Firefox extension to MANAGE ALIASES on the fly, powered by MAIL.THC.ORG.",
    tag: "tool",
  },
  {
    name: "MAIL.THC.ORG",
    href: "https://mail.thc.org/",
    description: "This project allows you to set up an email forward from 17 domains to any email address.",
    tag: "tool",
  },
  {
    name: "IP.THC.ORG",
    href: "https://ip.thc.org",
    description: "World's largest Internet Domain Database. Currently Indexing 5.14+ billion domains.",
    tag: "database",
  },
  {
    name: "SEGFAULT.NET",
    href: "https://www.thc.org/segfault/",
    description: "Disposable Root Servers.",
    tag: "tool",
  },
  {
    name: "GSOCKET.IO",
    href: "https://www.gsocket.io/",
    description: "Connect like there is no firewall. Securely.",
    tag: "tool",
  },
  {
    name: "PHRACK.ORG",
    href: "https://www.phrack.org",
    description:
      "Written by hackers, for hackers — a glimpse into the world just beyond what most people see.",
    tag: "magazine",
  },
];
