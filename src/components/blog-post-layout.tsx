import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { TableOfContents } from "@/components/table-of-contents";
import { ReadingProgressBanner } from "@/components/reading-progress-banner";
import { HeadingAnchors } from "@/components/heading-anchors";
import { ShareDialog } from "@/components/share-dialog";
import { PostSidebarActions } from "@/components/post-sidebar-actions";
import type { BlogPostMeta } from "@/lib/blog-types";

export function BlogPostLayout({
  meta,
  sourceFilename,
  children,
}: {
  meta: BlogPostMeta;
  sourceFilename: string;
  children: React.ReactNode;
}) {
  const authorHref = meta.author.profileSlug
    ? `/members/${meta.author.profileSlug}`
    : null;

  const authorBlock = (
    <>
      <div className="size-9 overflow-hidden border border-[var(--red)] bg-black shadow-[0_0_10px_rgba(255,42,42,0.15)] transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_16px_rgba(255,42,42,0.28)] sm:size-10">
        <Image
          src={meta.author.avatar}
          alt={`Author: ${meta.author.displayName}`}
          width={40}
          height={40}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
      </div>
      <div className="min-w-0 flex flex-col">
        <span className="truncate text-[0.82rem] font-bold tracking-[0.015em] text-white sm:text-xs">
          {meta.author.displayName}
        </span>
        <span className="hidden text-[11px] tracking-[0.02em] text-[var(--red)] sm:block">
          {meta.author.role}
        </span>
      </div>
    </>
  );

  return (
    <>
      <main className="min-h-screen bg-[var(--background)] pb-12 pt-12 sm:pb-16">
        <div className="px-6 sm:px-8">
          <div className="mx-auto min-[1500px]:max-w-[86rem]">
            <div className="min-w-0 min-[1500px]:grid min-[1500px]:grid-cols-[14rem_minmax(0,54rem)_14rem] min-[1500px]:items-start min-[1500px]:gap-8">
              <aside className="hidden w-56 min-[1500px]:sticky min-[1500px]:top-28 min-[1500px]:block">
                <TableOfContents />
              </aside>

              <div className="mx-auto min-w-0 w-full max-w-[54rem] overflow-hidden border border-[var(--red-border)] bg-[rgba(10,10,10,0.4)] px-6 py-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:px-8 lg:px-12 lg:py-16">
                <article id="article-content" className="min-w-0 max-w-full overflow-hidden">
                  <HeadingAnchors />

                  {/* Article Header */}
                  <header className="mb-12 pb-0">
                    <h1 className="font-display w-full max-w-full text-[clamp(1.6rem,8vw,2.1rem)] font-bold uppercase leading-[0.94] tracking-[0.005em] text-[var(--foreground)] text-balance sm:text-[clamp(2.4rem,6vw,4.15rem)]">
                      {meta.title}
                    </h1>
                    <p className="mt-5 w-full text-[1rem] leading-8 text-[var(--muted-foreground)] sm:text-[1.1rem]">
                      {meta.subtitle}
                    </p>

                    <div className="mt-8 h-px bg-[var(--red-border)]" />

                    <div className="my-4 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 font-mono text-sm text-[var(--muted-foreground)] sm:gap-5">
                      {authorHref ? (
                        <Link
                          href={authorHref}
                          className="group flex min-w-0 items-center gap-2.5 border border-transparent bg-transparent py-1 pr-1 transition-all duration-200 hover:border-[var(--red-border)] hover:bg-[rgba(255,42,42,0.07)] hover:shadow-[0_0_16px_rgba(255,42,42,0.08)] focus-visible:border-[var(--red)] focus-visible:bg-[rgba(255,42,42,0.08)] focus-visible:outline-none sm:gap-3 sm:p-2"
                        >
                          {authorBlock}
                        </Link>
                      ) : (
                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">{authorBlock}</div>
                      )}

                      <div className="flex min-w-0 flex-col items-end text-right">
                        <span className="hidden text-[9px] uppercase tracking-[0.06em] text-[#666] sm:block">
                          Published
                        </span>
                        <time
                          dateTime={meta.date}
                          className="text-[0.9rem] font-medium tracking-normal whitespace-nowrap text-white sm:pt-1 sm:text-[0.95rem]"
                        >
                          {meta.dateFormatted}
                        </time>
                      </div>

                      <ShareDialog
                        title={meta.title}
                        excerpt={meta.subtitle}
                        triggerClassName="shrink-0 gap-1.5 px-2.5 py-2 sm:px-3 sm:py-1.5 [&_span]:hidden sm:[&_span]:inline"
                      />
                    </div>

                    <div className="h-px bg-[var(--red-border)]" />
                  </header>

                  {/* Article Body — unique content per post */}
                  <div className="min-w-0 w-full max-w-full [overflow-wrap:anywhere] [&_a]:[overflow-wrap:anywhere] [&_a]:[word-break:break-word] [&_li]:min-w-0 [&_li]:max-w-full [&_li]:[overflow-wrap:anywhere] [&_p]:max-w-full [&_p]:[overflow-wrap:anywhere]">
                    {children}
                  </div>
                </article>
              </div>

              <aside className="hidden w-56 min-[1500px]:sticky min-[1500px]:top-28 min-[1500px]:block">
                <PostSidebarActions
                  category={meta.category}
                  categorySlug={meta.categorySlug}
                  tags={meta.tags}
                  sourceFilename={sourceFilename}
                />
              </aside>
            </div>
          </div>
        </div>
      </main>

      <ReadingProgressBanner
        title={meta.title}
        category={meta.category}
        author={{ displayName: meta.author.displayName, avatar: meta.author.avatar }}
        date={meta.dateFormatted}
        excerpt={meta.subtitle}
      />

      <Footer />
    </>
  );
}
