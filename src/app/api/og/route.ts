import { NextResponse } from "next/server";
import sharp from "sharp";
import { loadProductById } from "@/lib/products";

/**
 * Open Graph card renderer for a single product.
 *
 * Deliberately contains NO text. Sharp rasterises SVG through librsvg, which
 * depends on fonts being installed in the runtime image — on serverless that is
 * a coin flip, and a missing font means either the wrong typeface or no glyphs
 * at all. The title and price are supplied as og:title / og:description instead,
 * which WhatsApp renders itself, in the chat's own font.
 *
 * Output is a 1200x630 progressive JPEG: WhatsApp's documented preview size, in
 * the one format every client supports. WebP previews are unreliable on older
 * WhatsApp builds, which is why /api/img's WebP output is not used here.
 */
export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO_WIDTH = 700;
const PANEL_WIDTH = WIDTH - PHOTO_WIDTH;
const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 10 * 1024 * 1024;

const CREAM = "#F6F1E8";
const PLUM = "#5B1A2E";

/**
 * The monogram as pure vector strokes — diagonal V, shared stem, D bowl,
 * F bar, and the bottom hook. Matches src/components/BrandMark.tsx.
 */
function monogramSvg(width: number): Buffer {
  const height = Math.round(width * (112 / 130));
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 130 112">
  <g fill="none" stroke="${PLUM}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 8 L62 100" stroke-width="11"/>
    <path d="M62 100 L62 8" stroke-width="9"/>
    <path d="M62 12 C 92 12 101 24 101 35 C 101 47 90 55 66 56" stroke-width="8"/>
    <path d="M62 51 L94 51" stroke-width="8"/>
    <path d="M62 96 C 86 96 97 87 99 72" stroke-width="8"/>
  </g>
</svg>`
  );
}

/** Cream canvas with just the monogram, for when there is no usable photo. */
async function brandOnlyCard(): Promise<Buffer> {
  const markWidth = 280;
  const mark = monogramSvg(markWidth);
  const markHeight = Math.round(markWidth * (112 / 130));

  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: CREAM,
    },
  })
    .composite([
      {
        input: mark,
        top: Math.round((HEIGHT - markHeight) / 2),
        left: Math.round((WIDTH - markWidth) / 2),
      },
    ])
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
}

function jpegResponse(body: Buffer, maxAge: number) {
  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

async function fetchPhoto(src: string): Promise<Buffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(src, { signal: controller.signal });
    if (!response.ok) return null;

    const length = Number(response.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.byteLength > MAX_BYTES ? null : buffer;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");

  try {
    const product = id ? await loadProductById(id) : null;
    if (!product?.image_url) {
      return jpegResponse(await brandOnlyCard(), 3600);
    }

    const original = await fetchPhoto(product.image_url);
    if (!original) {
      return jpegResponse(await brandOnlyCard(), 3600);
    }

    // "top" rather than "centre": garment photos are portrait, and cropping a
    // 3:4 frame into 1.9:1 from the middle tends to behead the model.
    const photo = await sharp(original)
      .rotate()
      .resize(PHOTO_WIDTH, HEIGHT, { fit: "cover", position: "top" })
      .toBuffer();

    const markWidth = 240;
    const markHeight = Math.round(markWidth * (112 / 130));

    const card = await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 3,
        background: CREAM,
      },
    })
      .composite([
        { input: photo, top: 0, left: 0 },
        {
          input: monogramSvg(markWidth),
          top: Math.round((HEIGHT - markHeight) / 2),
          left: PHOTO_WIDTH + Math.round((PANEL_WIDTH - markWidth) / 2),
        },
      ])
      // Quality 80 keeps a photographic 1200x630 well under WhatsApp's ~500KB
      // ceiling, above which it silently drops the image from the card.
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toBuffer();

    return jpegResponse(card, 86400);
  } catch (error) {
    console.error("OG card render failed:", error);
    try {
      return jpegResponse(await brandOnlyCard(), 300);
    } catch {
      return NextResponse.json(
        { error: "Could not render preview image." },
        { status: 500 }
      );
    }
  }
}
