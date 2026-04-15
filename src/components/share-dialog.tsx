"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareDialog({
  title,
  excerpt,
  triggerClassName,
}: {
  title: string;
  excerpt: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const copyResetRef = useRef<number | null>(null);

  const getCleanUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "fbclid", "gclid", "gad_source", "dclid",
      "ref", "ref_src", "ref_url",
      "mc_cid", "mc_eid",
      "s", "si", "t",
    ];
    trackingParams.forEach((p) => url.searchParams.delete(p));
    return url.toString();
  }, []);

  const cleanUrl = typeof window !== "undefined" ? getCleanUrl() : "";
  const shareExcerpt = excerpt.trim() || "Public notes from Haltman.IO.";
  const shareMessage = `Haltman.IO // ${title}\n${shareExcerpt}\n${cleanUrl}`;
  const shareMessageEncoded = encodeURIComponent(shareMessage);
  const urlEncoded = encodeURIComponent(cleanUrl);
  const titleEncoded = encodeURIComponent(title);

  const platforms = [
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Haltman.IO // ${title}\n${shareExcerpt}`)}&url=${urlEncoded}`,
      icon: (
        <svg viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`,
      icon: (
        <svg viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${urlEncoded}&title=${titleEncoded}`,
      icon: (
        <svg viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.995 13.085c.053.3.08.608.08.92 0 3.229-3.705 5.848-8.275 5.848S1.525 17.234 1.525 14.005c0-.312.026-.62.08-.92a1.755 1.755 0 0 1-.68-1.385c0-.97.79-1.76 1.76-1.76.473 0 .9.188 1.215.493C5.39 9.457 7.45 8.85 9.71 8.75l1.62-5.39a.42.42 0 0 1 .5-.29l3.81.8c.27-.53.81-.89 1.43-.89a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1-1.56-1.28l-3.39-.71-1.44 4.79c2.22.12 4.24.73 5.72 1.72.315-.305.742-.493 1.215-.493.97 0 1.76.79 1.76 1.76 0 .557-.26 1.052-.68 1.385zM8.4 13.6a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm7.2 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm-6.52 2.63c-.14-.14-.14-.37 0-.51.14-.14.37-.14.51 0 .9.9 2.52.97 3.41.01.14-.14.37-.14.51 0 .14.14.14.37 0 .51-.56.55-1.3.83-2.07.83-.76 0-1.51-.28-2.07-.83l.21-.01z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${urlEncoded}&text=${shareMessageEncoded}`,
      icon: (
        <svg viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: "Email",
      href: `mailto:?subject=${titleEncoded}&body=${shareMessageEncoded}`,
      icon: (
        <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
  ];

  const pulseCopiedState = useCallback(() => {
    if (copyResetRef.current) {
      window.clearTimeout(copyResetRef.current);
    }

    setCopied(true);
    copyResetRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }, []);

  const copyCleanUrl = useCallback(async () => {
    const url = getCleanUrl();
    try {
      await navigator.clipboard.writeText(url);
      pulseCopiedState();
    } catch {
      setCopied(false);
    }

    return url;
  }, [getCleanUrl, pulseCopiedState]);

  const handleOpen = useCallback(() => {
    setCopied(false);
    setOpen(true);
  }, []);

  const handleCopy = useCallback(() => {
    void copyCleanUrl();
  }, [copyCleanUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Slightly defer so the opening click doesn't immediately close it
    const timer = setTimeout(() => {
      window.addEventListener("click", onClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) {
        window.clearTimeout(copyResetRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "inline-flex items-center justify-center gap-2 border border-[var(--red-border)] bg-[rgba(255,42,42,0.05)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-colors hover:border-[var(--red)] hover:bg-[rgba(255,42,42,0.12)] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--red)]",
          triggerClassName,
        )}
        title="Share this article"
      >
        <Share2 className="size-3" />
        <span>Share</span>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.82)] backdrop-blur-sm" />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="relative z-10 w-full max-w-xl border border-[var(--red-border)] bg-[#080808] shadow-[0_0_60px_rgba(255,42,42,0.12)]"
          >
            <div className="absolute left-0 top-0 h-px w-full bg-[var(--red)] shadow-[0_0_12px_var(--red-glow)]" />

            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 border border-transparent p-1 text-[#666] transition-colors hover:border-[var(--red-border)] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--red)]"
              aria-label="Close share dialog"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 pt-8 sm:p-8">
              <div className="mb-8 border-b border-[var(--red-border)] pb-6 pr-10 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--red)]">
                  Share relay
                </p>
                <h3
                  id="share-dialog-title"
                  className="font-display mt-3 text-2xl font-bold uppercase tracking-[0.08em] text-white sm:text-3xl"
                >
                  Transmit article
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
                  Copy a clean Haltman.IO URL or push it straight to one of the quick-share routes below.
                </p>
              </div>

              <div className="mb-8 text-center">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "inline-flex min-w-[220px] items-center justify-center gap-2 border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--red)]",
                    copied
                      ? "border-[var(--red)] bg-[rgba(255,42,42,0.14)] text-[var(--red)]"
                      : "border-[var(--red-border)] bg-[rgba(255,42,42,0.05)] text-white hover:border-[var(--red)] hover:bg-[rgba(255,42,42,0.1)]",
                  )}
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  <span>{copied ? "Copied" : "Copy URL"}</span>
                </button>
                <p
                  role="status"
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#777]"
                >
                  {copied
                    ? "Clean link copied to clipboard"
                    : "Tracking parameters are removed before copy"}
                </p>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--red-border)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#777]">
                  Quick links
                </span>
                <div className="h-px flex-1 bg-[var(--red-border)]" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.name}
                    className="group flex min-h-[84px] flex-col items-center justify-center gap-2 border border-[#242424] bg-[#0c0c0c] px-3 py-4 text-center text-[var(--muted-foreground)] transition-colors hover:border-[var(--red)] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--red)]"
                  >
                    <span className="text-[var(--red)] transition-transform group-hover:scale-110">
                      {p.icon}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                      {p.name}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-w-[160px] items-center justify-center border border-[#242424] bg-[#0c0c0c] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] transition-colors hover:border-[var(--red)] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--red)]"
                >
                  Done
                </button>
              </div>
            </div>

            <div className="border-t border-[var(--red-border)] bg-[rgba(255,42,42,0.03)] px-6 py-3 sm:px-8">
              <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-[#666]">
                Clean dispatch only // parameters stripped automatically
              </p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
