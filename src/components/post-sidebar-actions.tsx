import Link from "next/link";

export function PostSidebarActions({
  category,
  categorySlug,
  tags,
  sourceFilename,
}: {
  category: string;
  categorySlug: string;
  tags: { label: string; slug: string }[];
  sourceFilename: string;
}) {
  return (
    <nav
      className="flex flex-col overflow-hidden border border-[var(--red-border)] bg-[rgba(10,10,10,0.7)] shadow-[0_0_28px_rgba(0,0,0,0.4)] backdrop-blur-md"
      aria-label="Post actions"
    >
      {/* Category */}
      <div className="shrink-0 px-5 pt-5 pb-4">
        <p className="mb-3 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
          <span className="h-1.5 w-1.5 bg-[var(--red)] shadow-[0_0_8px_var(--red)]" />
          Category
        </p>
        <Link
          href={`/blog/category/${categorySlug}`}
          className="inline-block border border-[var(--red-border)] bg-[rgba(255,42,42,0.08)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--red)] transition-all hover:bg-[var(--red)] hover:text-white hover:shadow-[0_0_15px_var(--red-glow)]"
        >
          {category}
        </Link>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <>
          <div className="mx-5 h-px bg-[var(--red-border)] opacity-40" />

          <div className="px-5 pt-4 pb-5">
            <p className="mb-3 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
              <span className="h-1.5 w-1.5 bg-[var(--red)] shadow-[0_0_8px_var(--red)]" />
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="rounded-full border border-[#444] bg-[#111] px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--muted-foreground)] transition-colors hover:border-[var(--red)] hover:bg-[rgba(255,42,42,0.1)] hover:text-white"
                >
                  #{tag.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
      {/* Edit on GitHub */}
      <div className="mx-5 h-px bg-[var(--red-border)] opacity-40" />

      <div className="px-5 py-4">
        <a
          href={`https://github.com/haltman-io/haltman.io-website/edit/main/src/content/blog/${sourceFilename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 border border-[var(--red-border)] bg-[rgba(255,42,42,0.05)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-colors hover:border-[var(--red)] hover:bg-[rgba(255,42,42,0.12)] hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Edit on GitHub
        </a>
      </div>
    </nav>
  );
}
