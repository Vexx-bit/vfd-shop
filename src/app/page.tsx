"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import {
  Scissors,
  Award,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle,
  ChevronRight,
  Ruler,
  ShoppingBag,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

const trustStats = [
  { label: "Years of Experience", value: "20+", icon: Award },
  { label: "Custom Outfits Tailored", value: "5,000+", icon: Scissors },
  { label: "Academy Graduates", value: "150+", icon: Users },
  { label: "Google Business Rating", value: "4.9/5 ★", icon: Star },
];

const services = [
  {
    title: "Bespoke Custom Dressmaking",
    description: "Made-to-measure premium custom gowns, skirts, and dresses tailored to accent your unique silhouette.",
    price: "From KES 3,500",
    link: "/services/custom-dressmaking",
  },
  {
    title: "Bridal & Occasion Wear",
    description: "Bespoke wedding gowns, evening wear, and bridesmaid dresses for your most unforgettable milestones.",
    price: "From KES 15,000",
    link: "/services/bridal-and-occasion-wear",
  },
  {
    title: "Men's Custom Wear",
    description: "Perfectly tailored formal shirts, custom t-shirts, and tailored trousers designed for confidence.",
    price: "From KES 2,500",
    link: "/services/mens-wear",
  },
  {
    title: "Choir Robes & Group Orders",
    description: "Cohesive matching outfits and elegant robes for church choirs, weddings, and family chama groups.",
    price: "Special Group Pricing",
    link: "/services/choir-robes-and-group-orders",
  },
  {
    title: "Corporate & Staff Uniforms",
    description: "Premium, durable, branded staff uniforms tailored for restaurants, salons, offices, and SACCOs.",
    price: "From KES 1,800 / pc",
    link: "/services/corporate-uniforms",
  },
  {
    title: "Repairs & Alterations",
    description: "Breathe new life into your wardrobe with our prompt, precision alterations and repair service.",
    price: "From KES 200",
    link: "/services/repairs-and-alterations",
  },
];

const featuredWorks = [
  {
    title: "Plum & Gold Wedding Gown",
    category: "Bridal",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Custom Ankara Silhouette",
    category: "African-Modern",
    img: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Bespoke Charcoal Double-Breasted",
    category: "Men's Wear",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60",
  },
];

const testimonials = [
  {
    quote:
      "Antonina Harrison is a master of her craft. She designed my wedding gown and it fit like a dream. Absolutely stunning work!",
    author: "Grace Wambui",
    location: "Ruiru",
    stars: 5,
  },
  {
    quote:
      "We ordered 40 custom choir robes for our church, and Victory delivered them in less than 2 weeks. High quality and professional service.",
    author: "Pastor Samuel Njenga",
    location: "Thika",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        {/* ===== Hero: mobile-first, action-led ===== */}
        <section className="relative bg-bg-secondary overflow-hidden pt-24 lg:pt-32 pb-10 lg:pb-20">
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-5 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-plum rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-gold rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Copy */}
              <div className="space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blush/60 dark:bg-brand-charcoal border border-brand-gold/30 rounded-full text-brand-plum dark:text-brand-gold text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>Ruiru's Premier Tailoring House</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-plum dark:text-brand-gold leading-[1.05]">
                  Bespoke. Bold.
                  <br />
                  <span className="text-text-primary">Made in Ruiru.</span>
                </h1>

                <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Led by Antonina Harrison, Master Tailor with 20 years of experience. High-end bespoke garments, and a training academy for the next generation of designers.
                </p>

                {/* Primary actions — Shop first (money), then WhatsApp, then Academy */}
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/shop"
                    className="tap-target w-full bg-brand-plum hover:bg-brand-plum/95 dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase shadow-lift hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    <span>Shop Ready-to-Wear</span>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20would%20like%20to%20book%20a%20fitting."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target bg-[#25D366] hover:bg-[#1fb857] text-white px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase shadow-soft flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      <span>Book Fitting</span>
                    </a>
                    <Link
                      href="/academy"
                      className="tap-target bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase border border-border-custom flex items-center justify-center gap-2"
                    >
                      <GraduationCap size={16} />
                      <span>Academy</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hero image card */}
              <div className="relative mx-auto lg:ml-auto max-w-sm sm:max-w-md w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lift border-4 border-brand-cream dark:border-brand-charcoal">
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"
                    alt="Bespoke bridal gown by Victory Fashion Design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-brand-cream">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                      Bridal & Occasion Wear
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-1">
                      Antonina Harrison Collection
                    </h3>
                    <p className="text-xs text-brand-cream/80 mt-1">
                      Hand-crafted custom couture, shipped nationwide.
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-gold/15 dark:bg-brand-gold/10 rounded-full blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Trust strip ===== */}
        <section className="bg-brand-plum dark:bg-bg-secondary text-brand-cream py-8 sm:py-10 border-y border-brand-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {trustStats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-center text-brand-gold mb-1">
                    <stat.icon size={22} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-brand-gold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs tracking-wider uppercase text-brand-cream/85">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Services ===== */}
        <section className="py-16 sm:py-20 bg-bg-primary" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12 sm:mb-16">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                Premium Tailoring
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-plum dark:text-brand-gold">
                Bespoke Design Specialties
              </h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
              <p className="text-text-secondary max-w-lg mx-auto text-sm">
                Each garment is individually patterned, cut, and tailored to perfection in our Ruiru studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {services.map((service, idx) => (
                <Link
                  key={idx}
                  href={service.link}
                  className="bg-bg-secondary p-6 sm:p-8 rounded-xl border border-border-custom card-lift flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="h-10 w-10 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-plum dark:text-brand-gold">
                      <Scissors size={20} />
                    </div>
                    <h3 className="font-serif text-lg font-bold group-hover:text-brand-plum dark:group-hover:text-brand-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-border-custom flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                      {service.price}
                    </span>
                    <span className="text-text-primary group-hover:text-brand-plum dark:group-hover:text-brand-gold font-semibold text-xs flex items-center gap-1">
                      <span>Learn More</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Academy teaser ===== */}
        <section className="py-16 sm:py-20 bg-bg-secondary relative border-y border-border-custom overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blush/30 dark:bg-brand-charcoal/50 skew-x-12 -z-0 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5 order-2 lg:order-1">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                  Flagship Academy
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-plum dark:text-brand-gold">
                  Victory Fashion Training Academy
                </h2>
                <div className="stitch-divider max-w-sm"></div>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  Turn your creative passion into a rewarding career. Beginner to advanced training in tailoring, dressmaking, fashion sketching, and business management.
                </p>

                <ul className="space-y-3 text-sm">
                  {[
                    "Hands-on practice (Max 15 students per class)",
                    "Comprehensive 2-Year Diploma & Certificate courses",
                    "Flexible payment installments available",
                    "Mentorship & career placement assistance",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-brand-gold shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3">
                  <Link
                    href="/academy"
                    className="tap-target inline-flex items-center gap-2 bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase shadow-soft hover:-translate-y-0.5 transition-all"
                  >
                    <span>View Courses & Enroll</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="relative max-w-md mx-auto lg:mr-0 w-full order-1 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/2] shadow-lift border-4 border-brand-cream dark:border-brand-charcoal">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
                    alt="Students learning pattern cutting at Victory Academy"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-brand-gold text-brand-charcoal p-3 sm:p-4 rounded-xl shadow-lift border-2 border-brand-cream text-center font-bold">
                  <div className="text-base sm:text-lg">Next Intake</div>
                  <div className="text-[10px] uppercase tracking-wider text-brand-plum font-extrabold">
                    Enrolling Now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Portfolio showcase ===== */}
        <section className="py-16 sm:py-20 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                  Our Work
                </span>
                <h2 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold mt-1">
                  Signature Creations
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="tap-target inline-flex items-center gap-2 border border-brand-gold hover:bg-brand-gold hover:text-brand-charcoal text-text-primary px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>View Full Gallery</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {featuredWorks.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-soft border border-border-custom card-lift"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent p-5 flex flex-col justify-end text-brand-cream">
                    <span className="text-[10px] uppercase tracking-wider text-brand-gold font-extrabold">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-base font-bold mt-1">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Testimonials ===== */}
        <section className="py-16 sm:py-20 bg-bg-secondary border-t border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                Client Success
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold">
                Loved by the Community
              </h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
              {testimonials.map((test, idx) => (
                <figure
                  key={idx}
                  className="bg-bg-primary p-6 sm:p-8 rounded-xl shadow-soft border border-border-custom stitch-border"
                >
                  <div className="text-brand-gold flex gap-0.5 mb-4">
                    {Array.from({ length: test.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="text-text-secondary text-sm italic leading-relaxed mb-5">
                    "{test.quote}"
                  </blockquote>
                  <figcaption>
                    <h4 className="font-serif text-sm font-bold">{test.author}</h4>
                    <span className="text-xs text-text-tertiary">{test.location}, Kenya</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Studio location / CTA ===== */}
        <section className="py-16 sm:py-20 bg-bg-primary" id="location">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 sm:p-10 shadow-lift grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-brand-gold">
                  <MapPin size={22} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Visit the Studio
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold">
                  What to expect at your first fitting
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Visit us on 2nd Sunrise Ave in Ruiru. Antonina will personally take your measurements, discuss fabrics and silhouettes, and sketch your custom order.
                </p>
                <div className="p-4 bg-bg-primary rounded-xl border border-border-custom space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold shrink-0">Address:</span>
                    <span className="text-text-secondary text-right">2nd Sunrise Ave, Ruiru</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold shrink-0">Hours:</span>
                    <span className="text-text-secondary text-right">Mon – Sat, 8AM – 6PM</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden aspect-video border border-border-custom shadow-soft bg-bg-tertiary flex items-center justify-center text-center p-4">
                  <div>
                    <MapPin size={30} className="text-brand-plum dark:text-brand-gold mx-auto mb-2" />
                    <span className="font-bold block text-sm">Google Map Location</span>
                    <span className="text-xs text-text-tertiary">
                      2nd Sunrise Ave, Ruiru, near Rainbow Resort
                    </span>
                    <a
                      href="https://maps.google.com/?q=2nd+Sunrise+Ave+Ruiru+Kenya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 tap-target inline-flex items-center text-xs bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
                <a
                  href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I'd%20like%20to%20discuss%20a%20tailoring%20job."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb857] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-soft"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
