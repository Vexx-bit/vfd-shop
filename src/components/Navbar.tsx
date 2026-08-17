"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, useCart } from "@/app/providers";
import { BrandLogo } from "@/components/BrandMark";
import {
  Menu,
  X,
  ShoppingCart,
  Sun,
  Moon,
  Phone,
  Home,
  ShoppingBag,
} from "lucide-react";

/* ==========================================
   Navigation priority order (business-first):
   Shop makes money, Services & Academy bring
   high-margin work, Portfolio proves quality,
   About & Contact support the sale.
   ========================================== */
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Services", href: "/services" },
  { name: "Academy", href: "/academy" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const WHATSAPP_LINK =
  "https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ===== Masthead =====
          Transparent over the hero, then a single hairline once you scroll.
          No shadow: the rule does the separating. */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-colors duration-500 ${
          scrolled || isOpen
            ? "bg-bg-primary/90 backdrop-blur-md border-b border-border-custom"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-24">
            <Link
              href="/"
              className="shrink-0"
              aria-label="Victory Fashion Designers — home"
            >
              <BrandLogo compact={scrolled} />
            </Link>

            {/* Desktop navigation — micro-tracked caps, ink rule marks the
                current page instead of a filled chip. */}
            <nav
              className="hidden lg:flex items-center gap-9"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    isActive(link.href)
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-text-primary transition-all duration-500 ${
                      isActive(link.href) ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleTheme}
                className="tap-target p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="tap-target p-2 text-text-secondary hover:text-text-primary transition-colors relative"
                aria-label={`Open cart, ${cartCount} items`}
              >
                <ShoppingCart size={17} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 bg-text-primary text-bg-primary text-[9px] font-medium h-4 min-w-4 px-1 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center ml-4 border border-text-primary px-7 py-3 text-[10px] uppercase tracking-[0.2em] text-text-primary transition-colors hover:bg-text-primary hover:text-bg-primary"
              >
                Enquire
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden tap-target p-2 text-text-primary transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Mobile full-screen index ===== */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-bg-primary pt-24 pb-28 overflow-y-auto">
          <nav className="px-5 flex flex-col" aria-label="Mobile">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className="group flex items-baseline justify-between gap-4 border-b border-border-custom py-5"
              >
                <span
                  className={`font-serif text-[2.6rem] leading-[0.95] tracking-[-0.03em] ${
                    isActive(link.href)
                      ? "text-text-primary italic"
                      : "text-text-primary"
                  }`}
                >
                  {link.name}
                </span>
                <span className="eyebrow shrink-0">{String(idx + 1).padStart(2, "0")}</span>
              </Link>
            ))}

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 w-full flex items-center justify-center bg-text-primary text-bg-primary py-5 text-[11px] uppercase tracking-[0.22em]"
            >
              Enquire on WhatsApp
            </a>

            <p className="eyebrow text-center mt-8">where smartness matters</p>
            <p className="text-center text-[11px] text-text-tertiary mt-3 leading-relaxed">
              2nd Sunrise Avenue, Ruiru
              <br />
              Monday – Saturday, 8am – 6pm
            </p>
          </nav>
        </div>
      )}

      {/* ===== Mobile bottom bar =====
          Kept deliberately: on a phone-first storefront, thumb-reach access to
          Shop and WhatsApp is worth more than visual purity. Hairline instead
          of the old inset shadow. */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-bg-primary/95 backdrop-blur-md border-t border-border-custom pb-safe"
        aria-label="Quick actions"
      >
        <div className="grid grid-cols-5">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 py-3 tap-target ${
              pathname === "/" ? "text-text-primary" : "text-text-tertiary"
            }`}
          >
            <Home size={18} />
            <span className="text-[9px] uppercase tracking-[0.14em]">Home</span>
          </Link>

          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center gap-1 py-3 tap-target ${
              isActive("/shop") ? "text-text-primary" : "text-text-tertiary"
            }`}
          >
            <ShoppingBag size={18} />
            <span className="text-[9px] uppercase tracking-[0.14em]">Shop</span>
          </Link>

          <a
            href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%20Design%2C%20I%20want%20to%20book%20a%20fitting%20or%20make%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-3 tap-target bg-text-primary text-bg-primary"
            aria-label="Chat on WhatsApp"
          >
            <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.49-3.238l.382.227c1.545.919 3.324 1.403 5.132 1.404 5.533 0 10.038-4.501 10.04-10.04.001-2.684-1.043-5.208-2.94-7.108-1.897-1.899-4.417-2.943-7.102-2.944-5.541 0-10.048 4.507-10.05 10.047-.001 1.892.493 3.74 1.43 5.361l.248.428-1.002 3.66 3.743-.981zm11.386-5.493c-.31-.156-1.838-.907-2.117-1.008-.28-.101-.483-.151-.686.152-.204.304-.787.994-.965 1.197-.177.203-.355.228-.665.072-1.093-.547-1.862-.892-2.585-1.53-.418-.368-.696-.81-.777-1.12-.08-.31-.009-.477.069-.554.069-.069.155-.183.233-.274.078-.09.104-.152.155-.254.052-.101.026-.19-.013-.291-.039-.101-.355-.856-.487-1.17-.129-.311-.26-.269-.355-.274-.092-.004-.197-.005-.303-.005-.106 0-.278.04-.424.197-.146.157-.557.545-.557 1.329 0 .783.57 1.54.649 1.646.08.106 1.12 1.71 2.713 2.397.379.164.675.261.905.334.381.121.727.104 1.001.063.305-.045.908-.371 1.035-.73.127-.358.127-.665.089-.73-.038-.063-.14-.1-.45-.256z" />
            </svg>
            <span className="text-[9px] uppercase tracking-[0.14em]">Order</span>
          </a>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-3 tap-target text-text-tertiary"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <span className="relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-text-primary text-bg-primary text-[9px] h-4 min-w-4 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-[9px] uppercase tracking-[0.14em]">Cart</span>
          </button>

          <a
            href="tel:+254706232927"
            className="flex flex-col items-center justify-center gap-1 py-3 tap-target text-text-tertiary"
            aria-label="Call the studio"
          >
            <Phone size={18} />
            <span className="text-[9px] uppercase tracking-[0.14em]">Call</span>
          </a>
        </div>
      </nav>
    </>
  );
}
