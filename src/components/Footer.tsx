"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUp, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandMark";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Ready-to-Wear Shop", href: "/shop" },
  { label: "Bespoke Services", href: "/services" },
  { label: "Fashion Academy", href: "/academy" },
  { label: "Client Portfolio", href: "/portfolio" },
  { label: "About Antonina", href: "/about" },
  { label: "Contact Studio", href: "/contact" },
];

const specialties = [
  { label: "Bespoke Dressmaking", href: "/services/custom-dressmaking" },
  { label: "Bridal & Occasion Gowns", href: "/services/bridal-and-occasion-wear" },
  { label: "Men's Custom Wear", href: "/services/mens-wear" },
  { label: "Choir Robes & Group Orders", href: "/services/choir-robes-and-group-orders" },
  { label: "Corporate & Salon Uniforms", href: "/services/corporate-uniforms" },
  { label: "Repairs & Alterations", href: "/services/repairs-and-alterations" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-bg-secondary border-t border-border-custom text-text-secondary pt-14 pb-32 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WhatsApp banner strip */}
        <div className="mb-12 rounded-2xl bg-brand-plum dark:bg-brand-charcoal text-brand-cream p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 border border-brand-gold/30">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-gold">
              Ready for your perfect fit?
            </h3>
            <p className="text-sm text-brand-cream/80 mt-1">
              Message us a photo of what you love — we will tailor it to you.
            </p>
          </div>
          <a
            href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20would%20like%20to%20make%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb857] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lift transition-all hover:-translate-y-0.5 shrink-0"
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="Victory Fashion Designers — home">
              <BrandLogo showTagline />
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              Transforming your fashion dreams into bespoke masterpieces since 2008. Ruiru's premier tailoring house and professional fashion academy.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary block mb-2">
                Accepted Payments
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-bg-tertiary dark:bg-bg-primary text-text-primary px-2.5 py-1 rounded text-xs font-bold border border-border-custom">
                  M-Pesa STK
                </span>
                <span className="bg-bg-tertiary dark:bg-bg-primary text-text-primary px-2.5 py-1 rounded text-xs font-bold border border-border-custom">
                  Cash / Transfer
                </span>
                <span className="bg-bg-tertiary dark:bg-bg-primary text-text-primary px-2.5 py-1 rounded text-xs font-bold border border-border-custom">
                  Pay on Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer">
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 border-b border-border-custom pb-2">
              Quick Links
            </h4>
            <ul className="space-y-1 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-block py-1.5 hover:text-brand-plum dark:hover:text-brand-gold transition-colors ${
                      link.href === "/academy"
                        ? "font-semibold text-brand-plum dark:text-brand-gold"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Specialties */}
          <div>
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 border-b border-border-custom pb-2">
              Our Specialties
            </h4>
            <ul className="space-y-1 text-sm">
              {specialties.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="inline-block py-1.5 hover:text-brand-plum dark:hover:text-brand-gold transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 border-b border-border-custom pb-2">
              Contact & Studio
            </h4>
            <div className="flex items-start gap-2.5 text-sm leading-relaxed">
              <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
              <span>
                2nd Sunrise Ave, Ruiru, Kenya
                <br />
                Near Rainbow Resort,
                <br />
                Off Thika Superhighway
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock size={18} className="text-brand-gold shrink-0" />
              <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <a href="tel:+254706232927" className="hover:underline tap-target inline-flex items-center">
                +254 706 232 927
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <a href="mailto:info@victoryfashion.co.ke" className="hover:underline break-all">
                info@victoryfashion.co.ke
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-custom pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>
            &copy; {currentYear} Victory Fashion Designers & Training. All rights reserved.
          </p>
          <p className="italic text-text-tertiary">where smartness matters</p>
          <div className="flex items-center gap-4">
            <p>
              Designed with ❤️ by{" "}
              <a
                href="https://wa.me/254706036754"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold underline"
              >
                ToniDev
              </a>
            </p>
            <button
              onClick={handleScrollToTop}
              className="tap-target bg-bg-tertiary p-3 rounded-full hover:bg-brand-plum hover:text-brand-cream dark:hover:bg-brand-gold dark:hover:text-brand-charcoal transition-all"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
