"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShareDialog } from "@/components/share-dialog";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ReadingProgressBanner({
  title,
  author,
  date,
  category,
  excerpt = "",
}: {
  title: string;
  author: { displayName: string; avatar: string };
  date: string;
  category: string;
  excerpt?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById("article-content");

      if (!article) {
        return;
      }

      const articleTop = window.scrollY + article.getBoundingClientRect().top;
      const articleBottom = articleTop + article.offsetHeight;
      const start = articleTop + 220;
      const end = Math.max(articleBottom - window.innerHeight + 140, start + 1);
      const nextProgress = clamp(
        ((window.scrollY - start) / (end - start)) * 100,
        0,
        100,
      );

      setProgress(nextProgress);
      setIsVisible(window.scrollY > start - 32);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full border-t border-[var(--red-border)] bg-[rgba(5,5,5,0.85)] backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-500",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div
        aria-label="Reading progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progress)}
        role="progressbar"
        className="absolute left-0 top-0 h-[1px] bg-[var(--red)] shadow-[0_0_10px_var(--red-glow)] transition-[width] duration-200"
        style={{ width: `${progress}%` }}
      />

      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        
        <div className="flex flex-col gap-0.5 overflow-hidden pr-4">
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#aaa]">
            <span className="tabular-nums text-[var(--red)]">{Math.round(progress)}%</span>
            <span className="h-3 w-px bg-[#333]" />
            <span>Reading: {category}</span>
          </span>
          <p className="truncate font-display text-[13px] font-bold uppercase tracking-wider text-white sm:text-[15px]">
            {title}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-4 md:flex border-l border-[#333] pl-4">
            <div className="flex items-center gap-2">
              <div className="size-6 overflow-hidden border border-[var(--red)] bg-black">
                <Image
                  src={author.avatar}
                  alt={author.displayName}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover transition-all hover:scale-110"
                  unoptimized
                />
              </div>
              <span className="font-bold text-white tracking-[0.08em] text-[10px]">{author.displayName}</span>
            </div>
            <span className="h-4 w-px bg-[#333]"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--red)]">{date}</span>
          </div>

          {/* Share Button */}
          <div className="border-l border-[#333] pl-4">
            <ShareDialog title={title} excerpt={excerpt} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
