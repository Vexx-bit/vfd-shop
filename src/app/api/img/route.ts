import { NextResponse } from "next/server";
import sharp from "sharp";

/**
 * Watermarking image proxy.
 *
 * A CSS overlay disappears the moment someone screenshots or crops the photo.
 * This route composites the VFD monogram into the actual image bytes, so the
 * mark travels with the file wherever it is reposted.
 *
 * Usage:  /api/img?src=<image url>&w=1200
 *
 * Design notes:
 * - Output is WebP and cached immutably for a year; the src URL is the cache key.
 * - Any failure redirects to the original image, so a bad watermark never turns
 *   into a broken product photo.
 * - Remote hosts must be allowlisted so this cannot be abused as an open proxy.
 */

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 8000;
const DEFAULT_WIDTH = 1200;
const MAX_WIDTH = 2000;

/** Hosts we already serve images from. Extend with IMAGE_PROXY_ALLOWED_HOSTS. */
const DEFAULT_ALLOWED_HOSTS = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
  "raw.githubusercontent.com",
];

function allowedHosts(): string[] {
  const extra = (process.env.IMAGE_PROXY_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return [...DEFAULT_ALLOWED_HOSTS, ...extra];
}

/**
 * The monogram, drawn twice: a dark offset copy for legibility on pale fabric,
 * then the white mark on top. Same geometry as <Monogram /> in BrandMark.tsx.
 */
function monogramSvg(width: number): string {
  const height = Math.round((width * 112) / 130);
  const paths = `
    <path d="M12 8 L62 100" stroke-width="11"/>
    <path d="M62 100 L62 8" stroke-width="9"/>
    <path d="M62 12 C 92 12 101 24 101 35 C 101 47 90 55 66 56" stroke-width="8"/>
    <path d="M62 51 L94 51" stroke-width="8"/>
    <path d="M62 96 C 86 96 97 87 99 72" stroke-width="8"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 130 112">
  <g fill="none" stroke="#000000" stroke-opacity="0.28" stroke-linecap="round" stroke-linejoin="round" transform="translate(2.5,2.5)">${paths}</g>
  <g fill="none" stroke="#FFFFFF" stroke-opacity="0.62" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
}

function passThrough(src: string) {
  // Never break the image — just serve it unbranded.
  return NextResponse.redirect(src, 302);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const src = requestUrl.searchParams.get("src");

  if (!src) {
    return NextResponse.json({ error: "Missing src parameter" }, { status: 400 });
  }

  const requestedWidth = Number(requestUrl.searchParams.get("w"));
  const width = Number.isFinite(requestedWidth) && requestedWidth > 0
    ? Math.min(Math.round(requestedWidth), MAX_WIDTH)
    : DEFAULT_WIDTH;

  let target: URL;
  try {
    target = new URL(src, requestUrl.origin);
  } catch {
    return NextResponse.json({ error: "Invalid src parameter" }, { status: 400 });
  }

  const isSameOrigin = target.origin === requestUrl.origin;
  if (!isSameOrigin) {
    if (target.protocol !== "https:") return passThrough(src);
    if (!allowedHosts().includes(target.hostname.toLowerCase())) {
      return passThrough(src);
    }
  }

  try {
    const response = await fetch(target, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: "image/*" },
    });

    if (!response.ok) return passThrough(src);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return passThrough(src);

    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_BYTES) return passThrough(src);

    const inputBuffer = Buffer.from(await response.arrayBuffer());
    if (inputBuffer.byteLength > MAX_BYTES) return passThrough(src);

    // .rotate() with no argument honours the EXIF orientation flag, which
    // matters a lot for photos taken on a phone.
    const { data: baseData, info } = await sharp(inputBuffer, { failOn: "none" })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });

    const markWidth = Math.max(80, Math.round(info.width * 0.24));
    const markHeight = Math.round((markWidth * 112) / 130);
    const margin = Math.round(info.width * 0.035);

    const watermark = await sharp(Buffer.from(monogramSvg(markWidth)))
      .png()
      .toBuffer();

    const output = await sharp(baseData)
      .composite([
        {
          input: watermark,
          top: Math.max(0, info.height - markHeight - margin),
          left: Math.max(0, info.width - markWidth - margin),
        },
      ])
      .webp({ quality: 82 })
      .toBuffer();

    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("Watermark route failed for", src, error?.message);
    return passThrough(src);
  }
}
