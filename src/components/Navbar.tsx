"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, useCart } from "@/app/providers";
import {
  Menu,
  X,
  ShoppingCart,
  Sun,
  Moon,
  Phone,
  Home,
  ShoppingBag,
  MessageCircle,
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

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 group shrink-0">
      <svg
        className={`${compact ? "h-7 w-7" : "h-8 w-8"} text-brand-gold group-hover:scale-105 transition-transform`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15 15 L50 85 L85 15"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="50" cy="28" rx="2" ry="6" fill="#F6F1E7" />
        <path
          d="M30 46 C 45 42, 55 58, 70 54"
          stroke="#5B1A2E"
          strokeWidth="3"
          strokeDasharray="4,4"
          className="dark:stroke-brand-cream"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-brand-plum dark:text-brand-gold">
          Victory Fashion
        </span>
        <span className="text-[10px] uppercase tracking-wider text-text-tertiary mt-0.5">
          Design & Academy
        </span>
      </div>
    </Link>
  );
}

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
      {/* ===== Sticky Header ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-bg-secondary/95 backdrop-blur-md shadow-soft border-b border-border-custom"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <BrandMark compact={scrolled} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-brand-gold font-bold bg-brand-gold/10"
                      : "text-text-secondary hover:text-brand-plum dark:hover:text-brand-gold hover:bg-bg-tertiary/60"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={toggleTheme}
                className="tap-target p-2.5 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary"
                aria-label="Toggle dark mode"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="tap-target p-2.5 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary relative"
                aria-label={`Open cart, ${cartCount} items`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 bg-brand-plum hover:bg-brand-plum/90 dark:bg-brand-gold dark:text-brand-charcoal dark:hover:bg-brand-gold/90 text-brand-cream px-5 py-2.5 rounded-md font-semibold text-sm transition-all shadow-soft hover:-translate-y-0.5"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Us</span>
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden tap-target p-2.5 rounded-full hover:bg-bg-tertiary transition-colors text-text-primary"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Mobile full-screen menu ===== */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-bg-primary pt-20 pb-28 overflow-y-auto">
          <nav className="px-6 py-6 flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between py-4 border-b border-border-custom/70 ${
                  isActive(link.href)
                    ? "text-brand-gold"
                    : "text-text-primary"
                }`}
              >
                <span className="font-serif text-2xl font-bold">{link.name}</span>
                <span className="text-xs font-mono text-text-tertiary">
                  0{idx + 1}
                </span>
              </Link>
            ))}

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full flex items-center justify-center gap-2 bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream py-4 rounded-xl font-bold text-base shadow-lift"
            >
              <MessageCircle size={20} />
              <span>Chat With Us on WhatsApp</span>
            </a>
            <p className="text-center text-xs text-text-tertiary mt-4">
              2nd Sunrise Ave, Ruiru · Mon–Sat 8AM–6PM
            </p>
          </nav>
        </div>
      )}

      {/* ===== Mobile bottom tab bar (thumb reach) ===== */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-bg-secondary/95 backdrop-blur-md border-t border-border-custom shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe"
        aria-label="Quick actions"
      >
        <div className="grid grid-cols-5 px-1">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 tap-target ${
              pathname === "/" ? "text-brand-gold" : "text-text-secondary"
            }`}
          >
            <Home size={20} />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 tap-target ${
              isActive("/shop") ? "text-brand-gold" : "text-text-secondary"
            }`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px] font-semibold">Shop</span>
          </Link>

          {/* Center WhatsApp FAB */}
          <a
            href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%20Design%2C%20I%20want%20to%20book%20a%20fitting%20or%20make%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center -mt-5"
            aria-label="Chat on WhatsApp"
          >
            <span className="h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lift border-4 border-bg-secondary">
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.49-3.238l.382.227c1.545.919 3.324 1.403 5.132 1.404 5.533 0 10.038-4.501 10.04-10.04.001-2.684-1.043-5.208-2.94-7.108-1.897-1.899-4.417-2.943-7.102-2.944-5.541 0-10.048 4.507-10.05 10.047-.001 1.892.493 3.74 1.43 5.361l.248.428-1.002 3.66 3.743-.981zm11.386-5.493c-.31-.156-1.838-.907-2.117-1.008-.28-.101-.483-.151-.686.152-.204.304-.787.994-.965 1.197-.177.203-.355.228-.665.072-1.093-.547-1.862-.892-2.585-1.53-.418-.368-.696-.81-.777-1.12-.08-.31-.009-.477.069-.554.069-.069.155-.183.233-.274.078-.09.104-.152.155-.254.052-.101.026-.19-.013-.291-.039-.101-.355-.856-.487-1.17-.129-.311-.26-.269-.355-.274-.092-.004-.197-.005-.303-.005-.106 0-.278.04-.424.197-.146.157-.557.545-.557 1.329 0 .783.57 1.54.649 1.646.08.106 1.12 1.71 2.713 2.397.379.164.675.261.905.334.381.121.727.104 1.001.063.305-.045.908-.371 1.035-.73.127-.358.127-.665.089-.73-.038-.063-.14-.1-.45-.256z" />
              </svg>
            </span>
            <span className="text-[10px] font-bold text-[#25D366] mt-0.5">Order</span>
          </a>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 tap-target text-text-secondary relative"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <span className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal text-[9px] font-bold h-4 min-w-4 px-0.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>

          <a
            href="tel:+254706232927"
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 tap-target text-text-secondary"
            aria-label="Call the studio"
          >
            <Phone size={20} />
            <span className="text-[10px] font-semibold">Call</span>
          </a>
        </div>
      </nav>
    </>
  );
}
