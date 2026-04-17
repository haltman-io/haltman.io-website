import type { Metadata } from "next";

export const SITE_URL = "https://haltman.io";
export const SITE_NAME = "Haltman.IO";
export const SITE_TITLE_TEMPLATE = "%s | Haltman.IO";
export const SITE_DEFAULT_TITLE =
  "Haltman.IO — Independent Brazilian Hackers | Privacy, Free Software & Infrastructure";
export const SITE_DEFAULT_DESCRIPTION =
  "Haltman.IO is an independent group of Brazilian hackers. Friends for over a decade, building public, privacy-first infrastructure and free software. No hype. No funding. No contracts.";
export const DEFAULT_OG_IMAGE = "/og.png";

type PageMetadataInput = {
  title: string;
  titleAbsolute?: boolean;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
};

function normalizePath(path: string | undefined): string {
  if (!path || path === "/") return "/";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const {
    title,
    titleAbsolute = false,
    description = SITE_DEFAULT_DESCRIPTION,
    path,
    image = DEFAULT_OG_IMAGE,
    imageAlt = `${title} — ${SITE_NAME}`,
    type = "website",
    publishedTime,
    authors,
    keywords,
    noIndex,
  } = input;

  const canonicalPath = normalizePath(path);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const metadataTitle = titleAbsolute ? { absolute: title } : title;

  return {
    title: metadataTitle,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: canonicalUrl },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: metadataTitle,
      description,
      url: canonicalUrl,
      locale: "en_US",
      images: [{ url: image, alt: imageAlt }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [image],
    },
  };
}
