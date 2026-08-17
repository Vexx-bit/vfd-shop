"use client";

import React, { useState } from "react";
import { useCart } from "@/app/providers";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  CheckCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "254706232927";
const SITE_URL = "https://vfd-shop.vercel.app";

/* Make sure an image path becomes a full public URL so WhatsApp
   can render a thumbnail preview of it in the chat. */
function absoluteImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "paying">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stk" | "whatsapp">("whatsapp");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const deliveryFee = cartTotal >= 5000 ? 0 : 300;
  const grandTotal = cartTotal + deliveryFee;

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep("cart");
      setPaymentStatus("");
      setLoading(false);
    }, 300);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in all fields");
      return;
    }

    let cleanPhone = phone.replace(/[\s\+\-]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.substring(1);
    }
    if (!/^254\d{9}$/.test(cleanPhone)) {
      alert("Please enter a valid phone number in format 254XXXXXXXXX or 07XXXXXXXX");
      return;
    }

    setLoading(true);

    if (paymentMethod === "whatsapp") {
      try {
        const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        /* WhatsApp renders an inline image preview for image URLs found in a
           message. We put the lead item's photo right at the top, then a photo
           link under every item, so Antonina sees exactly which garment the
           customer picked — no guessing from names alone. */
        const lines: string[] = [];
        lines.push(`NEW ORDER: ${orderNumber}`);
        lines.push("");

        const leadImage = absoluteImageUrl(cart[0]?.image_url || "");
        if (leadImage) {
          lines.push(`ITEM PHOTO: ${leadImage}`);
          lines.push("");
        }

        lines.push(`Customer Name: ${name}`);
        lines.push(`Phone: ${cleanPhone}`);
        lines.push(`Delivery Address: ${address}`);
        lines.push("");
        lines.push("ITEMS ORDERED:");
        cart.forEach((item, idx) => {
          lines.push(
            `${idx + 1}. ${item.name} (Qty: ${item.quantity}) — KES ${(item.price * item.quantity).toLocaleString()}`
          );
          const img = absoluteImageUrl(item.image_url);
          if (img) lines.push(`   Photo: ${img}`);
        });
        lines.push("");
        lines.push(`Subtotal: KES ${cartTotal.toLocaleString()}`);
        lines.push(`Delivery Fee: ${deliveryFee === 0 ? "FREE" : "KES " + deliveryFee}`);
        lines.push(`TOTAL AMOUNT: KES ${grandTotal.toLocaleString()}`);
        lines.push("");
        lines.push(`Confirm order via Victory Shop: ${SITE_URL}/shop`);

        const message = lines.join("\n");

        await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderNumber,
            customer_name: name,
            customer_phone: cleanPhone,
            delivery_address: address,
            subtotal: cartTotal,
            delivery_fee: deliveryFee,
            total: grandTotal,
            payment_method: "whatsapp",
            items: cart.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
              image_url: absoluteImageUrl(item.image_url),
            })),
          }),
        });

        const whatsappUrl = `{{https://wa.me/${WHATSAPP_NUMBER}}}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        clearCart();
        handleClose();
      } catch (err) {
        console.error(err);
        alert("Something went wrong placing the order.");
      } finally {
        setLoading(false);
      }
    } else {
      // M-Pesa STK Push
      setCheckoutStep("paying");
      setPaymentStatus("Sending M-Pesa prompt to your phone...");
      try {
        const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        const orderRes = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderNumber,
            customer_name: name,
            customer_phone: cleanPhone,
            delivery_address: address,
            subtotal: cartTotal,
            delivery_fee: deliveryFee,
            total: grandTotal,
            payment_method: "mpesa_stk",
            items: cart.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
              image_url: absoluteImageUrl(item.image_url),
            })),
          }),
        });

        if (!orderRes.ok) throw new Error("Failed to create order");

        const payRes = await fetch("/api/mpesa-stk-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: cleanPhone,
            amount: grandTotal,
            accountReference: orderNumber,
          }),
        });

        const payData = await payRes.json();

        if (payRes.ok && payData.success) {
          setPaymentStatus(
            "Prompt sent! Enter your M-Pesa PIN on your phone. We are checking payment status..."
          );

          let attempts = 0;
          const interval = setInterval(async () => {
            attempts++;
            if (attempts > 12) {
              clearInterval(interval);
              setPaymentStatus(
                "Payment check timed out. If you paid, our team will confirm via WhatsApp shortly!"
              );
              setLoading(false);
              setTimeout(() => {
                clearCart();
                handleClose();
              }, 5000);
              return;
            }

            const statusRes = await fetch(`/api/orders/status?orderNumber=${orderNumber}`);
            const statusData = await statusRes.json();

            if (statusData.payment_status === "paid") {
              clearInterval(interval);
              setPaymentStatus("Payment successful! Your order is confirmed.");
              setLoading(false);
              setTimeout(() => {
                clearCart();
                handleClose();
              }, 3000);
            } else if (statusData.payment_status === "failed") {
              clearInterval(interval);
              setPaymentStatus("M-Pesa payment failed or was cancelled.");
              setLoading(false);
            }
          }, 5000);
        } else {
          throw new Error(payData.error || "M-Pesa request failed.");
        }
      } catch (err: any) {
        console.error(err);
        setPaymentStatus(
          `Error: ${err.message || "Payment failed"}. Switching you to WhatsApp ordering...`
        );
        setTimeout(() => {
          setPaymentMethod("whatsapp");
          setCheckoutStep("form");
          setLoading(false);
        }, 4000);
      }
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping cart">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel: bottom sheet on mobile, side drawer on desktop */}
      <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto flex sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-md bg-bg-secondary text-text-primary shadow-2xl flex flex-col border-t sm:border-t-0 sm:border-l border-border-custom rounded-t-2xl sm:rounded-none max-h-[92dvh] sm:max-h-none">

          {/* Grab handle (mobile sheet cue) */}
          <div className="sm:hidden pt-2 pb-1 flex justify-center shrink-0">
            <div className="h-1.5 w-12 rounded-full bg-border-custom" />
          </div>

          {/* Header */}
          <div className="px-5 py-4 border-b border-border-custom flex items-center justify-between shrink-0">
            <h2 className="font-serif text-lg font-bold flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-gold" />
              <span>Your Basket</span>
            </h2>
            <button
              onClick={handleClose}
              className="tap-target p-2 rounded-full hover:bg-bg-tertiary transition-colors"
              aria-label="Close cart"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cart.length === 0 ? (
              <div className="h-full min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 bg-bg-tertiary rounded-full flex items-center justify-center text-text-tertiary stitch-border">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="font-serif text-base font-bold">Your basket is empty</p>
                  <p className="text-sm text-text-tertiary mt-1">
                    Browse the ready-to-wear shop and add pieces you love.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal px-6 py-3 rounded-md font-semibold text-sm hover:opacity-90 tap-target"
                >
                  Start Shopping
                </button>
              </div>
            ) : checkoutStep === "cart" ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-bg-primary rounded-xl border border-border-custom relative"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border border-border-custom bg-bg-secondary shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-tertiary border border-border-custom shrink-0">
                        <ShoppingBag size={22} />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="pr-7">
                        <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
                        <span className="text-xs text-text-tertiary capitalize">{item.category}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-brand-plum dark:text-brand-gold">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center border border-border-custom rounded-lg bg-bg-secondary overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="tap-target px-3 py-2 hover:bg-bg-tertiary transition-colors"
                            aria-label={`Reduce quantity of ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 text-sm font-bold min-w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="tap-target px-3 py-2 hover:bg-bg-tertiary transition-colors"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-text-tertiary hover:text-red-500 transition-colors tap-target p-2"
                      aria-label={`Remove ${item.name} from basket`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            ) : checkoutStep === "form" ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="font-serif text-base font-bold border-b border-border-custom pb-2 text-brand-plum dark:text-brand-gold">
                  Delivery & Contact Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cart-name" className="block text-sm font-semibold mb-1.5 text-text-secondary">
                      Full Name *
                    </label>
                    <input
                      id="cart-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Grace Wambui"
                      className="w-full bg-bg-primary border border-border-custom px-4 py-3 rounded-lg text-base focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="cart-phone" className="block text-sm font-semibold mb-1.5 text-text-secondary">
                      M-Pesa Phone Number *
                    </label>
                    <input
                      id="cart-phone"
                      type="tel"
                      required
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0706 232 927"
                      className="w-full bg-bg-primary border border-border-custom px-4 py-3 rounded-lg text-base focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="cart-address" className="block text-sm font-semibold mb-1.5 text-text-secondary">
                      Delivery Address / Town *
                    </label>
                    <textarea
                      id="cart-address"
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Ruiru, Sunrise Estate, House A12"
                      className="w-full bg-bg-primary border border-border-custom px-4 py-3 rounded-lg text-base focus:outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  {/* Payment method picker — big friendly cards */}
                  <div>
                    <span className="block text-sm font-semibold mb-2 text-text-secondary">
                      How would you like to pay?
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("whatsapp")}
                        className={`tap-target p-3 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === "whatsapp"
                            ? "border-[#25D366] bg-[#25D366]/10"
                            : "border-border-custom bg-bg-primary"
                        }`}
                      >
                        <MessageCircle size={20} className="text-[#25D366] mb-1" />
                        <span className="block text-sm font-bold">WhatsApp Order</span>
                        <span className="block text-[11px] text-text-tertiary mt-0.5">
                          Confirm & pay on delivery
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("stk")}
                        className={`tap-target p-3 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === "stk"
                            ? "border-brand-gold bg-brand-gold/10"
                            : "border-border-custom bg-bg-primary"
                        }`}
                      >
                        <CreditCard size={20} className="text-brand-gold mb-1" />
                        <span className="block text-sm font-bold">M-Pesa Now</span>
                        <span className="block text-[11px] text-text-tertiary mt-0.5">
                          Instant STK push prompt
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="h-full min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
                <div className="h-12 w-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="font-serif text-sm font-semibold">{paymentStatus}</p>
              </div>
            )}
          </div>

          {/* Footer totals & CTAs */}
          {cart.length > 0 && checkoutStep !== "paying" && (
            <div className="border-t border-border-custom bg-bg-primary p-5 space-y-4 shrink-0 pb-safe">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle size={13} /> FREE
                      </span>
                    ) : (
                      `KES ${deliveryFee}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-text-tertiary">
                    Free delivery on orders above KES 5,000
                  </p>
                )}
                <div className="stitch-divider my-2"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-plum dark:text-brand-gold">
                    KES {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {checkoutStep === "cart" && (
                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full tap-target bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal py-4 rounded-xl font-bold text-sm tracking-wider uppercase hover:opacity-95 transition-opacity"
                >
                  Checkout — KES {grandTotal.toLocaleString()}
                </button>
              )}

              {checkoutStep === "form" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    disabled={loading}
                    className="tap-target px-5 bg-bg-tertiary text-text-primary py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={loading}
                    className={`flex-1 tap-target py-4 rounded-xl font-bold text-sm tracking-wide transition-opacity flex items-center justify-center gap-2 ${
                      paymentMethod === "whatsapp"
                        ? "bg-[#25D366] text-white"
                        : "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                    }`}
                  >
                    {loading ? (
                      <span className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></span>
                    ) : paymentMethod === "whatsapp" ? (
                      <>
                        <MessageCircle size={18} />
                        <span>Send Order on WhatsApp</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay KES {grandTotal.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
