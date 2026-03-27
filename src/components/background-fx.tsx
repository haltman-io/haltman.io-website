"use client";

export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base gradient with subtle red accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,42,42,0.07),transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(255,42,42,0.04),transparent_45%),#050505]" />

      {/* Noise grain */}
      <div className="fixed -inset-[200%] opacity-[0.018] pointer-events-none z-0">
        <div
          className="absolute inset-0 animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

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
