import Image from "next/image";
import { Footer } from "@/components/footer";
import { HeadingAnchors } from "@/components/heading-anchors";
import type { MemberProfileMeta } from "@/lib/member-types";

export function MemberProfileLayout({
  meta,
  children,
}: {
  meta: MemberProfileMeta;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-[var(--background)] pb-12 pt-12 sm:pb-16">
        <div className="px-6 sm:px-8">
          <div className="mx-auto max-w-[72rem]">
            <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
              <aside className="relative overflow-hidden border border-[var(--red-border)] bg-[rgba(10,10,10,0.72)] p-5 shadow-[0_0_30px_rgba(0,0,0,0.42)] backdrop-blur-md sm:p-6 xl:sticky xl:top-28 xl:self-start">
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,42,42,0.8),transparent)]" />
                <div className="absolute right-4 bottom-4 h-14 w-14 border-r border-b border-[var(--red-border)] opacity-35" />

                <div className="mt-1 border border-[var(--red-border)] bg-black p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="relative aspect-square overflow-hidden border border-[rgba(255,42,42,0.18)] bg-[#080808]">
                    <Image
                      src={meta.avatar}
                      alt={meta.displayName}
                      fill
                      sizes="(min-width: 1280px) 18rem, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="font-display text-[clamp(1.8rem,7vw,2.55rem)] font-bold leading-[0.92] tracking-[0.01em] text-white">
                      {meta.displayName}
                    </p>
                    <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-[#9c9c9c]">
                      @{meta.name}
                    </p>
                  </div>

                  <div className="h-px bg-[var(--red-border)]" />

                  <dl className="space-y-4">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                        Role
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                        {meta.role}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-[var(--foreground)]">
                        <a
                          href={`mailto:${meta.email}`}
                          className="accent-link break-all"
                        >
                          {meta.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>

              <section className="relative overflow-hidden border border-[var(--red-border)] bg-[rgba(10,10,10,0.44)] px-6 py-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:px-8 lg:px-12 lg:py-16">
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,42,42,0.7),transparent)]" />

                <article id="article-content">
                  <HeadingAnchors />
                  <div className="w-full">{children}</div>
                </article>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
