import collectionsData from "@/data/collections.json";

export type CollectionCategory =
  | "tool"
  | "knowledge"
  | "infrastructure"
  | "community"
  | "our-work";

export type CollectionEntry = {
  name: string;
  href: string;
  description: string;
  category: CollectionCategory;
  tags: string[];
  source?: string;
  note?: string;
  featured?: boolean;
  legendary?: boolean;
  crewApproved?: boolean;
};

export const categoryLabels: Record<CollectionCategory, string> = {
  "our-work": "Our Work",
  tool: "Tools",
  infrastructure: "Infrastructure",
  knowledge: "Knowledge",
  community: "Community",
};

export const collections: CollectionEntry[] = collectionsData as CollectionEntry[];
