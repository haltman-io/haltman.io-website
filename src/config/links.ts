export type CrewLink = {
  href: string;
  label: string;
  description: string;
};

export type SocialLink = {
  href: string;
  label: string;
  simpleIconSlug: string;
};

/** Resources: blog, docs */
export const resourceLinks: CrewLink[] = [
  {
    href: "https://blog.haltman.io",
    label: "blog.haltman.io",
    description: "Our official blog for sharing the news.",
  },
  {
    href: "https://dev.haltman.io",
    label: "dev.haltman.io",
    description: "Our current knowledge base for documentation and guides.",
  },
  {
    href: "https://docs.haltman.io",
    label: "docs.haltman.io (LEGACY)",
    description: "Our LEGACY knowledge base.",
  },
];

/** Social / community channels */
export const socialLinks: SocialLink[] = [
  {
    href: "https://infosec.exchange/@haltman",
    label: "Mastodon",
    simpleIconSlug: "mastodon",
  },
  {
    href: "https://bsky.app/profile/haltman.io",
    label: "Bluesky",
    simpleIconSlug: "bluesky",
  },
  {
    href: "https://t.me/haltman_group",
    label: "Telegram",
    simpleIconSlug: "telegram",
  },
  {
    href: "https://github.com/haltman-io",
    label: "GitHub",
    simpleIconSlug: "github",
  },

];

/** All external links combined (for footer modules, etc.) */
export const homepageLinks: CrewLink[] = [
  ...resourceLinks,
  {
    href: "https://github.com/haltman-io",
    label: "github.com/haltman-io",
    description: "Our official GitHub profile.",
  },
  {
    href: "https://t.me/haltman_group",
    label: "t.me/haltman_group",
    description: "Our official Telegram group.",
  },
];

export const contactEmails = ["root@haltman.io", "admin@haltman.io"] as const;
