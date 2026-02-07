"use client";

export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base gradient with subtle red accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,42,42,0.07),transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(255,42,42,0.04),transparent_45%),#050505]" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,42,42,0.08) 0px, rgba(255,42,42,0.08) 1px, transparent 1px, transparent 3px)",
          animation: "scan 8s linear infinite",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}
