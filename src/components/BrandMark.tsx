import React from "react";

/* ==========================================
   VFD Monogram — recreated as vector SVG from
   the brand's official mark (V flowing into
   the F/D stem). Uses currentColor so it
   adapts to light/dark themes automatically.
   ========================================== */
export function Monogram({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 130 112"
      fill="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* Left diagonal arm of the V */}
      <path
        d="M12 8 L62 100"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="square"
      />
      {/* Vertical stem — the V's right arm becomes the F/D stem */}
      <path d="M62 100 L62 8" stroke="currentColor" strokeWidth="9" />
      {/* Top arc — the D bowl */}
      <path
        d="M62 12 C 92 12 101 24 101 35 C 101 47 90 55 66 56"
        stroke="currentColor"
        strokeWidth="8"
      />
      {/* F middle bar */}
      <path d="M62 51 L94 51" stroke="currentColor" strokeWidth="8" />
      {/* Bottom hook — the J/D curve */}
      <path
        d="M62 96 C 86 96 97 87 99 72"
        stroke="currentColor"
        strokeWidth="8"
      />
    </svg>
  );
}

/* Full lockup: monogram + wordmark + optional tagline.
   Mirrors the official "VICTORY FASHION DESIGNERS /
   where smartness matters" lockup. */
export function BrandLogo({
  compact = false,
  showTagline = false,
  className = "",
}: {
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Monogram
        className={`${compact ? "h-7 w-8" : "h-9 w-10"} text-brand-plum dark:text-brand-gold shrink-0 transition-transform group-hover:scale-105`}
        title="Victory Fashion Designers monogram"
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-brand-plum dark:text-brand-gold">
          Victory Fashion
        </span>
        <span className="text-[10px] uppercase tracking-wider text-text-tertiary mt-1">
          {showTagline ? "where smartness matters" : "Designers & Academy"}
        </span>
      </span>
    </span>
  );
}

/* Subtle corner watermark for product & portfolio photos.
   Sits over the image, never blocks taps, visible but tasteful —
   so when photos get forwarded on WhatsApp the brand travels with them. */
export function MonogramWatermark({
  position = "bottom-right",
  className = "",
}: {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}) {
  const pos = {
    "bottom-right": "items-end justify-end",
    "bottom-left": "items-end justify-start",
    "top-right": "items-start justify-end",
    "top-left": "items-start justify-start",
  }[position];

  return (
    <div
      className={`absolute inset-0 flex ${pos} p-2.5 pointer-events-none z-10`}
      aria-hidden="true"
    >
      <Monogram
        className={`w-9 h-8 text-white opacity-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] ${className}`}
      />
    </div>
  );
}
