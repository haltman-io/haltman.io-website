"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { HyperText } from "@/components/ui/hyper-text";
import { TypingAnimation } from "@/components/ui/typing-animation";

const statusLines = [
  "$ crew: brazilian hackers",
  "$ mode: independent",
  "$ policy: no hire / public work",
  "$ signal: operational",
];

const values = ["independent", "transparent", "free software"];

export function Hero() {
  return (
    <section className="panel overflow-hidden rounded-lg mt-10">
      <div className="grid gap-0 lg:grid-cols-12 padding">
        {/* ── Left: Identity ── */}
        <div className="col-span-12 p-6 sm:p-8 lg:col-span-7 lg:p-10">
          <p className="label-xs">CYBER INDEPENDENT COLLECTIVE</p>

          <HyperText
            duration={600}
            className="font-display mt-3 text-4xl leading-[0.9] font-black uppercase tracking-[0.08em] text-white sm:text-5xl xl:text-6xl"
          >
            HALTMAN
          </HyperText>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            Haltman is a group of Brazilian hackers.{" "}<br />
<br />
            We build, break, audit, and publish.{" "}<br />
            We do not sell platforms.{" "}<br />
            We do not run franchises.{" "}<br />
            We do not ask permission.{" "}<br />
<br />
            If you are looking for marketing, certifications, or corporate theater,{" "}
            you are in the wrong place.{" "}
          </p>

          <TypingAnimation
            words={[
                "NO FRANCHISE.",
                "NO LICENSE.",
                "NO CONTROL.",

            ]}
            typeSpeed={50}
            deleteSpeed={28}
            pauseDelay={1000}
            loop
            showCursor
            className="mt-5 block text-[0.68rem] uppercase tracking-[0.18em] text-[var(--red)]"
          />

          <div className="mt-5 flex flex-wrap gap-2">
            {values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-[var(--red-border)] bg-[var(--red-subtle)] px-2.5 py-1 text-[0.56rem] uppercase tracking-[0.14em] text-[var(--foreground)]"
              >
                {v}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--red)] bg-[rgba(255,42,42,0.15)] px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-white transition-all hover:bg-[rgba(255,42,42,0.25)] hover:shadow-[0_0_20px_var(--red-glow)]"
            >
              Open Projects <ArrowRight className="size-3.5" />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--red-border)] bg-[rgba(255,255,255,0.03)] px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-all hover:border-[var(--red)] hover:text-white"
            >
              Read The Manifesto <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Right: System display ── */}
        <div className="col-span-12 flex flex-col gap-0 border-t border-[var(--red-border)] lg:col-span-5 lg:border-l lg:border-t-0">
          {/* Monogram */}
          <div className="relative flex flex-1 items-center justify-center p-8 lg:p-10">
            <motion.svg
              viewBox="0 0 200 200"
              className="h-40 w-40 sm:h-48 sm:w-48"
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF2A2A" />
                  <stop offset="100%" stopColor="#7A0000" />
                </linearGradient>
              </defs>
              <path
                d="M45 40H75V85H125V40H155V160H125V105H75V160H45Z"
                fill="url(#hg)"
                stroke="rgba(255,42,42,0.3)"
                strokeWidth="1"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255,42,42,0.15)"
                strokeWidth="1"
                strokeDasharray="4 8"
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ transformOrigin: "50% 50%" }}
              />
            </motion.svg>

            {/* Glow behind monogram */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,42,0.08),transparent_60%)]" />
          </div>

          {/* Terminal status */}
          <div className="border-t border-[var(--red-border)] p-5 sm:p-6">
            <div className="rounded-md border border-[var(--red-border)] bg-[rgba(0,0,0,0.6)] p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--red)]" />
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--red)] opacity-60" />
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--red)] opacity-30" />
              </div>
              <div className="space-y-1">
                {statusLines.map((line) => (
                  <p
                    key={line}
                    className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--foreground)] opacity-80"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
