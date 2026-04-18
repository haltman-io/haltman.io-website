import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/components/blog-post-card";
import type { BlogPostEntry } from "@/lib/blog-types";

export function RecentBlogPosts({ posts }: { posts: BlogPostEntry[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-[var(--red-border)] bg-[linear-gradient(180deg,rgba(255,42,42,0.03),rgba(255,42,42,0.015)_32%,transparent)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-xs">Quick Read</p>
            <h2 className="font-display mt-3 text-2xl font-bold uppercase tracking-[0.04em] text-white sm:text-3xl">
              Latest posts
            </h2>
            <div className="mt-4 h-px w-16 bg-linear-to-r from-(--red) to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
              Fresh notes from the collective, pulled from the same archive as
              the full blog. Start with the newest entries and jump into the
              full index when you need more.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">
              {posts.length} {posts.length === 1 ? "post" : "posts"} ready
            </p>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-(--red)"
            >
              Open full blog
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <BlogPostCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}