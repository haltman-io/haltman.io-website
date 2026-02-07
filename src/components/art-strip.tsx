"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { brandAssets } from "@/config/brand-assets";

function fileName(src: string) {
  return src.split("/").pop() || src;
}

export function ArtStrip() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const scroll = (dir: "left" | "right") => {
    scrollerRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="label-xs">Visual Archive</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            Crew artifacts
          </h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--red-border)] bg-[var(--card)] text-[var(--foreground)] transition hover:border-[var(--red)]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--red-border)] bg-[var(--card)] text-[var(--foreground)] transition hover:border-[var(--red)]"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <Dialog>
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
        >
          {brandAssets.map((asset, index) => {
            const isFailed = failed[asset.src];
            return (
              <DialogTrigger asChild key={asset.src}>
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  className="group panel relative h-52 min-w-[16rem] flex-shrink-0 snap-start overflow-hidden rounded-lg text-left sm:h-56 sm:min-w-[20rem]"
                >
                  {!isFailed && (
                    <Image
                      src={asset.src}
                      alt={asset.alt}
                      fill
                      unoptimized
                      sizes="320px"
                      onError={() =>
                        setFailed((s) => ({ ...s, [asset.src]: true }))
                      }
                      className="object-cover opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}
                  {isFailed && (
                    <div className="flex h-full items-center justify-center bg-[rgba(255,42,42,0.03)]">
                      <div className="text-center">
                        <ImageOff className="mx-auto size-5 text-[var(--muted-foreground)]" />
                        <p className="mt-2 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                          {fileName(asset.src)}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-[0.55rem] uppercase tracking-[0.18em] text-[var(--red)]">
                      {asset.kind}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--foreground)]">
                      {fileName(asset.src)}
                    </p>
                  </div>
                </button>
              </DialogTrigger>
            );
          })}
        </div>

        <DialogContent
          showCloseButton
          className="max-w-4xl border-[var(--red-border)] bg-[rgba(5,5,5,0.96)] p-3 backdrop-blur-xl"
        >
          <DialogTitle className="sr-only">
            {brandAssets[selected]?.alt}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Artifact preview
          </DialogDescription>
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-[var(--red-border)] bg-black">
            {brandAssets[selected] && !failed[brandAssets[selected].src] ? (
              <Image
                src={brandAssets[selected].src}
                alt={brandAssets[selected].alt}
                fill
                unoptimized
                sizes="85vw"
                onError={() =>
                  setFailed((s) => ({
                    ...s,
                    [brandAssets[selected].src]: true,
                  }))
                }
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  {brandAssets[selected]
                    ? fileName(brandAssets[selected].src)
                    : ""}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
