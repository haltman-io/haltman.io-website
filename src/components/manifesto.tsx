"use client";

import { motion } from "motion/react";
import { HyperText } from "@/components/ui/hyper-text";

interface ManifestoSection {
  id: string;
  label: string;
  paragraphs: { emphasis: boolean; text: string }[];
}

const sections: ManifestoSection[] = [
  {
    id: "01",
    label: "ORIGIN",
    paragraphs: [
      {
        emphasis: true,
        text: "Haltman is a group of Brazilian hackers.",
      },
      {
        emphasis: false,
        text: "We were not assembled by hype, funding, or pitch decks. We were assembled by time.\n\nLong time.\n\nFriends for more than a decade. Crossing paths. Switching cities. Switching jobs. Switching aliases. Switching operating systems.\n\nStill in contact. Still building. Still learning. Still shipping.",
      },
    ],
  },
  {
    id: "02",
    label: "METHOD",
    paragraphs: [
      {
        emphasis: false,
        text: "The idea was simple. When one of us needs help, the others show up.\n\nServices. Guidance. Infrastructure. Review.\n\nNo invoices. No pitch. No growth.\n\nJust mutual aid and practical engineering.",
      },
    ],
  },
  {
    id: "03",
    label: "HISTORY",
    paragraphs: [
      {
        emphasis: false,
        text: "We have been around. We participated in several Brazilian groups over the years.\n\nSome dissolved into silence. Some went inactive. Some changed sides. Some collapsed when leadership got arrested and convicted. Some drifted until the people in charge no longer represented our interests.\n\nWe walked away when transparency, free knowledge, and free software stopped being non negotiable.",
      },
    ],
  },
  {
    id: "04",
    label: "INDEPENDENCE",
    paragraphs: [
      {
        emphasis: true,
        text: "So we did what hackers do when a system rots. We forked the social layer.\n\nWe regrouped. We built our own independent crew.",
      },
      {
        emphasis: false,
        text: "We are not affiliated with any other hacker group. We are not a franchise.\n\nWe do not inherit politics. We do not inherit baggage. We do not inherit mythology.\n\nOur independence guarantees our freedom. It sustains our creativity.\n\nThose who trade freedom for security end up with neither. We do not make this mistake.",
      },
    ],
  },
  {
    id: "05",
    label: "OUTPUT",
    paragraphs: [
      {
        emphasis: true,
        text: "Our work is public.\n\nWe publish. We document. We release.\n\nWe are not available for hire.",
      },
    ],
  },
];

export function Manifesto() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pt-32 pb-16 sm:pt-40 sm:pb-20"
      >
        {/* H watermark */}
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute right-0 top-1/2 h-48 w-48 -translate-y-1/2 text-white opacity-[0.025] sm:h-64 sm:w-64"
          aria-hidden
        >
          <path
            d="M45 40H75V85H125V40H155V160H125V105H75V160H45Z"
            fill="currentColor"
          />
        </svg>

        <p className="label-xs">Manifesto</p>

        <HyperText
          duration={600}
          className="font-display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-bold uppercase tracking-[0.03em] text-white"
        >
          ABOUT HALTMAN.IO
        </HyperText>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          Independent crew statement and operating principles.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-20 pb-24 sm:space-y-28 sm:pb-32">
        {sections.map((section, i) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="mb-8 flex items-center gap-4">
              <span className="font-display text-3xl font-bold text-[var(--red)] opacity-20 sm:text-4xl">
                {section.id}
              </span>
              <div className="h-px flex-1 bg-[var(--red-border)]" />
              <span className="label-xs">{section.label}</span>
            </div>

            <div className="max-w-3xl space-y-6">
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className={
                    p.emphasis
                      ? "whitespace-pre-line text-lg leading-relaxed text-[var(--foreground)] sm:text-xl"
                      : "whitespace-pre-line text-base leading-[1.85] text-[var(--muted-foreground)] sm:text-lg sm:leading-[1.85]"
                  }
                >
                  {p.text}
                </p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* End marker */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-3 pb-24"
      >
        <div className="h-px flex-1 bg-[var(--red-border)]" />
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-[var(--muted-foreground)] opacity-40">
          end of transmission
        </span>
        <div className="h-px flex-1 bg-[var(--red-border)]" />
      </motion.div>
    </div>
  );
}
