import "server-only";

import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const BLOG_CONTENT_DIR = path.join(ROOT_DIR, "src", "content", "blog");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const MANIFEST_PATH = path.join(ROOT_DIR, ".generated", "blog-image-manifest.json");
const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);

type BlogImageManifestEntry = {
  contentHash: string;
  imageId: string;
  sourcePath: string;
  url: string;
};

type BlogImageManifest = {
  adapter: "cloudflare" | "local";
  generatedAt: string;
  images: Record<string, BlogImageManifestEntry>;
  variant: string;
  version: number;
};

let manifestCache: BlogImageManifest | null | undefined;

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}

function splitReference(reference: string): {
  pathPart: string;
  suffix: string;
} {
  const match = /^([^?#]+)([?#].*)?$/u.exec(reference);

  return {
    pathPart: match?.[1] ?? reference,
    suffix: match?.[2] ?? "",
  };
}

function isLocalImageReference(reference: string): boolean {
  const { pathPart } = splitReference(reference);

  if (!pathPart || /^(?:[a-z]+:|data:)/iu.test(pathPart)) {
    return false;
  }

  return SUPPORTED_IMAGE_EXTENSIONS.has(path.extname(pathPart).toLowerCase());
}

function createSourcePathCandidates(
  src: string,
  sourceFilename: string,
): string[] {
  const { pathPart } = splitReference(src);

  if (pathPart.startsWith("/")) {
    const publicAssetPath = path.join(PUBLIC_DIR, pathPart.slice(1));

    return [normalizePath(path.relative(ROOT_DIR, publicAssetPath))];
  }

  const sourceFilePath = path.join(BLOG_CONTENT_DIR, sourceFilename);
  const relativeCandidate = normalizePath(
    path.relative(ROOT_DIR, path.resolve(path.dirname(sourceFilePath), pathPart)),
  );
  const rootCandidate = normalizePath(
    path.relative(ROOT_DIR, path.resolve(ROOT_DIR, pathPart)),
  );

  return relativeCandidate === rootCandidate
    ? [relativeCandidate]
    : [relativeCandidate, rootCandidate];
}

function loadManifest(): BlogImageManifest | null {
  if (manifestCache !== undefined) {
    return manifestCache;
  }

  if (!fs.existsSync(MANIFEST_PATH)) {
    manifestCache = null;
    return manifestCache;
  }

  manifestCache = JSON.parse(
    fs.readFileSync(MANIFEST_PATH, "utf8"),
  ) as BlogImageManifest;

  return manifestCache;
}

export function resolveBlogImageSrc(
  src: string | undefined,
  sourceFilename: string,
): string | undefined {
  if (typeof src !== "string" || !isLocalImageReference(src)) {
    return src;
  }

  const manifest = loadManifest();

  if (!manifest) {
    throw new Error(
      `Missing blog image manifest for "${sourceFilename}". Run "npm run blog-images:prepare" or use the wrapped "npm run dev" and "npm run build" commands.`,
    );
  }

  const { suffix } = splitReference(src);
  const sourcePathKey = createSourcePathCandidates(src, sourceFilename).find(
    (candidate) => manifest.images[candidate],
  );

  if (!sourcePathKey) {
    throw new Error(
      `Blog image "${src}" referenced in "${sourceFilename}" was not prepared by the image adapter. Checked: ${createSourcePathCandidates(
        src,
        sourceFilename,
      ).join(", ")}. Verify the file exists and rerun the build preparation step.`,
    );
  }

  const entry = manifest.images[sourcePathKey];

  return `${entry.url}${suffix}`;
}