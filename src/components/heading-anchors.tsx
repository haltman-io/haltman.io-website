"use client";

import { useEffect } from "react";

const LINK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

/**
 * Automatically injects anchor-link icons into every heading with an [id]
 * inside #article-content. Clicking the icon OR the heading text copies
 * the heading's URL to clipboard, and the icon flashes to a checkmark.
 */
export function HeadingAnchors() {
  useEffect(() => {
    const article = document.getElementById("article-content");
    if (!article) return;

    const headings = article.querySelectorAll<HTMLElement>(
      "h2[id], h3[id], h4[id]"
    );

    const cleanups: (() => void)[] = [];

    headings.forEach((heading) => {
      if (heading.querySelector(".heading-anchor-link")) return;

      heading.style.position = "relative";
      heading.style.cursor = "pointer";

      // Create the anchor icon
      const anchor = document.createElement("a");
      anchor.href = `#${heading.id}`;
      anchor.className = "heading-anchor-link";
      anchor.setAttribute("aria-label", "Copy link to this section");
      anchor.title = "Copy link to section";

      Object.assign(anchor.style, {
        position: "absolute",
        left: "-1.5em",
        top: "50%",
        transform: "translateY(-50%)",
        opacity: "0",
        transition: "opacity 150ms ease, color 150ms ease",
        color: "var(--muted-foreground)",
        textDecoration: "none",
        fontSize: "0.65em",
        lineHeight: "1",
        cursor: "pointer",
      });

      anchor.innerHTML = LINK_SVG;

      // Show anchor on heading hover
      const onEnter = () => { anchor.style.opacity = "1"; };
      const onLeave = () => {
        // Only hide if not in "copied" state
        if (!anchor.dataset.copied) {
          anchor.style.opacity = "0";
        }
      };
      heading.addEventListener("mouseenter", onEnter);
      heading.addEventListener("mouseleave", onLeave);

      // Shared copy logic: copies URL, swaps icon to check, restores after delay
      const copyHeadingUrl = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;

        navigator.clipboard.writeText(url).then(() => {
          // Swap to checkmark
          anchor.innerHTML = CHECK_SVG;
          anchor.style.color = "var(--red)";
          anchor.style.opacity = "1";
          anchor.dataset.copied = "true";

          setTimeout(() => {
            anchor.innerHTML = LINK_SVG;
            anchor.style.color = "var(--muted-foreground)";
            delete anchor.dataset.copied;
            // If mouse is no longer over heading, fade out
            if (!heading.matches(":hover")) {
              anchor.style.opacity = "0";
            }
          }, 1500);
        }).catch(() => {
          window.location.hash = heading.id;
        });
      };

      // Both the icon click and heading click trigger copy
      anchor.addEventListener("click", copyHeadingUrl);
      heading.addEventListener("click", copyHeadingUrl);

      heading.insertBefore(anchor, heading.firstChild);

      cleanups.push(() => {
        heading.removeEventListener("mouseenter", onEnter);
        heading.removeEventListener("mouseleave", onLeave);
        heading.removeEventListener("click", copyHeadingUrl);
        anchor.removeEventListener("click", copyHeadingUrl);
        heading.style.cursor = "";
        anchor.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
