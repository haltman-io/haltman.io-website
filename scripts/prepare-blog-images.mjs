import { createHash } from "node:crypto";
import fs from "node:fs";
import { promises as fsPromises } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = process.cwd();
const ENV_FILENAMES = [".env", ".env.local"];
const BLOG_CONTENT_DIR = path.join(ROOT_DIR, "src", "content", "blog");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const GENERATED_DIR = path.join(ROOT_DIR, ".generated");
const MANIFEST_PATH = path.join(GENERATED_DIR, "blog-image-manifest.json");
const LOCAL_OUTPUT_DIR = path.join(
  ROOT_DIR,
  "public",
  "__generated",
  "blog-images",
);
const BLOG_FILE_EXTENSION = ".mdx";
const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);

const POST_IMAGE_PATTERN = /<PostImage\b[\s\S]*?\bsrc=("|')([^"']+)\1[\s\S]*?\/?>/g;
const HTML_IMAGE_PATTERN = /<img\b[\s\S]*?\bsrc=("|')([^"']+)\1[\s\S]*?\/?>/g;
const MARKDOWN_IMAGE_PATTERN = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function parseEnvValue(rawValue) {
  const trimmed = rawValue.trim();

  if (trimmed.length === 0) {
    return "";
  }

  const quote = trimmed[0];
  const isQuoted =
    (quote === '"' || quote === "'") && trimmed.endsWith(quote) && trimmed.length >= 2;

  if (!isQuoted) {
    return trimmed;
  }

  return trimmed
    .slice(1, -1)
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function loadEnvFile(filepath) {
  if (!fs.existsSync(filepath)) {
    return;
  }

  const source = fs.readFileSync(filepath, "utf8");

  for (const rawLine of source.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalizedLine = line.startsWith("export ")
      ? line.slice("export ".length).trim()
      : line;
    const separatorIndex = normalizedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    const value = normalizedLine.slice(separatorIndex + 1);
    process.env[key] = parseEnvValue(value);
  }
}

function loadProjectEnvFiles() {
  for (const filename of ENV_FILENAMES) {
    loadEnvFile(path.join(ROOT_DIR, filename));
  }
}

loadProjectEnvFiles();

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function sanitizeSegment(value) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return sanitized || "asset";
}

function splitReference(reference) {
  const match = /^([^?#]+)([?#].*)?$/u.exec(reference);

  return {
    pathPart: match?.[1] ?? reference,
    suffix: match?.[2] ?? "",
  };
}

function isLocalImageReference(reference) {
  const { pathPart } = splitReference(reference);

  if (!pathPart || /^(?:[a-z]+:|data:)/iu.test(pathPart)) {
    return false;
  }

  return SUPPORTED_IMAGE_EXTENSIONS.has(
    path.extname(pathPart).toLowerCase(),
  );
}

function buildImageSourceCandidates(pathPart, mdxFilepath) {
  if (pathPart.startsWith("/")) {
    const publicAssetPath = path.join(PUBLIC_DIR, pathPart.slice(1));

    return [
      {
        absolutePath: publicAssetPath,
        sourceRelativePath: normalizePath(path.relative(ROOT_DIR, publicAssetPath)),
      },
    ];
  }

  const sourceFileDirectory = path.dirname(mdxFilepath);
  const relativeCandidate = path.resolve(sourceFileDirectory, pathPart);
  const projectRootCandidate = path.resolve(ROOT_DIR, pathPart);
  const candidates = [
    {
      absolutePath: relativeCandidate,
      sourceRelativePath: normalizePath(path.relative(ROOT_DIR, relativeCandidate)),
    },
  ];

  if (projectRootCandidate !== relativeCandidate) {
    candidates.push({
      absolutePath: projectRootCandidate,
      sourceRelativePath: normalizePath(path.relative(ROOT_DIR, projectRootCandidate)),
    });
  }

  return candidates;
}

async function resolveLocalImageSource(reference, mdxFilepath) {
  const { pathPart } = splitReference(reference);
  const candidates = buildImageSourceCandidates(pathPart, mdxFilepath);
  const attemptedPaths = [];

  for (const candidate of candidates) {
    attemptedPaths.push(candidate.sourceRelativePath);

    try {
      const stats = await fsPromises.stat(candidate.absolutePath);

      if (stats.isFile()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  throw new Error(
    `Blog image reference "${reference}" in "${normalizePath(
      path.relative(ROOT_DIR, mdxFilepath),
    )}" was not found. Checked: ${attemptedPaths.join(", ")}`,
  );
}

function createLogger(logger) {
  return {
    info(message) {
      logger.log(`[blog-images] ${message}`);
    },
    asset(action, details) {
      logger.log(
        `[blog-images] ${action} | source=${details.sourcePath} | ref=${details.reference}${details.imageId ? ` | imageId=${details.imageId}` : ""}${details.url ? ` | url=${details.url}` : ""}`,
      );
    },
  };
}

function stripFencedCodeBlocks(source) {
  const lines = source.split(/\r?\n/u);
  const stripped = [];
  let fenceMarker = null;

  for (const line of lines) {
    const trimmed = line.trimStart();
    const marker = trimmed.startsWith("```")
      ? "```"
      : trimmed.startsWith("~~~")
        ? "~~~"
        : null;

    if (marker) {
      if (fenceMarker === marker) {
        fenceMarker = null;
      } else if (fenceMarker === null) {
        fenceMarker = marker;
      }

      stripped.push("");
      continue;
    }

    stripped.push(fenceMarker ? "" : line);
  }

  return stripped.join("\n");
}

function collectImageReferences(source) {
  const searchableSource = stripFencedCodeBlocks(source);
  const references = new Set();

  for (const pattern of [
    POST_IMAGE_PATTERN,
    HTML_IMAGE_PATTERN,
    MARKDOWN_IMAGE_PATTERN,
  ]) {
    pattern.lastIndex = 0;

    for (const match of searchableSource.matchAll(pattern)) {
      const reference = match[2] ?? match[1];

      if (reference && isLocalImageReference(reference)) {
        references.add(reference);
      }
    }
  }

  return [...references];
}

function getMimeType(filepath) {
  switch (path.extname(filepath).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function buildAssetTarget(sourceRelativePath, contentHash) {
  const extension = path.extname(sourceRelativePath).toLowerCase();
  const hashSuffix = contentHash.slice(0, 20);
  const relativeToBlogContent = normalizePath(
    path.relative(BLOG_CONTENT_DIR, path.join(ROOT_DIR, sourceRelativePath)),
  );
  const fallbackRelativePath = normalizePath(sourceRelativePath);
  const basePath = relativeToBlogContent.startsWith("..")
    ? fallbackRelativePath
    : relativeToBlogContent;
  const withoutExtension = basePath.slice(0, -extension.length);
  const rawSegments = withoutExtension.split("/").filter(Boolean);
  const safeSegments = rawSegments.map(sanitizeSegment);
  const filename = safeSegments.pop() ?? "image";
  const directoryPrefix = safeSegments.length > 0 ? `${safeSegments.join("/")}/` : "";
  const outputFilename = `${filename}-${hashSuffix}${extension}`;

  return {
    imageId: `blog/${directoryPrefix}${outputFilename}`,
    localRelativePath: `${directoryPrefix}${outputFilename}`,
  };
}

async function listBlogMdxFiles() {
  const entries = await fsPromises.readdir(BLOG_CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(BLOG_FILE_EXTENSION))
    .map((entry) => path.join(BLOG_CONTENT_DIR, entry.name))
    .sort();
}

async function createCloudflareRequest(config, apiPath, init = {}) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}${apiPath}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        ...(init.headers ?? {}),
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    const message = payload?.errors?.[0]?.message ?? response.statusText;
    throw new Error(
      `Cloudflare Images request failed for "${apiPath}": ${message}`,
    );
  }

  return payload.result;
}

function pickVariantUrl(image, variantName) {
  const exactVariant = image?.variants?.find((url) => url.endsWith(`/${variantName}`));

  if (!exactVariant) {
    throw new Error(
      `Cloudflare image "${image?.id ?? "unknown"}" is missing the "${variantName}" variant.`,
    );
  }

  return exactVariant;
}

async function ensureCloudflareImage(config, asset) {
  const existingImage = await createCloudflareRequest(
    config,
    `/images/v1/${encodeURIComponent(asset.imageId)}`,
  );

  if (existingImage) {
    return {
      state: "reused",
      url: pickVariantUrl(existingImage, config.variant),
    };
  }

  const form = new FormData();
  form.set("id", asset.imageId);
  form.set(
    "metadata",
    JSON.stringify({
      adapter: "blog-image-adapter",
      contentHash: asset.contentHash,
      sourcePath: asset.sourceRelativePath,
    }),
  );
  form.set("requireSignedURLs", "false");
  form.set(
    "file",
    new Blob([asset.buffer], { type: getMimeType(asset.absolutePath) }),
    path.basename(asset.absolutePath),
  );

  const uploadedImage = await createCloudflareRequest(config, "/images/v1", {
    method: "POST",
    body: form,
  });

  return {
    state: "uploaded",
    url: pickVariantUrl(uploadedImage, config.variant),
  };
}

function readAdapterMode() {
  return process.env.BLOG_IMAGE_ADAPTER?.trim().toLowerCase() === "cloudflare"
    ? "cloudflare"
    : "local";
}

function getCloudflareConfig() {
  const variant = process.env.CLOUDFLARE_IMAGES_VARIANT?.trim() || "public";

  return {
    variant,
    accountId: process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID?.trim(),
    apiToken: process.env.CLOUDFLARE_IMAGES_API_TOKEN?.trim(),
  };
}

function assertCloudflareConfig(config) {
  const missing = [
    ["CLOUDFLARE_IMAGES_ACCOUNT_ID", config.accountId],
    ["CLOUDFLARE_IMAGES_API_TOKEN", config.apiToken],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `BLOG_IMAGE_ADAPTER=cloudflare requires ${missing.join(", ")}.`,
    );
  }
}

export async function prepareBlogImages({ logger = console } = {}) {
  const log = createLogger(logger);
  const adapter = readAdapterMode();
  const cloudflareConfig = getCloudflareConfig();

  log.info(
    `starting prepare step with adapter=${adapter} variant=${cloudflareConfig.variant}`,
  );

  if (adapter === "cloudflare") {
    assertCloudflareConfig(cloudflareConfig);
    log.info("Cloudflare adapter enabled; credentials found in environment");
  }

  await fsPromises.mkdir(GENERATED_DIR, { recursive: true });
  await fsPromises.rm(LOCAL_OUTPUT_DIR, { recursive: true, force: true });

  const mdxFiles = await listBlogMdxFiles();
  const assetSources = new Map();

  log.info(`scanning ${mdxFiles.length} blog post files for local image references`);

  for (const mdxFile of mdxFiles) {
    const source = await fsPromises.readFile(mdxFile, "utf8");
    const references = collectImageReferences(source);

    if (references.length > 0) {
      log.info(
        `found ${references.length} local image reference(s) in ${normalizePath(
          path.relative(ROOT_DIR, mdxFile),
        )}`,
      );
    }

    for (const reference of references) {
      const resolvedImageSource = await resolveLocalImageSource(reference, mdxFile);
      const { absolutePath, sourceRelativePath } = resolvedImageSource;

      if (!assetSources.has(sourceRelativePath)) {
        assetSources.set(sourceRelativePath, {
          absolutePath,
          reference,
          sourceRelativePath,
        });

        log.asset("resolved", {
          reference,
          sourcePath: sourceRelativePath,
        });
      }
    }
  }

  if (assetSources.size === 0) {
    log.info("no local blog images were found; nothing to upload or copy");
  }

  const manifest = {
    version: 1,
    adapter,
    generatedAt: new Date().toISOString(),
    variant: cloudflareConfig.variant,
    images: {},
  };

  let copied = 0;
  let uploaded = 0;
  let reused = 0;

  if (adapter === "local" && assetSources.size > 0) {
    await fsPromises.mkdir(LOCAL_OUTPUT_DIR, { recursive: true });
  }

  for (const assetSource of assetSources.values()) {
    const buffer = await fsPromises.readFile(assetSource.absolutePath);
    const contentHash = createHash("sha256").update(buffer).digest("hex");
    const target = buildAssetTarget(assetSource.sourceRelativePath, contentHash);
    const asset = {
      ...assetSource,
      ...target,
      contentHash,
      buffer,
    };

    let url;

    if (adapter === "cloudflare") {
      const result = await ensureCloudflareImage(cloudflareConfig, asset);
      url = result.url;
      uploaded += result.state === "uploaded" ? 1 : 0;
      reused += result.state === "reused" ? 1 : 0;

      log.asset(result.state, {
        imageId: asset.imageId,
        reference: asset.reference,
        sourcePath: asset.sourceRelativePath,
        url,
      });
    } else {
      const destination = path.join(LOCAL_OUTPUT_DIR, asset.localRelativePath);
      await fsPromises.mkdir(path.dirname(destination), { recursive: true });
      await fsPromises.writeFile(destination, buffer);
      url = `/${normalizePath(path.relative(path.join(ROOT_DIR, "public"), destination))}`;
      copied += 1;

      log.asset("copied", {
        imageId: asset.imageId,
        reference: asset.reference,
        sourcePath: asset.sourceRelativePath,
        url,
      });
    }

    manifest.images[asset.sourceRelativePath] = {
      contentHash: asset.contentHash,
      imageId: asset.imageId,
      sourcePath: asset.sourceRelativePath,
      url,
    };
  }

  await fsPromises.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  log.info(
    `completed prepare step | adapter=${adapter} assets=${assetSources.size} uploaded=${uploaded} reused=${reused} copied=${copied}`,
  );
  log.info(`manifest written to ${normalizePath(path.relative(ROOT_DIR, MANIFEST_PATH))}`);

  return manifest;
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  prepareBlogImages().catch((error) => {
    console.error(`[blog-images] ${error.message}`);
    process.exit(1);
  });
}