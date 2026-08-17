"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { ShieldCheck, Heart, Sparkles, MapPin, Phone } from "lucide-react";

export default function AboutPage() {
  /* The flagship concept art is optional — if the file isn't there yet we show
     a placeholder instead of a broken image. */
  const [visionArtAvailable, setVisionArtAvailable] = useState(true);

  const principles = [
    {
      title: "Precision Craftsmanship",
      description: "We don't believe in shortcuts. Every garment starts as a custom paper pattern made specifically for your body measurements.",
      icon: ShieldCheck,
    },
    {
      title: "Passion for Elegance",
      description: "Fashion is a statement of victory. We curate only premium materials and gold stitch work to create elegant, bold silhouettes.",
      icon: Heart,
    },
    {
      title: "Empowering Others",
      description: "Through our Flagship Academy, we share our 20-year sewing heritage to equip young Kenyans with self-sustaining design careers.",
      icon: Sparkles,
    },
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header Block */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">The Victory Story</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Crafting Excellence Since 2008
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Meet Antonina Harrison, Master Tailor and founder of Ruiru's premier bespoke tailoring house.
            </p>
          </div>
        </section>

        {/* Antonina Portrait & Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Image Frame */}
              <div className="lg:col-span-5 relative max-w-sm mx-auto">
                <div className="rounded-2xl overflow-hidden border-4 border-brand-cream dark:border-brand-charcoal shadow-2xl aspect-3/4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                    alt="Antonina Harrison - Master Tailor"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Stitch banner underlay */}
                <div className="absolute -bottom-6 -left-6 bg-brand-gold text-brand-charcoal py-3 px-6 rounded-lg shadow-lg font-bold border-2 border-brand-cream">
                  <div className="text-sm">Antonina Harrison</div>
                  <div className="text-[10px] uppercase tracking-wider text-brand-plum">MD &amp; Master Tailor</div>
                </div>
              </div>

              {/* Story Details */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-plum dark:text-brand-gold">
                  A Legacy of Sewing &amp; Fashion Heritage
                </h2>
                <div className="stitch-divider max-w-md"></div>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  For over two decades, Antonina Harrison has lived and breathed fashion design. What began as a personal passion for creating custom garments in Kiambu evolved into{" "}
                  <strong className="text-text-primary font-semibold">Victory Fashion Design</strong>, established in 2008 in Ruiru. Under her leadership, the studio has grown into a highly recognized brand known for custom dressmaking, bridal wear, and corporate outfits.
                </p>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  "At Victory, we do not just sew fabrics together. We study the client's silhouette, understand the occasion, select fabrics that speak, and construct a garment that feels like a crowning victory."
                </p>
                <div className="p-6 bg-bg-secondary rounded-xl border border-border-custom italic text-sm text-text-secondary leading-relaxed">
                  "School uniforms represent low margins and generic manufacturing. We purposefully de-prioritize school uniforms to dedicate our focus entirely to premium, bespoke tailoring, bridal gowns, choir robes, and professional fashion training."
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Philosophy & Principles */}
        <section className="py-16 bg-bg-secondary border-y border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Our Philosophy</span>
              <h2 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold">
                The Principles of Victory
              </h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((pr, idx) => (
                <div
                  key={idx}
                  className="bg-bg-primary p-8 rounded-xl border border-border-custom text-center space-y-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-12 w-12 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-plum dark:text-brand-gold mx-auto">
                    <pr.icon size={22} />
                  </div>
                  <h3 className="font-serif text-base font-bold">{pr.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {pr.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fitting Studio Location — the real, current premises */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Ruiru Atelier</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-plum dark:text-brand-gold">
                  Step Inside Our Studio
                </h2>
                <div className="stitch-divider max-w-sm"></div>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  Located near the Rainbow Resort off Thika Superhighway, our bright, modern studio is designed to offer a personalized fitting experience. From our fabric selector walls featuring premium African prints, custom lace, and imported suiting materials, to our professional sewing floor where academy students master their craft.
                </p>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-brand-gold shrink-0" />
                    <span>2nd Sunrise Ave, Ruiru, Kiambu County, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-brand-gold shrink-0" />
                    <a href="tel:+254706232927" className="hover:underline font-semibold text-text-primary">
                      WhatsApp/Call +254 706 232 927
                    </a>
                  </div>
                </div>
              </div>

              {/* Studio Mood Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video border-4 border-brand-cream dark:border-brand-charcoal shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"
                  alt="Tailoring studio floor at Victory Fashion Design"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        </section>

        {/*
          The Vision — flagship concept artwork.

          Deliberately placed AFTER the real studio section and labelled a
          concept illustration. It is an artist's render of where the business is
          headed, not a photograph of the current premises, and the page says so
          plainly. Passing a render off as the real shop is the kind of thing
          customers notice, and it costs more trust than it buys.
        */}
        <section className="py-16 bg-bg-secondary border-y border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              <div className="order-2 lg:order-1">
                {visionArtAvailable ? (
                  <div className="relative rounded-2xl overflow-hidden border-4 border-brand-cream dark:border-brand-charcoal shadow-2xl">
                    <img
                      src="/assets/images/vision-storefront.png"
                      alt="Artist's concept illustration of a future Victory Fashion Designers flagship storefront"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                      onError={() => setVisionArtAvailable(false)}
                    />
                    <span className="absolute bottom-3 right-3 bg-brand-charcoal/85 text-brand-cream text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                      Concept illustration
                    </span>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-border-custom aspect-video flex flex-col items-center justify-center text-center p-8 gap-2">
                    <Sparkles size={26} className="text-brand-gold" />
                    <p className="font-serif font-bold text-text-primary text-sm">
                      Flagship concept artwork
                    </p>
                    <p className="text-text-tertiary text-xs leading-relaxed max-w-xs">
                      Save the render as{" "}
                      <code className="font-mono text-[11px]">
                        public/assets/images/vision-storefront.png
                      </code>{" "}
                      and it will appear here automatically.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                  Where We're Headed
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-plum dark:text-brand-gold">
                  The Vision: A Victory Flagship
                </h2>
                <div className="stitch-divider max-w-sm"></div>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  The illustration above is not our shop today — it is the one we
                  are building towards. A dedicated Victory flagship on the Ruiru
                  high street: full-height display windows, a private bridal
                  fitting suite, and a training floor with room for a full
                  academy intake at once.
                </p>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  Every bespoke commission and every academy graduate moves that
                  plan a step closer. Until then, you will find us at the Ruiru
                  atelier above, where the work has been done by hand since 2008.
                </p>
                <div className="p-5 bg-bg-primary rounded-xl border border-border-custom text-sm text-text-secondary leading-relaxed">
                  <span className="font-bold text-text-primary">Our commitment:</span>{" "}
                  every photograph of a garment, a fitting or a graduating class
                  on this site is real work from our studio. Anything
                  illustrative is labelled as such.
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
