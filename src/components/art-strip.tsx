"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pause,
  Play,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
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

function sanitizeArtifactParam(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 120) return null;
  if (trimmed.includes("..")) return null;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(trimmed)) return null;
  return trimmed;
}

function isVideo(src: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(src);
}

const IMAGE_PREVIEW_DELAY_MS = 3000;

type ArtStripProps = {
  showTopNav?: boolean;
  layout?: "strip" | "grid";
};

export function ArtStrip({ showTopNav = true, layout = "strip" }: ArtStripProps) {
  const isGridLayout = layout === "grid";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const dialogOpenScrollYRef = useRef(0);
  const handledArtifactParamRef = useRef<string | null>(null);
  const stripDragStartXRef = useRef(0);
  const stripStartScrollLeftRef = useRef(0);
  const stripMovedRef = useRef(false);
  const suppressCardClickRef = useRef(false);
  const autoAdvanceStepsRef = useRef(0);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isStripDragging, setIsStripDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAutoAdvanceOn, setIsAutoAdvanceOn] = useState(false);
  const [autoProgress, setAutoProgress] = useState(100);
  const [videoDurationMs, setVideoDurationMs] = useState<number | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const visibleAssets = useMemo(
    () => brandAssets.filter((asset) => !failed[asset.src]),
    [failed]
  );

  const selectedAsset = visibleAssets[selected];
  const selectedIsVideo = useMemo(
    () => (selectedAsset ? isVideo(selectedAsset.src) : false),
    [selectedAsset]
  );

  const scroll = (dir: "left" | "right") => {
    scrollerRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const onStripPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !scrollerRef.current) return;
    setIsStripDragging(true);
    stripMovedRef.current = false;
    suppressCardClickRef.current = false;
    stripDragStartXRef.current = event.clientX;
    stripStartScrollLeftRef.current = scrollerRef.current.scrollLeft;
  };

  const onStripPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isStripDragging || !scrollerRef.current) return;
    const delta = event.clientX - stripDragStartXRef.current;
    if (Math.abs(delta) > 8) {
      stripMovedRef.current = true;
      suppressCardClickRef.current = true;
    }
    scrollerRef.current.scrollLeft = stripStartScrollLeftRef.current - delta;
  };

  const onStripPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isStripDragging) return;
    setIsStripDragging(false);
  };

  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [selected]);

  useEffect(() => {
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  useEffect(() => {
    if (visibleAssets.length === 0) {
      setSelected(0);
      setIsAutoAdvanceOn(false);
      return;
    }

    if (selected >= visibleAssets.length) {
      setSelected(visibleAssets.length - 1);
    }
  }, [selected, visibleAssets.length]);

  useEffect(() => {
    if (!selectedAsset || !selectedIsVideo) {
      setVideoDurationMs(null);
      return;
    }

    const video = previewVideoRef.current;
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      setVideoDurationMs(video.duration * 1000);
      return;
    }

    setVideoDurationMs(null);
  }, [selectedAsset, selectedIsVideo]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/arts") return;

    const params = new URLSearchParams(window.location.search);
    const artifactParam = sanitizeArtifactParam(params.get("artifact"));
    if (!artifactParam) return;
    if (handledArtifactParamRef.current === artifactParam) return;

    const index = visibleAssets.findIndex(
      (asset) => fileName(asset.src) === artifactParam
    );
    if (index === -1) {
      handledArtifactParamRef.current = artifactParam;
      return;
    }

    handledArtifactParamRef.current = artifactParam;
    setSelected(index);
    setDialogOpen(true);

    const url = new URL(window.location.href);
    url.searchParams.delete("artifact");
    const nextUrl = `${url.pathname}${url.search ? `?${url.searchParams.toString()}` : ""}${url.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [visibleAssets]);

  useEffect(() => {
    if (!isAutoAdvanceOn) {
      setAutoProgress(100);
      return;
    }

    const currentDelayMs = selectedIsVideo
      ? (videoDurationMs ?? IMAGE_PREVIEW_DELAY_MS)
      : IMAGE_PREVIEW_DELAY_MS;

    const tickMs = 100;
    const step = (tickMs / currentDelayMs) * 100;

    setAutoProgress(100);

    const timer = window.setInterval(() => {
      setAutoProgress((currentProgress) => {
        const nextProgress = currentProgress - step;
        if (nextProgress > 0) {
          return nextProgress;
        }

        setSelected((current) => {
          if (autoAdvanceStepsRef.current >= visibleAssets.length - 1) {
            setIsAutoAdvanceOn(false);
            return current;
          }

          autoAdvanceStepsRef.current += 1;
          return (current + 1) % visibleAssets.length;
        });

        return 100;
      });
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [isAutoAdvanceOn, selected, selectedIsVideo, videoDurationMs, visibleAssets.length]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setDragStart({
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  const onWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((current) => {
      const next = event.deltaY < 0 ? current + 0.2 : current - 0.2;
      return Math.max(1, Math.min(3, Number(next.toFixed(2))));
    });
  };

  const zoomIn = () => setZoom((current) => Math.min(3, current + 0.25));
  const zoomOut = () => setZoom((current) => Math.max(1, current - 0.25));

  const prevAsset = () => {
    if (visibleAssets.length === 0) return;
    setSelected((current) =>
      current === 0 ? visibleAssets.length - 1 : current - 1
    );
    setZoom(1);
    setAutoProgress(100);
    setIsPlaying(true);
    setShareMessage("");
  };

  const nextAsset = () => {
    if (visibleAssets.length === 0) return;
    setSelected((current) =>
      current === visibleAssets.length - 1 ? 0 : current + 1
    );
    setZoom(1);
    setAutoProgress(100);
    setIsPlaying(true);
    setShareMessage("");
  };

  const toggleAutoAdvance = () => {
    if (visibleAssets.length === 0) return;

    if (isAutoAdvanceOn) {
      setIsAutoAdvanceOn(false);
      setAutoProgress(100);
      return;
    }

    autoAdvanceStepsRef.current = 0;
    setAutoProgress(100);
    setIsAutoAdvanceOn(true);
  };

  const togglePlayback = async () => {
    const video = previewVideoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const downloadSelected = () => {
    if (!selectedAsset) return;
    const anchor = document.createElement("a");
    anchor.href = selectedAsset.src;
    anchor.download = fileName(selectedAsset.src);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const shareSelected = async () => {
    if (!selectedAsset) return;

    const shareText = "Look at this art in haltman.io's website!";
    const safeArtifactName = sanitizeArtifactParam(fileName(selectedAsset.src));
    if (!safeArtifactName) return;
    const shareUrl = `${window.location.origin}/arts?artifact=${encodeURIComponent(safeArtifactName)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Haltman Art",
          text: shareText,
          url: shareUrl,
        });
        setShareMessage("Shared");
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShareMessage("Link copied");
      }
    } catch {
      setShareMessage("Share canceled");
    }

    setTimeout(() => setShareMessage(""), 1800);
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
      {showTopNav && (
        <div className="flex items-end justify-between">
          <div>
            <p className="label-xs">Visual Archive</p>
            <h2 className="font-display mt-2 text-xl font-bold uppercase tracking-[0.04em] text-white sm:text-2xl">
              Crew Artifacts
            </h2>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              disabled={isGridLayout}
              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--red-border)] bg-[var(--card)] text-[var(--foreground)] transition hover:border-[var(--red)]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={isGridLayout}
              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--red-border)] bg-[var(--card)] text-[var(--foreground)] transition hover:border-[var(--red)]"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (open) {
            dialogOpenScrollYRef.current = window.scrollY;
            setZoom(1);
            setIsPlaying(true);
            setAutoProgress(100);
            setShareMessage("");
            setIsAutoAdvanceOn(false);
            autoAdvanceStepsRef.current = 0;
          } else {
            setAutoProgress(100);
            setIsAutoAdvanceOn(false);
            autoAdvanceStepsRef.current = 0;
            requestAnimationFrame(() => {
              window.scrollTo({
                top: dialogOpenScrollYRef.current,
                behavior: "auto",
              });
            });
          }
        }}
      >
        <div
          ref={scrollerRef}
          onPointerDown={isGridLayout ? undefined : onStripPointerDown}
          onPointerMove={isGridLayout ? undefined : onStripPointerMove}
          onPointerUp={isGridLayout ? undefined : onStripPointerUp}
          onPointerCancel={isGridLayout ? undefined : onStripPointerUp}
          className={
            isGridLayout
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : `no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto select-none ${isStripDragging ? "cursor-grabbing" : "cursor-grab"}`
          }
        >
          {visibleAssets.map((asset, index) => {
            const isVideoAsset = isVideo(asset.src);
            return (
              <DialogTrigger asChild key={asset.src}>
                <button
                  type="button"
                  onClick={(event) => {
                    if (suppressCardClickRef.current) {
                      event.preventDefault();
                      suppressCardClickRef.current = false;
                      return;
                    }
                    setSelected(index);
                  }}
                  className={
                    isGridLayout
                      ? "group panel relative aspect-[4/3] w-full overflow-hidden rounded-lg text-left transition-transform active:scale-[0.98]"
                      : "group panel relative h-60 min-w-[18rem] flex-shrink-0 snap-start overflow-hidden rounded-lg text-left transition-transform active:scale-[0.98] sm:h-72 sm:min-w-[22rem]"
                  }
                >
                  {!isVideoAsset && (
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
                  {isVideoAsset && (
                    <video
                      src={asset.src}
                      muted
                      playsInline
                      preload="metadata"
                      onError={() =>
                        setFailed((s) => ({ ...s, [asset.src]: true }))
                      }
                      className="h-full w-full object-cover opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--red)]">
                      {asset.kind}
                    </p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">
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
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="h-[75vh] w-[92vw] max-w-[92vw] border-[var(--red-border)] bg-[rgba(5,5,5,0.96)] p-4 backdrop-blur-xl sm:h-[80vh] sm:w-[75vw] sm:max-w-[75vw]"
        >
          <DialogTitle className="sr-only">
            {selectedAsset?.alt}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Artifact preview
          </DialogDescription>
          <div className="grid h-full grid-rows-[1fr_auto] gap-3">
            <div
              ref={previewViewportRef}
              onWheel={onWheelZoom}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative overflow-hidden rounded-md border border-[var(--red-border)] bg-black"
            >
              {selectedAsset && !selectedIsVideo ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={selectedAsset.src}
                    alt={selectedAsset.alt}
                    onError={() =>
                      setFailed((s) => ({
                        ...s,
                        [selectedAsset.src]: true,
                      }))
                    }
                    draggable={false}
                    className="max-h-full max-w-full select-none object-contain"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      cursor:
                        zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                    }}
                  />
                </div>
              ) : selectedAsset && selectedIsVideo ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <video
                    ref={previewVideoRef}
                    muted
                    autoPlay
                    loop
                    playsInline
                    onLoadedMetadata={(event) => {
                      const duration = event.currentTarget.duration;
                      if (Number.isFinite(duration) && duration > 0) {
                        setVideoDurationMs(duration * 1000);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() =>
                      setFailed((s) => ({
                        ...s,
                        [selectedAsset.src]: true,
                      }))
                    }
                    className="max-h-full max-w-full object-contain"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      cursor:
                        zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                    }}
                  >
                    <source
                      src={selectedAsset.src}
                      type={selectedAsset.src.endsWith(".webm") ? "video/webm" : "video/mp4"}
                    />
                  </video>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    No media available
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--red-border)] pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevAsset}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)]"
                >
                  <ChevronLeft className="size-3.5" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={nextAsset}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)]"
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleAutoAdvance}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)]"
                  aria-pressed={isAutoAdvanceOn}
                >
                  Auto: {isAutoAdvanceOn ? "On" : "Off"}
                </button>
                {selectedIsVideo && (
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)]"
                  >
                    {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)] disabled:opacity-40"
                >
                  <ZoomOut className="size-3.5" />
                  Zoom out
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)] disabled:opacity-40"
                >
                  <ZoomIn className="size-3.5" />
                  Zoom in
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadSelected}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)]"
                >
                  <Download className="size-3.5" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={shareSelected}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--red-border)] bg-[var(--card)] px-2 text-xs text-[var(--foreground)] transition hover:border-[var(--red)]"
                >
                  <Share2 className="size-3.5" />
                  Share
                </button>
              </div>
            </div>

            {isAutoAdvanceOn && (
              <div className="h-1 w-full overflow-hidden rounded-sm bg-[var(--red-border)]">
                <div
                  className="h-full bg-[var(--red)]"
                  style={{
                    width: `${Math.max(0, Math.min(100, autoProgress))}%`,
                    transition: "width 100ms linear",
                  }}
                />
              </div>
            )}

            <div className="min-h-4 text-right font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {shareMessage || `${Math.round(zoom * 100)}% · ${visibleAssets.length > 0 ? selected + 1 : 0}/${visibleAssets.length}${isAutoAdvanceOn ? " · auto" : ""}`}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
