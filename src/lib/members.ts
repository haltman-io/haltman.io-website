import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { cache } from "react";
import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { MemberProfileMeta } from "@/lib/member-types";

const MEMBER_CONTENT_DIR = path.join(process.cwd(), "src", "content", "members");
const MEMBER_FILE_EXTENSION = ".mdx";

type MemberProfileContent = ComponentType<{ components?: MDXComponents }>;

type MemberProfileModule = {
  default: MemberProfileContent;
  frontmatter?: unknown;
};

export type LoadedMemberProfile = {
  meta: MemberProfileMeta;
  Content: MemberProfileContent;
  filename: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectString(
  value: unknown,
  field: string,
  filename: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Invalid frontmatter in "${filename}": "${field}" must be a non-empty string.`,
    );
  }

  return value;
}

function normalizeMemberName(value: string): string {
  return value.trim().toLowerCase();
}

function parseMemberProfileMeta(
  frontmatter: unknown,
  filename: string,
): MemberProfileMeta {
  if (!isRecord(frontmatter)) {
    throw new Error(
      `Invalid frontmatter in "${filename}": expected a frontmatter object.`,
    );
  }

  return {
    slug: expectString(frontmatter.slug, "slug", filename),
    name: expectString(frontmatter.name, "name", filename),
    displayName: expectString(frontmatter.displayName, "displayName", filename),
    role: expectString(frontmatter.role, "role", filename),
    email: expectString(frontmatter.email, "email", filename),
    avatar: expectString(frontmatter.avatar, "avatar", filename),
  };
}

function assertUniqueMemberSlugs(members: LoadedMemberProfile[]): void {
  const memberBySlug = new Map<string, string>();

  for (const member of members) {
    const previousFilename = memberBySlug.get(member.meta.slug);

    if (previousFilename) {
      throw new Error(
        `Duplicate member slug "${member.meta.slug}" found in "${previousFilename}" and "${member.filename}". Slugs must be unique.`,
      );
    }

    memberBySlug.set(member.meta.slug, member.filename);
  }
}

function assertUniqueMemberNames(members: LoadedMemberProfile[]): void {
  const memberByName = new Map<string, string>();

  for (const member of members) {
    const normalizedName = normalizeMemberName(member.meta.name);
    const previousFilename = memberByName.get(normalizedName);

    if (previousFilename) {
      throw new Error(
        `Duplicate member name "${member.meta.name}" found in "${previousFilename}" and "${member.filename}". Member names must be unique.`,
      );
    }

    memberByName.set(normalizedName, member.filename);
  }
}

async function compileMemberProfile(source: string): Promise<MemberProfileModule> {
  return (await evaluate(source, {
    ...runtime,
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: "frontmatter" }],
    ],
  })) as MemberProfileModule;
}

async function getMemberFilenames(): Promise<string[]> {
  const entries = await fs.readdir(MEMBER_CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(MEMBER_FILE_EXTENSION))
    .map((entry) => entry.name)
    .sort();
}

async function loadMemberFromFilename(
  filename: string,
): Promise<LoadedMemberProfile> {
  const filepath = path.join(MEMBER_CONTENT_DIR, filename);
  const source = await fs.readFile(filepath, "utf8");
  const module = await compileMemberProfile(source);
  const meta = parseMemberProfileMeta(module.frontmatter, filename);

  return {
    meta,
    Content: module.default,
    filename,
  };
}

const getAllMembers = cache(async (): Promise<LoadedMemberProfile[]> => {
  const filenames = await getMemberFilenames();
  const members = await Promise.all(filenames.map(loadMemberFromFilename));

  assertUniqueMemberSlugs(members);
  assertUniqueMemberNames(members);

  return members.sort((left, right) => {
    return (
      left.meta.displayName.localeCompare(right.meta.displayName) ||
      left.meta.slug.localeCompare(right.meta.slug)
    );
  });
});

export async function getMemberStaticParams(): Promise<Array<{ slug: string }>> {
  const members = await getAllMembers();
  return members.map(({ meta }) => ({ slug: meta.slug }));
}

export async function getMemberProfileBySlug(
  slug: string,
): Promise<LoadedMemberProfile | null> {
  const members = await getAllMembers();
  return members.find((member) => member.meta.slug === slug) ?? null;
}

export async function getMemberProfileByName(
  name: string,
): Promise<LoadedMemberProfile | null> {
  const normalizedName = normalizeMemberName(name);
  const members = await getAllMembers();

  return (
    members.find((member) => {
      return normalizeMemberName(member.meta.name) === normalizedName;
    }) ?? null
  );
}
