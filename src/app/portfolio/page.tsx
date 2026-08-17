"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { MonogramWatermark } from "@/components/BrandMark";
import { X, Search, MessageSquare } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "bridal" | "traditional" | "formal" | "casual";
  categoryLabel: string;
  img: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Royal Plum Bridal Gown",
    category: "bridal",
    categoryLabel: "Bridal Wear",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    description: "Custom evening reception bridal gown with a structured sweetheart bodice, gold thread accents, and soft layered tulle.",
  },
  {
    id: "2",
    title: "Ankara Flare Silhouette",
    category: "traditional",
    categoryLabel: "Traditional / African",
    img: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
    description: "Modern Ankara prints pleated skirt with custom matching bodice, tailored specifically for wedding attendees.",
  },
  {
    id: "3",
    title: "Bespoke Charcoal Double-Breasted",
    category: "formal",
    categoryLabel: "Formal Attire",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    description: "Men's tailored slim-fit double-breasted suit using high-grade British wool blend fabric.",
  },
  {
    id: "4",
    title: "Modern Minimalist Bridal Dress",
    category: "bridal",
    categoryLabel: "Bridal Wear",
    img: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
    description: "Sleek off-shoulder satin sheath wedding gown designed for the elegant minimalist bride.",
  },
  {
    id: "5",
    title: "Linen Weekend Outfit",
    category: "casual",
    categoryLabel: "Casual Wear",
    img: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
    description: "Breathable natural linen button-down shirt paired with tailored shorts for casual weekend styling.",
  },
  {
    id: "6",
    title: "Kente Accent Dress",
    category: "traditional",
    categoryLabel: "Traditional / African",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    description: "Custom evening gown with hand-woven Ghanaian Kente panel details framing the shoulders and neckline.",
  },
];

const filters = [
  { value: "all", label: "All Works" },
  { value: "bridal", label: "Bridal Wear" },
  { value: "traditional", label: "African / Ankara" },
  { value: "formal", label: "Formal Attire" },
  { value: "casual", label: "Casual Sets" },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems =
    filter === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === filter);

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-20 bg-bg-primary">
        {/* Header */}
        <section className="py-10 sm:py-14 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
              Our Masterpieces
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Client Portfolio
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
              Hand-crafted bespoke suits, wedding gowns, traditional Ankara designs, and casual wear — every piece carries our mark.
            </p>
          </div>
        </section>

        {/* Filter pills — scrollable on mobile */}
        <section className="py-3 border-b border-border-custom sticky top-16 lg:top-20 bg-bg-primary/95 backdrop-blur-md z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
              {filters.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`tap-target px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                    filter === btn.value
                      ? "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-custom"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid — 2-up on mobile */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredItems.length === 0 ? (
              <div className="py-20 text-center text-text-tertiary font-serif text-lg">
                No designs found in this category. Check back soon!
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group text-left bg-bg-secondary rounded-xl overflow-hidden border border-border-custom shadow-soft card-lift"
                  >
                    {/* Image with brand watermark */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-bg-tertiary">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <MonogramWatermark />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                        <span className="bg-brand-cream text-brand-charcoal text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-md shadow-lg border border-brand-gold flex items-center gap-1.5">
                          <Search size={14} />
                          <span>View Detail</span>
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3 sm:p-5 space-y-1">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-text-primary line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary text-[11px] sm:text-xs line-clamp-2 leading-relaxed hidden sm:block">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
          >
            <div className="absolute inset-0" onClick={() => setSelectedItem(null)} />

            <div className="relative bg-bg-secondary text-text-primary w-full sm:max-w-3xl sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl border border-border-custom z-10 grid grid-cols-1 md:grid-cols-2 max-h-[92dvh] overflow-y-auto">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 bg-black/50 text-white hover:bg-black/70 tap-target p-2.5 rounded-full transition-colors z-20"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              {/* Image with watermark */}
              <div className="relative aspect-[3/4] bg-bg-tertiary">
                <img
                  src={selectedItem.img}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <MonogramWatermark />
              </div>

              {/* Info */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block">
                    {selectedItem.categoryLabel}
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{selectedItem.title}</h3>
                  <div className="stitch-divider"></div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                  <p className="text-xs text-text-tertiary italic">
                    * Bespoke custom order item — each piece is constructed to the client's exact measurements.
                  </p>
                </div>

                <div className="pt-4 space-y-3 pb-safe">
                  <a
                    href={`https://wa.me/254706232927?text=${encodeURIComponent(
                      `Hello Victory Fashion, I am inquiring about ordering a bespoke design similar to your "${selectedItem.title}". Photo: ${selectedItem.img}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-soft hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare size={18} />
                    <span>Inquire via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="tap-target w-full text-center text-sm text-text-tertiary hover:underline py-2"
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
