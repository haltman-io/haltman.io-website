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
    href: "https://docs.haltman.io",
    label: "docs.haltman.io",
    description: "Our official knowledge base.",
  },
];

/** Social / community channels */
export const socialLinks: SocialLink[] = [
  {
    href: "https://discord.gg/mCEs9TkdZ7",
    label: "Discord",
    simpleIconSlug: "discord",
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
  {
    href: "https://discord.gg/mCEs9TkdZ7",
    label: "dc.gg/mCEs9TkdZ7",
    description: "Our official Discord group.",
  },
];

export const contactEmails = ["root@haltman.io", "admin@haltman.io"] as const;
