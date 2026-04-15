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
import { getMemberProfileByName } from "@/lib/members";
import type {
  BlogPostAuthor,
  BlogPostEntry,
  BlogPostMeta,
} from "@/lib/blog-types";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");
const BLOG_FILE_EXTENSION = ".mdx";

type BlogPostContent = ComponentType<{ components?: MDXComponents }>;

type BlogPostModule = {
  default: BlogPostContent;
  frontmatter?: unknown;
};

type LoadedBlogPost = {
  meta: BlogPostMeta;
  Content: BlogPostContent;
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

function parseInlineAuthor(
  authorValue: Record<string, unknown>,
  filename: string,
): BlogPostAuthor {
  const name = expectString(authorValue.name, "author.name", filename);

  return {
    name,
    displayName:
      typeof authorValue.displayName === "string" &&
      authorValue.displayName.trim().length > 0
        ? authorValue.displayName
        : name,
    role: expectString(authorValue.role, "author.role", filename),
    avatar: expectString(authorValue.avatar, "author.avatar", filename),
    email:
      typeof authorValue.email === "string" && authorValue.email.trim().length > 0
        ? authorValue.email
        : undefined,
    profileSlug:
      typeof authorValue.profileSlug === "string" &&
      authorValue.profileSlug.trim().length > 0
        ? authorValue.profileSlug
        : undefined,
  };
}

async function resolveBlogPostAuthor(
  authorValue: unknown,
  filename: string,
): Promise<BlogPostAuthor> {
  if (typeof authorValue === "string") {
    const authorName = expectString(authorValue, "author", filename);
    const member = await getMemberProfileByName(authorName);

    if (!member) {
      throw new Error(
        `Unknown blog author "${authorName}" in "${filename}". Create a matching member profile in "src/content/members".`,
      );
    }

    return {
      name: member.meta.name,
      displayName: member.meta.displayName,
      role: member.meta.role,
      avatar: member.meta.avatar,
      email: member.meta.email,
      profileSlug: member.meta.slug,
    };
  }

  if (isRecord(authorValue)) {
    return parseInlineAuthor(authorValue, filename);
  }

  throw new Error(
    `Invalid frontmatter in "${filename}": "author" must be a non-empty string or an object.`,
  );
}

async function parseBlogPostMeta(
  frontmatter: unknown,
  filename: string,
): Promise<BlogPostMeta> {
  if (!isRecord(frontmatter)) {
    throw new Error(
      `Invalid frontmatter in "${filename}": expected a frontmatter object.`,
    );
  }

  const slug = expectString(frontmatter.slug, "slug", filename);
  const author = await resolveBlogPostAuthor(frontmatter.author, filename);

  const tagsValue = frontmatter.tags;
  if (!Array.isArray(tagsValue)) {
    throw new Error(
      `Invalid frontmatter in "${filename}": "tags" must be an array.`,
    );
  }

  return {
    slug,
    title: expectString(frontmatter.title, "title", filename),
    subtitle: expectString(frontmatter.subtitle, "subtitle", filename),
    date: expectString(frontmatter.date, "date", filename),
    dateFormatted: expectString(
      frontmatter.dateFormatted,
      "dateFormatted",
      filename,
    ),
    category: expectString(frontmatter.category, "category", filename),
    categorySlug: expectString(
      frontmatter.categorySlug,
      "categorySlug",
      filename,
    ),
    author,
    tags: tagsValue.map((tag, index) => {
      if (!isRecord(tag)) {
        throw new Error(
          `Invalid frontmatter in "${filename}": "tags[${index}]" must be an object.`,
        );
      }

      return {
        label: expectString(tag.label, `tags[${index}].label`, filename),
        slug: expectString(tag.slug, `tags[${index}].slug`, filename),
      };
    }),
  };
}

function assertUniquePostSlugs(posts: LoadedBlogPost[]): void {
  const postBySlug = new Map<string, string>();

  for (const post of posts) {
    const previousFilename = postBySlug.get(post.meta.slug);

    if (previousFilename) {
      throw new Error(
        `Duplicate blog post slug "${post.meta.slug}" found in "${previousFilename}" and "${post.filename}". Slugs must be unique.`,
      );
    }

    postBySlug.set(post.meta.slug, post.filename);
  }
}

async function compileBlogPost(source: string): Promise<BlogPostModule> {
  return (await evaluate(source, {
    ...runtime,
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: "frontmatter" }],
    ],
  })) as BlogPostModule;
}

async function getBlogFilenames(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(BLOG_FILE_EXTENSION))
    .map((entry) => entry.name)
    .sort();
}

async function loadPostFromFilename(filename: string): Promise<LoadedBlogPost> {
  const filepath = path.join(BLOG_CONTENT_DIR, filename);
  const source = await fs.readFile(filepath, "utf8");
  const module = await compileBlogPost(source);
  const meta = await parseBlogPostMeta(module.frontmatter, filename);

  return {
    meta,
    Content: module.default,
    filename,
  };
}

const getAllPosts = cache(async (): Promise<LoadedBlogPost[]> => {
  const filenames = await getBlogFilenames();
  const posts = await Promise.all(filenames.map(loadPostFromFilename));

  assertUniquePostSlugs(posts);

  return posts.sort((left, right) => {
    return (
      right.meta.date.localeCompare(left.meta.date) ||
      left.meta.slug.localeCompare(right.meta.slug)
    );
  });
});

export async function getBlogArchivePosts(): Promise<BlogPostEntry[]> {
  const posts = await getAllPosts();

  return posts.map(({ meta }) => ({
    slug: meta.slug,
    title: meta.title,
    description: meta.subtitle,
    date: meta.date,
    dateFormatted: meta.dateFormatted,
    category: meta.category,
    categorySlug: meta.categorySlug,
    author: {
      name: meta.author.name,
      avatar: meta.author.avatar,
    },
    tags: meta.tags.map((tag) => tag.slug),
  }));
}

export async function getBlogStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllPosts();
  return posts.map(({ meta }) => ({ slug: meta.slug }));
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<LoadedBlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.meta.slug === slug) ?? null;
}
