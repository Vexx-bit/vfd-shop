"use client";

import React, { useEffect, useState } from "react";

/**
 * Builds a URL that serves the image with the VFD monogram baked into the
 * pixels by /api/img. Data and blob URLs are passed through untouched.
 */
export function brandedSrc(src: string, w = 1200): string {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;
  return `/api/img?src=${encodeURIComponent(src)}&w=${w}`;
}

type BrandedImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src?: string | null;
  /** Width hint handed to the watermark route so we don't ship 4000px files. */
  w?: number;
  /** Set false for decorative imagery that shouldn't carry the mark. */
  brand?: boolean;
};

/**
 * A drop-in <img> whose source is routed through the watermarking endpoint.
 *
 * Unlike a CSS overlay, the mark survives screenshots, crops and re-uploads.
 * If the watermark route ever fails we fall back to the original file, so a
 * product photo can never end up broken because of branding.
 */
export default function BrandedImage({
  src,
  alt = "",
  w = 1200,
  brand = true,
  onError,
  ...rest
}: BrandedImageProps) {
  const original = src ?? "";
  const [useOriginal, setUseOriginal] = useState(!brand || !original);

  useEffect(() => {
    setUseOriginal(!brand || !original);
  }, [original, brand]);

  if (!original) return null;

  return (
    <img
      {...rest}
      src={useOriginal ? original : brandedSrc(original, w)}
      alt={alt}
      onError={(event) => {
        if (!useOriginal) setUseOriginal(true);
        onError?.(event);
      }}
    />
  );
}
