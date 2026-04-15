import type { AuthorProfile } from "@/lib/member-types";

export interface BlogPostTag {
  label: string;
  slug: string;
}

export interface BlogPostAuthor extends AuthorProfile {}

export interface BlogPostMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  dateFormatted: string;
  category: string;
  categorySlug: string;
  author: BlogPostAuthor;
  tags: BlogPostTag[];
}

export interface BlogPostEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateFormatted: string;
  category: string;
  categorySlug: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}
