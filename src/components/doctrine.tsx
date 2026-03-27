"use client";

import { motion } from "motion/react";

const principles = [
  {
    id: "01",
    title: "Independence",
    text: "We answer to no one. No board. No investors. No sponsors. Our independence guarantees our freedom.",
  },
  {
    id: "02",
    title: "Transparency",
    text: "Every tool is open source. Every decision is visible. No back rooms. No hidden agendas.",
  },
  {
    id: "03",
    title: "Public Output",
    text: "We publish. We document. We release. Our work speaks for itself. Not our marketing.",
  },
  {
    id: "04",
    title: "No Hierarchy",
    text: "Flat structure. No leaders. No bosses. No titles. No org charts. Respect is earned by output.",
  },
  {
    id: "05",
    title: "Mutual Aid",
    text: "When one of us needs help, the others show up. No invoices. No politics. Just engineering.",
  },
  {
    id: "06",
    title: "No Compromise",
    text: "We do not water down our principles for comfort, profit, or acceptance. Those who trade freedom for security end up with neither.",
  },
];

export function Doctrine() {
  return (
    <section className="border-y border-[var(--red-border)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
        <p className="label-xs">Operating Values</p>
        <h2 className="font-display mt-3 text-2xl font-bold uppercase tracking-[0.04em] text-white sm:text-3xl">
          Doctrine
        </h2>
        <div className="mt-4 h-px w-16 bg-gradient-to-r from-[var(--red)] to-transparent" />

        <div className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16">
          {principles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <span className="font-display text-3xl font-bold text-[var(--red)] opacity-20">
                {p.id}
              </span>
              <h3 className="mt-2 text-lg font-semibold uppercase tracking-wide text-white">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
