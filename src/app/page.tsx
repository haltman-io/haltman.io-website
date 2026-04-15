import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Doctrine } from "@/components/doctrine";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Manifesto statement */}
      <section className="border-y border-[var(--red-border)] bg-[rgba(255,42,42,0.02)]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
          <blockquote className="max-w-3xl border-l-2 border-[var(--red)] pl-6 sm:pl-8">
            <p className="font-display text-xl leading-snug text-[var(--foreground)] sm:text-2xl lg:text-3xl">
              &ldquo;We were not assembled by hype, funding, or pitch decks.{" "}
              <span className="text-[var(--red)]">
                We were assembled by time.
              </span>
              &rdquo;
            </p>
            <footer className="mt-6 font-mono text-sm uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              &mdash; Haltman.IO Manifesto
            </footer>
          </blockquote>
        </div>
      </section>

      <Doctrine />
      <ProjectGrid />

      {/* Join CTA */}
      <section className="border-t border-[var(--red-border)] bg-[rgba(255,42,42,0.02)]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="max-w-2xl">
            <p className="label-xs">Open Collective</p>
            <h2 className="font-display mt-3 text-2xl font-bold uppercase tracking-[0.04em] text-white sm:text-3xl">
              We do not recruit.
              <br />
              <span className="text-[var(--red)]">We recognize.</span>
            </h2>
            <div className="mt-4 h-px w-16 bg-gradient-to-r from-[var(--red)] to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg sm:leading-relaxed">
              No application forms. No interviews. No HR department.
              If you share our values and your work speaks for itself,
              reach out.
            </p>
            <Link
              href="/join"
              className="mt-8 inline-flex items-center gap-2.5 rounded-sm border border-[var(--red)] bg-[rgba(255,42,42,0.12)] px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white transition-all hover:bg-[rgba(255,42,42,0.22)] hover:shadow-[0_0_30px_var(--red-glow)]"
            >
              Join the Collective <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
