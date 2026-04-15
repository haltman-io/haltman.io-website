import linksData from "@/data/links.json";

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
export const resourceLinks: CrewLink[] = linksData.resourceLinks as CrewLink[];

/** Social / community channels */
export const socialLinks: SocialLink[] = linksData.socialLinks as SocialLink[];

/** All external links combined (for footer modules, etc.) */
export const homepageLinks: CrewLink[] = [
  ...resourceLinks,
  ...(linksData.homepageExtras as CrewLink[]),
];

export const contactEmails = linksData.contactEmails as readonly string[];
