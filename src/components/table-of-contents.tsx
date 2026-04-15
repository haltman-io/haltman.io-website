"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);
  const isClickScrolling = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    let elements: Element[] = [];
    const topOffset = 112;
    const bottomGap = 32;

    const collectHeadings = () => {
      elements = Array.from(
        document.querySelectorAll("#article-content h2[id], #article-content h3[id], #article-content h4[id]"),
      );

      setHeadings(
        elements.map((el) => ({
          id: el.id,
          text: el.textContent || "",
          level: Number(el.tagName.charAt(1)),
        })),
      );
    };

    const updateBounds = () => {
      if (!navRef.current) return;
      const footer = document.getElementById("site-footer");
      const viewportLimit = window.innerHeight - topOffset - bottomGap;

      if (!footer) {
        navRef.current.style.maxHeight = `${Math.max(viewportLimit, 180)}px`;
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const footerLimit = footerTop - topOffset - bottomGap;
      const nextMaxHeight = Math.max(Math.min(viewportLimit, footerLimit), 180);

      navRef.current.style.maxHeight = `${nextMaxHeight}px`;
    };

    const handleScroll = () => {
      if (scrollRaf.current) return;

      scrollRaf.current = requestAnimationFrame(() => {
        updateBounds();

        if (isClickScrolling.current) {
          scrollRaf.current = null;
          return;
        }

        let currentActiveId = "";
        const offset = Math.max(150, window.innerHeight * 0.3);

        for (const el of elements) {
          const { top } = el.getBoundingClientRect();
          if (top < offset) {
            currentActiveId = el.id;
          } else {
            break;
          }
        }

        if (!currentActiveId && elements.length > 0) {
          currentActiveId = elements[0].id;
        }

        setActiveId((prev) => (prev !== currentActiveId ? currentActiveId : prev));
        scrollRaf.current = null;
      });
    };

    const initTimer = setTimeout(() => {
      collectHeadings();
      updateBounds();
      handleScroll();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    const article = document.getElementById("article-content");
    const observer = article
      ? new MutationObserver(() => {
          collectHeadings();
          handleScroll();
        })
      : null;

    if (article && observer) {
      observer.observe(article, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(initTimer);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      observer?.disconnect();
    };
  }, [pathname]);

  // Auto-scroll the active item into view within the TOC
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-toc-id="${activeId}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  if (headings.length === 0) {
    return null;
  }

  const activeIndex = headings.findIndex((h) => h.id === activeId);

  return (
    <nav
      ref={navRef}
      className="flex flex-col overflow-hidden border border-[var(--red-border)] bg-[rgba(10,10,10,0.7)] shadow-[0_0_28px_rgba(0,0,0,0.4)] backdrop-blur-md transition-[max-height] duration-300"
      aria-label="Table of contents"
    >
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4">
        <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
          <span className="h-1.5 w-1.5 bg-[var(--red)] shadow-[0_0_8px_var(--red)]" />
          On this page
        </p>
      </div>

      {/* Scrollable list */}
      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto px-5 pb-5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--red-border) transparent" }}
      >
        <ul className="relative">
          {/* Vertical track line */}
          <div className="pointer-events-none absolute bottom-0 left-[3px] top-0 w-px bg-[var(--red-border)] opacity-20" />

          {/* Active segment glow on track */}
          {activeIndex >= 0 && (
            <div
              className="pointer-events-none absolute left-[2.5px] w-[2px] rounded-full bg-[var(--red)] shadow-[0_0_6px_var(--red)] transition-all duration-300"
              style={{
                top: `${activeIndex * 32 + 8}px`,
                height: "16px",
              }}
            />
          )}

          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id} className="relative" data-toc-id={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "group relative flex items-center py-[7px] text-[12.5px] leading-snug transition-all duration-200",
                    heading.level === 3 ? "pl-6" : heading.level === 4 ? "pl-10" : "pl-4",
                    isActive
                      ? "font-medium text-[var(--red)]"
                      : "text-[var(--muted-foreground)] hover:text-white",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.id);
                    if (!target) return;

                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = target.getBoundingClientRect().top;
                    const offsetPosition = elementRect - bodyRect - 100;

                    isClickScrolling.current = true;
                    setActiveId(heading.id);
                    window.history.pushState(null, "", `#${heading.id}`);
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                    setTimeout(() => {
                      isClickScrolling.current = false;
                    }, 800);
                  }}
                >
                  {/* Active dot */}
                  <span
                    className={cn(
                      "absolute left-[0.5px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full transition-all duration-200",
                      isActive
                        ? "scale-100 bg-[var(--red)] shadow-[0_0_8px_var(--red)]"
                        : "scale-0 bg-transparent group-hover:scale-75 group-hover:bg-[var(--red-border)]",
                    )}
                  />
                  <span className="line-clamp-2">{heading.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
