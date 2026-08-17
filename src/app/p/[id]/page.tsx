import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadProductById } from "@/lib/products";

/**
 * Shareable single-product page.
 *
 * This exists so WhatsApp has something with og: tags to unfurl. WhatsApp's
 * crawler does not execute JavaScript, so this is a server component and the
 * metadata is rendered into the initial HTML response.
 */

const WHATSAPP_NUMBER = "254706232927";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vfd-shop.vercel.app"
).replace(/\/+$/, "");

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProductById(id);

  if (!product) {
    return {
      title: "Piece not found",
      robots: { index: false, follow: false },
    };
  }

  const price = `KES ${product.price.toLocaleString()}`;
  const canonical = `${SITE_URL}/p/${product.id}`;
  const cardImage = `${SITE_URL}/api/og?id=${product.id}`;

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ||
      `${product.name} — ${price}. Handmade in Ruiru by Victory Fashion Designers.`,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Victory Fashion Design",
      locale: "en_KE",
      title: `${product.name} — ${price}`,
      description:
        product.description?.slice(0, 200) ||
        "Handmade in Ruiru by Victory Fashion Designers.",
      images: [
        {
          url: cardImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${price}`,
      images: [cardImage],
    },
  };
}

export default async function ProductSharePage({ params }: PageProps) {
  const { id } = await params;
  const product = await loadProductById(id);

  if (!product) notFound();

  const price = `KES ${product.price.toLocaleString()}`;
  const photo = product.image_url
    ? `/api/img?src=${encodeURIComponent(product.image_url)}&w=1200`
    : null;

  const orderText = [
    `${SITE_URL}/p/${product.id}`,
    "",
    "Hello Victory Fashion! I'd like to order this piece:",
    `${product.name} — ${price}`,
    "",
    "Please confirm availability. Thank you!",
  ].join("\n");

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-20 bg-bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid gap-8 lg:gap-14 lg:grid-cols-2 items-start">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-bg-tertiary border border-border-custom">
              {photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photo}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-text-primary">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-brand-plum dark:text-brand-gold mt-4">
                {price}
              </p>

              {product.description ? (
                <p className="text-text-secondary leading-relaxed mt-5">
                  {product.description}
                </p>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target text-center rounded-xl bg-brand-plum px-6 py-3.5 font-bold text-brand-cream uppercase tracking-wide text-sm transition hover:opacity-90"
                >
                  Order on WhatsApp
                </a>
                <Link
                  href="/shop"
                  className="tap-target text-center rounded-xl border border-border-custom px-6 py-3.5 font-bold uppercase tracking-wide text-sm text-text-secondary transition hover:bg-bg-secondary"
                >
                  See the full shop
                </Link>
              </div>

              <p className="text-xs text-text-tertiary mt-6 leading-relaxed">
                Handmade at our Ruiru studio. Alterations to your measurements
                are included — mention them when you message us.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
