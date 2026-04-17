import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getBlogStaticParams } from "@/lib/blog";
import { getMemberStaticParams } from "@/lib/members";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const APP_DIR = path.join(process.cwd(), "src", "app");
const PAGE_FILE_PATTERN = /^page\.(tsx|ts|jsx|js|mdx|md)$/;

async function findStaticRoutes(
  dir: string,
  routeSegments: string[] = [],
): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (entry.isFile() && PAGE_FILE_PATTERN.test(entry.name)) {
      const pathname = routeSegments.length
        ? `/${routeSegments.join("/")}/`
        : "/";
      routes.push(pathname);
      continue;
    }

    if (!entry.isDirectory()) continue;

    const name = entry.name;
    if (name.startsWith("_") || name.startsWith(".")) continue;
    if (name.startsWith("[") && name.endsWith("]")) continue;
    if (name.startsWith("(") && name.endsWith(")")) {
      const nested = await findStaticRoutes(path.join(dir, name), routeSegments);
      routes.push(...nested);
      continue;
    }

    const nested = await findStaticRoutes(path.join(dir, name), [
      ...routeSegments,
      name,
    ]);
    routes.push(...nested);
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = await findStaticRoutes(APP_DIR);
  const [blogSlugs, memberSlugs] = await Promise.all([
    getBlogStaticParams(),
    getMemberStaticParams(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map(({ slug }) => ({
    url: `${SITE_URL}/blog/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const memberEntries: MetadataRoute.Sitemap = memberSlugs.map(({ slug }) => ({
    url: `${SITE_URL}/members/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries, ...memberEntries];
}
