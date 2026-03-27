"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { HyperText } from "@/components/ui/hyper-text";
import { TypingAnimation } from "@/components/ui/typing-animation";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* H monogram watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:flex items-center justify-end opacity-[0.07] overflow-hidden"
      >
        <div className="mx-auto flex w-full max-w-7xl justify-end px-6 sm:px-8 lg:px-12">
          <motion.img 
            src="/haltman-logo.png" 
            alt=""
            className="h-[45vh] w-auto antialiased object-contain mr-8 lg:mr-16"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Red glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,42,42,0.06),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="label-xs">Independent Collective</p>

          <HyperText
            duration={800}
            className="font-display mt-5 text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-bold uppercase tracking-[0.03em] text-white glitch-hover"
          >
            HALTMAN.IO
          </HyperText>

          <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />

          <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg sm:leading-relaxed">
            <p>
              Haltman is a group of Brazilian hackers. Friends for over a decade,
              building public, privacy-first infrastructure and free software.
            </p>
            <p>
              We build, break, audit, and publish.
              <br />
              We do not sell platforms. We do not run franchises.
              <br />
              We do not ask permission.
            </p>
          </div>

          <TypingAnimation
            words={["NO FRANCHISE.", "NO LICENSE.", "NO CONTROL."]}
            typeSpeed={50}
            deleteSpeed={28}
            pauseDelay={1200}
            loop
            showCursor
            className="mt-8 block font-mono text-sm uppercase tracking-[0.14em] text-[var(--red)]"
          />

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2.5 rounded-sm border border-[var(--red)] bg-[rgba(255,42,42,0.12)] px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white transition-all hover:bg-[rgba(255,42,42,0.22)] hover:shadow-[0_0_30px_var(--red-glow)] active:scale-95"
            >
              Open Projects <ArrowRight className="size-4" />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 rounded-sm border border-[var(--red-border)] bg-[rgba(255,255,255,0.03)] px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-[var(--muted-foreground)] transition-all hover:border-[var(--red)] hover:text-white active:scale-95"
            >
              Read The Manifesto <ChevronRight className="size-4" />
            </Link>
          </div>
        </motion.div>

        {/* Operational status strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--red-border)] pt-6"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--red)] opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--red)]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Operational
            </span>
          </div>
          <span className="font-mono text-xs text-[var(--muted-foreground)] opacity-60">
            6 public projects
          </span>
          <span className="font-mono text-xs text-[var(--muted-foreground)] opacity-60">
            10+ years active
          </span>
          <span className="font-mono text-xs text-[var(--muted-foreground)] opacity-60">
            BR
          </span>
          <span className="font-mono text-xs text-[var(--muted-foreground)] opacity-60">
            Independent
          </span>
        </motion.div>
      </div>
    </section>
  );
}
