"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BrandedImage from "@/components/BrandedImage";
import { useCart } from "@/app/providers";
import {
  ShoppingCart,
  Search,
  MessageCircle,
  CheckCircle,
  Share2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  badge?: string;
  stock_quantity: number;
}

const WHATSAPP_NUMBER = "254706232927";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vfd-shop.vercel.app"
).replace(/\/+$/, "");

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function absoluteImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

/* Absolute URL to the watermarked copy, so a photo shared into WhatsApp still
   carries the monogram after it has been forwarded around. */
function brandedShareUrl(url: string) {
  const absolute = absoluteImageUrl(url);
  if (!absolute) return "";
  return `${SITE_URL}/api/img?src=${encodeURIComponent(absolute)}&w=1200`;
}

/* Products loaded from the database have UUID ids and a real share page. The
   offline fallback list does not, so those link to the shop instead of a 404. */
function productShareUrl(p: Product) {
  return UUID_RE.test(p.id) ? `${SITE_URL}/p/${p.id}` : `${SITE_URL}/shop`;
}

/* The link goes FIRST: WhatsApp only unfurls the first URL in a message, and
   only /p/[id] carries the og: tags that make the photo appear as a card. */
function orderMessage(p: Product) {
  return [
    productShareUrl(p),
    "",
    "Hello Victory Fashion! I'd like to order this piece:",
    `${p.name} — KES ${p.price.toLocaleString()}`,
    "",
    "Please confirm availability. Thank you!",
  ].join("\n");
}

function orderOnWhatsApp(p: Product) {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage(p))}`,
    "_blank"
  );
}

/* Native share sheet. On a phone this attaches the watermarked photo itself,
   so the recipient sees the garment immediately instead of a link they have to
   tap. Falls back to the WhatsApp link when file sharing is unavailable
   (desktop browsers, mostly). */
async function shareProduct(p: Product) {
  try {
    const source = brandedShareUrl(p.image_url);
    if (source) {
      const response = await fetch(source);
      if (response.ok) {
        const blob = await response.blob();
        const slug =
          p.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "victory-piece";
        const file = new File([blob], `${slug}.jpg`, {
          type: blob.type || "image/jpeg",
        });

        const shareData = { files: [file], text: orderMessage(p) };
        const nav = navigator as Navigator & {
          canShare?: (data: unknown) => boolean;
        };

        if (nav.canShare?.(shareData)) {
          await nav.share(shareData as ShareData);
          return;
        }
      }
    }
  } catch {
    // User dismissed the sheet, or the browser refused the file. Either way the
    // WhatsApp link below is a fine outcome.
  }

  orderOnWhatsApp(p);
}

const fallbackProducts: Product[] = [
  {
    id: "f1",
    name: "Floral Maxi Dress",
    category: "dresses",
    price: 2800,
    description: "Beautiful floral print maxi dress crafted from breathable lightweight crepe.",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60",
    badge: "New",
    stock_quantity: 12,
  },
  {
    id: "f2",
    name: "Ankara Flare Dress",
    category: "dresses",
    price: 3200,
    description: "Vibrant custom African print flared dress with back zipper detailing.",
    image_url: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=500&auto=format&fit=crop&q=60",
    badge: "Popular",
    stock_quantity: 8,
  },
  {
    id: "f3",
    name: "Linen Co-ord Set",
    category: "two-pieces",
    price: 3800,
    description: "Premium matching lightweight linen shirt and trousers set.",
    image_url: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=500&auto=format&fit=crop&q=60",
    badge: "New",
    stock_quantity: 6,
  },
  {
    id: "f4",
    name: "Tailored A-Line Skirt",
    category: "skirts",
    price: 1800,
    description: "A-line silhouette formal workwear skirt with detailed stitching.",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60",
    badge: undefined,
    stock_quantity: 15,
  },
  {
    id: "f5",
    name: "Silk Wrap Blouse",
    category: "tops",
    price: 1500,
    description: "Elegant silk wrap-around top with adjustable sash cuffs.",
    image_url: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500&auto=format&fit=crop&q=60",
    badge: "Sale",
    stock_quantity: 10,
  },
  {
    id: "f6",
    name: "Ankara Pencil Skirt",
    category: "skirts",
    price: 2000,
    description: "Modern high-waisted pencil skirt in bold Ankara fabric prints.",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    badge: undefined,
    stock_quantity: 5,
  },
];

const categories = [
  { value: "all", label: "All" },
  { value: "dresses", label: "Dresses" },
  { value: "tops", label: "Tops" },
  { value: "two-pieces", label: "Co-ord Sets" },
  { value: "skirts", label: "Skirts" },
];

function ProductSkeleton() {
  return (
    <div className="bg-bg-secondary rounded-xl overflow-hidden border border-border-custom">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-8 w-full rounded-lg mt-3" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        // Postgres has no browser-safe client, so the catalogue comes from our
        // own cached API route rather than straight from the database.
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error(`Products API returned ${response.status}`);

        const payload = await response.json();
        const list: Product[] = Array.isArray(payload?.products) ? payload.products : [];

        if (!cancelled) {
          setProducts(list.length > 0 ? list : fallbackProducts);
        }
      } catch (err) {
        console.error("Products fetch failed:", err);
        if (!cancelled) setProducts(fallbackProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let list =
      category === "all" ? products : products.filter((p) => p.category === category);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [products, category, search, sort]);

  const handleAdd = (p: Product) => {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
      category: p.category,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-20 bg-bg-primary">
        {/* Header */}
        <section className="py-10 sm:py-14 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
              Ready-To-Wear
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Victory Shop
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
              Handcrafted pieces, ready to wear. Message us on WhatsApp to order
              or to have anything made to your measurements.
            </p>
          </div>
        </section>

        {/* Sticky search + filter bar */}
        <section className="py-3 border-b border-border-custom bg-bg-primary/95 backdrop-blur-md sticky top-16 lg:top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dresses, skirts..."
                  className="w-full bg-bg-secondary border border-border-custom rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  aria-label="Search products"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-bg-secondary border border-border-custom rounded-full px-3 py-2.5 text-xs font-semibold text-text-secondary focus:outline-none focus:border-brand-gold"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`tap-target px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                    category === cat.value
                      ? "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-custom"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid: 2-up on mobile like real fashion stores */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-serif text-lg text-text-tertiary">
                  No items match your search.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-4 text-sm font-bold text-brand-plum dark:text-brand-gold underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-bg-secondary rounded-xl overflow-hidden border border-border-custom shadow-soft card-lift flex flex-col"
                  >
                    {/* Image — the monogram is composited into the file itself by
                        /api/img, so it survives screenshots and re-uploads. */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-bg-tertiary">
                      {p.image_url ? (
                        <BrandedImage
                          src={p.image_url}
                          alt={p.name}
                          w={800}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                          <ShoppingCart size={36} />
                        </div>
                      )}
                      {p.badge && (
                        <span className="absolute top-2 left-2 bg-brand-gold text-brand-charcoal text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded z-10">
                          {p.badge}
                        </span>
                      )}
                      {p.stock_quantity <= 3 && p.stock_quantity > 0 && (
                        <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
                          Only {p.stock_quantity} left
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-sm sm:text-base font-bold text-text-primary line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed line-clamp-2 mt-1">
                          {p.description}
                        </p>
                        <span className="block text-sm sm:text-base font-bold text-brand-plum dark:text-brand-gold mt-2">
                          KES {p.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAdd(p)}
                          className={`flex-1 tap-target px-2 py-2.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1 transition-all ${
                            addedId === p.id
                              ? "bg-green-600 text-white"
                              : "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal hover:opacity-90"
                          }`}
                        >
                          {addedId === p.id ? (
                            <>
                              <CheckCircle size={13} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={13} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => shareProduct(p)}
                          className="tap-target px-2.5 py-2.5 rounded-lg bg-bg-tertiary border border-border-custom text-text-secondary hover:bg-bg-primary transition-colors flex items-center justify-center"
                          aria-label={`Share ${p.name}`}
                          title="Send this photo to someone"
                        >
                          <Share2 size={15} />
                        </button>
                        <button
                          onClick={() => orderOnWhatsApp(p)}
                          className="tap-target px-2.5 py-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/40 text-[#1da851] dark:text-[#25D366] hover:bg-[#25D366]/20 transition-colors flex items-center justify-center"
                          aria-label={`Order ${p.name} on WhatsApp`}
                          title="Order this on WhatsApp"
                        >
                          <MessageCircle size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
