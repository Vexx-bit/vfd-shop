"use client";

import React, { useState, useEffect } from "react";
import { Monogram } from "@/components/BrandMark";
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Users,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
} from "lucide-react";

/* ==========================================
   VICTORY ADMIN — rebuilt for a non-technical
   owner (Antonina). Design rules applied:
   - Big text (base 16px+), huge tap targets
   - Plain-English labels, zero jargon
   - One obvious primary action per screen
   - Cards instead of tables on mobile
   - Everything colour-coded & forgiving
   ========================================== */

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  badge?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  order_items: OrderItem[];
}

interface Enrollment {
  id: string;
  full_name: string;
  phone: string;
  county: string;
  intake_month: string;
  study_mode: string;
  id_number: string;
  education_level: string;
  emergency_phone: string;
  emergency_name: string;
  has_experience: string;
  additional_info?: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

type Tab = "dashboard" | "orders" | "products" | "enrollments" | "messages";

const defaultImages = [
  {
    label: "Ankara Gown",
    url: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Bridal Fitting",
    url: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Suit Fabric",
    url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Print Blazer",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  },
];

/* Small reusable bits -------------------------------------- */

function StatusChip({ kind, value }: { kind: "pay" | "order" | "form"; value: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border-green-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border-green-300",
    new: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-300",
    read: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-300",
    replied: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border-green-300",
  };
  const labels: Record<string, string> = {
    paid: "✅ PAID",
    pending: kind === "pay" ? "⏳ NOT PAID YET" : "⏳ WAITING",
    failed: "❌ PAYMENT FAILED",
    completed: "✅ DONE",
    cancelled: "❌ CANCELLED",
    approved: "✅ APPROVED",
    new: "🔵 NEW",
    read: "👀 READ",
    replied: "✅ REPLIED",
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
        styles[value] || styles.pending
      }`}
    >
      {labels[value] || value}
    </span>
  );
}

function BigButton({
  onClick,
  color,
  icon: Icon,
  children,
  disabled,
  type = "button",
}: {
  onClick: () => void;
  color: "green" | "red" | "gold" | "plain";
  icon?: any;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const colors = {
    green: "bg-green-600 text-white hover:bg-green-700",
    red: "bg-red-600 text-white hover:bg-red-700",
    gold: "bg-brand-gold text-brand-charcoal hover:bg-brand-gold/90",
    plain: "bg-bg-tertiary text-text-primary hover:opacity-90 border border-border-custom",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`tap-target w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${colors[color]}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

/* Main component ------------------------------------------- */

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorBanner, setErrorBanner] = useState("");
  const [successNote, setSuccessNote] = useState("");

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("dresses");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState(defaultImages[0].url);
  const [prodBadge, setProdBadge] = useState("");
  const [prodStock, setProdStock] = useState("10");
  const [prodActive, setProdActive] = useState(true);

  useEffect(() => {
    const cachedPin = sessionStorage.getItem("vfd_admin_pin");
    if (cachedPin === "1975") {
      setIsAuthenticated(true);
      fetchDashboardData(cachedPin);
    }
  }, []);

  const showSuccess = (note: string) => {
    setSuccessNote(note);
    setTimeout(() => setSuccessNote(""), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1975") {
      setIsAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem("vfd_admin_pin", "1975");
      fetchDashboardData("1975");
    } else {
      setAuthError("Wrong PIN. Please try again.");
      setPin("");
    }
  };

  const fetchDashboardData = async (authPin: string) => {
    setLoading(true);
    setErrorBanner("");
    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": authPin },
        body: JSON.stringify({ action: "fetch_all" }),
      });
      const result = await res.json();
      if (res.ok) {
        setProducts(result.products || []);
        setOrders(result.orders || []);
        setEnrollments(result.enrollments || []);
        setMessages(result.messages || []);
      } else {
        throw new Error(result.error || "Failed to load.");
      }
    } catch (err: any) {
      setErrorBanner(err.message || "Could not connect to the database.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vfd_admin_pin");
    setIsAuthenticated(false);
    setPin("");
  };

  const adminPost = async (body: any) => {
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";
    const res = await fetch("/api/admin/db", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": authPin },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Action failed.");
    return result;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) {
      alert("Please fill in the name, price and stock number.");
      return;
    }
    setLoading(true);
    try {
      await adminPost({
        action: editingProduct ? "update" : "create",
        table: "products",
        id: editingProduct?.id,
        data: {
          name: prodName,
          category: prodCategory,
          price: parseFloat(prodPrice),
          description: prodDesc,
          image_url: prodImageUrl || defaultImages[0].url,
          badge: prodBadge || null,
          stock_quantity: parseInt(prodStock),
          is_active: prodActive,
        },
      });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      showSuccess(editingProduct ? "✅ Item updated!" : "✅ New item added to the shop!");
      fetchDashboardData(sessionStorage.getItem("vfd_admin_pin") || "");
    } catch (err: any) {
      alert(`Could not save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCategory("dresses");
    setProdPrice("");
    setProdDesc("");
    setProdImageUrl(defaultImages[0].url);
    setProdBadge("");
    setProdStock("10");
    setProdActive(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdDesc(product.description || "");
    setProdImageUrl(product.image_url);
    setProdBadge(product.badge || "");
    setProdStock(product.stock_quantity.toString());
    setProdActive(product.is_active);
    setIsProductModalOpen(true);
  };

  const handleSeedProducts = async () => {
    setLoading(true);
    try {
      await adminPost({ action: "seed" });
      showSuccess("🎉 Sample items added!");
      fetchDashboardData(sessionStorage.getItem("vfd_admin_pin") || "");
    } catch (err: any) {
      alert(`Could not add samples: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (prodId: string, prodNameToDelete: string) => {
    if (!confirm(`Remove "${prodNameToDelete}" from the shop? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await adminPost({ action: "delete", table: "products", id: prodId });
      showSuccess("🗑️ Item removed.");
      fetchDashboardData(sessionStorage.getItem("vfd_admin_pin") || "");
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const quickUpdate = async (table: string, id: string, data: any, note: string) => {
    setLoading(true);
    try {
      await adminPost({ action: "update", table, id, data });
      showSuccess(note);
      fetchDashboardData(sessionStorage.getItem("vfd_admin_pin") || "");
    } catch (err: any) {
      alert(`Could not update: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ===== LOGIN SCREEN ===== */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center px-4 py-10">
        <div className="max-w-md w-full bg-bg-secondary p-8 rounded-3xl border border-border-custom shadow-lift text-center space-y-6">
          <div className="flex justify-center">
            <Monogram
              className="h-20 w-24 text-brand-plum dark:text-brand-gold"
              title="Victory Fashion Designers"
            />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold">
              Shop Manager
            </h1>
            <p className="text-base text-text-secondary mt-2">
              Type your 4-number PIN to open.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              required
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • •"
              aria-label="Admin PIN"
              className="w-full text-center text-4xl tracking-[0.5em] bg-bg-primary border-2 border-border-custom px-4 py-5 rounded-2xl focus:outline-none focus:border-brand-gold font-mono"
            />
            {authError && (
              <p className="text-base text-red-500 font-bold">{authError}</p>
            )}
            <button
              type="submit"
              className="tap-target w-full bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream py-5 rounded-2xl font-bold text-lg shadow-soft"
            >
              Open Shop Manager
            </button>
          </form>
          <p className="text-xs text-text-tertiary italic">where smartness matters</p>
        </div>
      </div>
    );
  }

  /* ===== STATS ===== */
  const totalSales = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const unpaidOrders = orders.filter((o) => o.payment_status !== "paid" && o.status !== "cancelled").length;
  const pendingEnrollmentsCount = enrollments.filter((e) => e.status === "pending").length;
  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  const tabs: { id: Tab; label: string; icon: any; alert?: number }[] = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ListOrdered, alert: unpaidOrders },
    { id: "products", label: "Shop Items", icon: ShoppingBag },
    { id: "enrollments", label: "Students", icon: Users, alert: pendingEnrollmentsCount },
    { id: "messages", label: "Messages", icon: MessageSquare, alert: newMessagesCount },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur-md border-b border-border-custom shadow-soft">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Monogram className="h-8 w-9 text-brand-plum dark:text-brand-gold shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                Victory Fashion
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-brand-plum dark:text-brand-gold leading-tight">
                Shop Manager
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchDashboardData(sessionStorage.getItem("vfd_admin_pin") || "")}
              disabled={loading}
              className="tap-target bg-bg-primary border border-border-custom text-text-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="tap-target bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab bar: horizontally scrollable big pills — works on phone */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setSearchTerm("");
                }}
                className={`tap-target relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
                  activeTab === t.id
                    ? "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                    : "bg-bg-primary border border-border-custom text-text-secondary"
                }`}
              >
                <t.icon size={18} />
                <span>{t.label}</span>
                {t.alert ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center">
                    {t.alert}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Banners */}
      {successNote && (
        <div className="max-w-5xl mx-auto px-4 mt-4 w-full">
          <div className="bg-green-50 border-2 border-green-300 text-green-800 p-4 rounded-2xl text-base font-bold text-center">
            {successNote}
          </div>
        </div>
      )}
      {errorBanner && (
        <div className="max-w-5xl mx-auto px-4 mt-4 w-full">
          <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-base">
            <AlertCircle size={22} className="shrink-0" />
            <span>{errorBanner}</span>
          </div>
        </div>
      )}

      {/* ===== Main ===== */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full pb-24">

        {/* ---- DASHBOARD ---- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-text-primary">
              How is business today?
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-brand-plum text-brand-cream p-5 rounded-2xl shadow-soft col-span-2 sm:col-span-1">
                <span className="text-sm font-semibold text-brand-cream/80">Money Collected</span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-gold mt-1">
                  KES {totalSales.toLocaleString()}
                </div>
                <span className="text-xs text-brand-cream/70">From paid orders</span>
              </div>

              <button
                onClick={() => setActiveTab("orders")}
                className="bg-bg-secondary p-5 rounded-2xl border-2 border-border-custom text-left hover:border-brand-gold transition-colors"
              >
                <span className="text-sm font-semibold text-text-secondary">Orders Waiting</span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-plum dark:text-brand-gold mt-1">
                  {unpaidOrders}
                </div>
                <span className="text-xs text-text-tertiary">Tap to view →</span>
              </button>

              <button
                onClick={() => setActiveTab("enrollments")}
                className="bg-bg-secondary p-5 rounded-2xl border-2 border-border-custom text-left hover:border-brand-gold transition-colors"
              >
                <span className="text-sm font-semibold text-text-secondary">New Students</span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-plum dark:text-brand-gold mt-1">
                  {pendingEnrollmentsCount}
                </div>
                <span className="text-xs text-text-tertiary">Waiting approval →</span>
              </button>

              <button
                onClick={() => setActiveTab("messages")}
                className="bg-bg-secondary p-5 rounded-2xl border-2 border-border-custom text-left hover:border-brand-gold transition-colors"
              >
                <span className="text-sm font-semibold text-text-secondary">New Messages</span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-plum dark:text-brand-gold mt-1">
                  {newMessagesCount}
                </div>
                <span className="text-xs text-text-tertiary">Tap to read →</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className="bg-bg-secondary p-5 rounded-2xl border-2 border-border-custom text-left hover:border-brand-gold transition-colors"
              >
                <span className="text-sm font-semibold text-text-secondary">Items in Shop</span>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-plum dark:text-brand-gold mt-1">
                  {products.filter((p) => p.is_active).length}
                </div>
                <span className="text-xs text-text-tertiary">Tap to manage →</span>
              </button>
            </div>

            {/* Latest orders quick view */}
            <div className="bg-bg-secondary rounded-2xl border border-border-custom p-5 space-y-3">
              <h3 className="font-serif text-lg font-bold">Latest Orders</h3>
              {orders.length === 0 ? (
                <p className="text-text-tertiary text-sm py-4 text-center">
                  No orders yet. They will appear here when customers buy.
                </p>
              ) : (
                orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="flex justify-between items-center gap-3 p-4 rounded-xl bg-bg-primary border border-border-custom"
                  >
                    <div className="min-w-0">
                      <span className="font-mono font-bold text-brand-plum dark:text-brand-gold text-sm">
                        {ord.order_number}
                      </span>
                      <p className="text-sm text-text-secondary truncate">{ord.customer_name}</p>
                    </div>
                    <StatusChip kind="pay" value={ord.payment_status} />
                  </div>
                ))
              )}
              {orders.length > 3 && (
                <BigButton color="plain" onClick={() => setActiveTab("orders")} icon={ListOrdered}>
                  See All Orders
                </BigButton>
              )}
            </div>
          </div>
        )}

        {/* ---- ORDERS ---- */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <h2 className="font-serif text-2xl font-bold">Customer Orders</h2>
              <input
                type="search"
                placeholder="Search name or order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg-secondary border-2 border-border-custom px-4 py-3 rounded-xl text-base focus:outline-none focus:border-brand-gold w-full sm:w-72"
              />
            </div>

            {orders.filter(
              (o) =>
                o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 ? (
              <div className="py-16 text-center text-text-tertiary bg-bg-secondary rounded-2xl border border-dashed border-border-custom">
                <ListOrdered size={40} className="mx-auto mb-3 text-brand-gold" />
                <p className="text-base font-semibold">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter(
                    (o) =>
                      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((o) => (
                    <div
                      key={o.id}
                      className="bg-bg-secondary rounded-2xl border border-border-custom p-5 space-y-4 shadow-soft"
                    >
                      {/* Order head */}
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <span className="font-mono font-black text-lg text-brand-plum dark:text-brand-gold">
                            {o.order_number}
                          </span>
                          <p className="text-base font-bold text-text-primary mt-0.5">
                            {o.customer_name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <StatusChip kind="pay" value={o.payment_status} />
                          <StatusChip kind="order" value={o.status} />
                        </div>
                      </div>

                      {/* Items */}
                      {o.order_items && o.order_items.length > 0 && (
                        <div className="bg-bg-primary rounded-xl p-4 space-y-1.5 border border-border-custom">
                          {o.order_items.map((it) => (
                            <div key={it.id} className="flex justify-between text-sm">
                              <span className="text-text-primary">
                                {it.product_name} × {it.quantity}
                              </span>
                              <span className="font-semibold">
                                KES {(it.price * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Contact + address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <a
                          href={`tel:${o.customer_phone}`}
                          className="flex items-center gap-2 p-3 rounded-xl bg-bg-primary border border-border-custom font-bold text-brand-plum dark:text-brand-gold tap-target"
                        >
                          <Phone size={16} /> {o.customer_phone}
                        </a>
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-bg-primary border border-border-custom text-text-secondary">
                          📍 <span className="line-clamp-1">{o.delivery_address}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-border-custom pt-3">
                        <span className="text-sm text-text-secondary">Total</span>
                        <span className="text-2xl font-serif font-black text-brand-plum dark:text-brand-gold">
                          KES {o.total.toLocaleString()}
                        </span>
                      </div>

                      {/* Big action buttons — no dropdowns */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {o.payment_status !== "paid" && (
                          <BigButton
                            color="green"
                            icon={CheckCircle}
                            disabled={loading}
                            onClick={() =>
                              quickUpdate("orders", o.id, { payment_status: "paid" }, "✅ Marked as PAID!")
                            }
                          >
                            Mark as Paid
                          </BigButton>
                        )}
                        {o.status !== "completed" && o.status !== "cancelled" && (
                          <BigButton
                            color="gold"
                            icon={CheckCircle}
                            disabled={loading}
                            onClick={() =>
                              quickUpdate("orders", o.id, { status: "completed" }, "🎉 Order marked DONE!")
                            }
                          >
                            Mark as Done
                          </BigButton>
                        )}
                        {o.status !== "cancelled" && (
                          <BigButton
                            color="plain"
                            icon={XCircle}
                            disabled={loading}
                            onClick={() => {
                              if (confirm(`Cancel order ${o.order_number}?`))
                                quickUpdate("orders", o.id, { status: "cancelled" }, "Order cancelled.");
                            }}
                          >
                            Cancel
                          </BigButton>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ---- PRODUCTS ---- */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <h2 className="font-serif text-2xl font-bold">Shop Items</h2>
              <BigButton color="gold" icon={Plus} onClick={openAddProductModal}>
                Add New Item
              </BigButton>
            </div>

            <input
              type="search"
              placeholder="Search item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-secondary border-2 border-border-custom px-4 py-3 rounded-xl text-base focus:outline-none focus:border-brand-gold"
            />

            {products.length === 0 ? (
              <div className="py-14 border-2 border-dashed border-border-custom rounded-2xl text-center space-y-4 bg-bg-secondary px-6">
                <ShoppingBag size={44} className="text-brand-gold mx-auto" />
                <div className="space-y-1">
                  <p className="font-serif text-lg font-bold">The shop is empty</p>
                  <p className="text-sm text-text-secondary max-w-sm mx-auto">
                    Tap the gold button above to add your first item — or add 6 sample items to see how it looks.
                  </p>
                </div>
                <div className="max-w-xs mx-auto">
                  <BigButton color="plain" onClick={handleSeedProducts} disabled={loading} icon={Plus}>
                    {loading ? "Adding..." : "Add 6 Sample Items"}
                  </BigButton>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products
                  .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-bg-secondary rounded-2xl border border-border-custom overflow-hidden shadow-soft"
                    >
                      <div className="flex gap-4 p-4">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-24 w-24 rounded-xl object-cover border border-border-custom bg-bg-tertiary shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-base text-text-primary leading-snug">
                              {p.name}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-1 rounded-full font-extrabold uppercase shrink-0 ${
                                p.is_active
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                  : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {p.is_active ? "In Shop" : "Hidden"}
                            </span>
                          </div>
                          <span className="text-xs text-brand-gold font-bold uppercase tracking-wider capitalize block">
                            {p.category}
                          </span>
                          <div className="flex items-baseline gap-3">
                            <span className="font-serif font-black text-lg text-brand-plum dark:text-brand-gold">
                              KES {p.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-text-tertiary">
                              {p.stock_quantity} in stock
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 border-t border-border-custom">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="tap-target flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-brand-plum dark:text-brand-gold hover:bg-bg-tertiary transition-colors border-r border-border-custom"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id, p.name)}
                          className="tap-target flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ---- STUDENTS ---- */}
        {activeTab === "enrollments" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <h2 className="font-serif text-2xl font-bold">Academy Students</h2>
              <input
                type="search"
                placeholder="Search student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg-secondary border-2 border-border-custom px-4 py-3 rounded-xl text-base focus:outline-none focus:border-brand-gold w-full sm:w-72"
              />
            </div>

            {enrollments.filter((en) =>
              en.full_name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 ? (
              <div className="py-16 text-center text-text-tertiary bg-bg-secondary rounded-2xl border border-dashed border-border-custom">
                <Users size={40} className="mx-auto mb-3 text-brand-gold" />
                <p className="text-base font-semibold">No student applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments
                  .filter((en) => en.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((en) => (
                    <div
                      key={en.id}
                      className="bg-bg-secondary rounded-2xl border border-border-custom p-5 space-y-4 shadow-soft"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-lg text-text-primary">{en.full_name}</h4>
                          <p className="text-sm text-text-secondary capitalize">
                            {en.study_mode} · {en.intake_month} intake
                          </p>
                        </div>
                        <StatusChip kind="form" value={en.status} />
                      </div>

                      <a
                        href={`tel:${en.phone}`}
                        className="flex items-center gap-2 p-3 rounded-xl bg-bg-primary border border-border-custom font-bold text-brand-plum dark:text-brand-gold tap-target text-base"
                      >
                        <Phone size={18} /> {en.phone}
                      </a>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-secondary border-t border-b border-border-custom py-3">
                        <div><strong>County:</strong> {en.county}</div>
                        <div><strong>ID No:</strong> {en.id_number}</div>
                        <div><strong>Education:</strong> {en.education_level}</div>
                        <div className="capitalize"><strong>Sewing before:</strong> {en.has_experience}</div>
                        <div className="col-span-2">
                          <strong>Emergency:</strong> {en.emergency_name} ({en.emergency_phone})
                        </div>
                      </div>

                      {en.additional_info && (
                        <p className="text-sm text-text-tertiary italic">
                          "{en.additional_info}"
                        </p>
                      )}

                      {en.status === "pending" && (
                        <BigButton
                          color="green"
                          icon={CheckCircle}
                          disabled={loading}
                          onClick={() =>
                            quickUpdate("enrollments", en.id, { status: "approved" }, `🎉 ${en.full_name} approved!`)
                          }
                        >
                          Approve Student
                        </BigButton>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ---- MESSAGES ---- */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <h2 className="font-serif text-2xl font-bold">Website Messages</h2>
              <input
                type="search"
                placeholder="Search sender name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg-secondary border-2 border-border-custom px-4 py-3 rounded-xl text-base focus:outline-none focus:border-brand-gold w-full sm:w-72"
              />
            </div>

            {messages.filter((m) =>
              m.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 ? (
              <div className="py-16 text-center text-text-tertiary bg-bg-secondary rounded-2xl border border-dashed border-border-custom">
                <MessageSquare size={40} className="mx-auto mb-3 text-brand-gold" />
                <p className="text-base font-semibold">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages
                  .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m) => (
                    <div
                      key={m.id}
                      className="bg-bg-secondary rounded-2xl border border-border-custom p-5 space-y-3 shadow-soft"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-lg text-text-primary">{m.name}</h4>
                          <a
                            href={`tel:${m.phone}`}
                            className="text-sm font-bold text-brand-plum dark:text-brand-gold"
                          >
                            {m.phone}
                          </a>
                        </div>
                        <StatusChip kind="form" value={m.status} />
                      </div>

                      <div className="p-4 bg-bg-primary rounded-xl border border-border-custom text-base text-text-secondary leading-relaxed">
                        <strong className="block text-xs text-brand-gold uppercase tracking-wider mb-1.5">
                          {m.subject || "General Inquiry"}
                        </strong>
                        "{m.message}"
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {m.status === "new" && (
                          <BigButton
                            color="plain"
                            icon={Clock}
                            disabled={loading}
                            onClick={() =>
                              quickUpdate("contact_messages", m.id, { status: "read" }, "👀 Marked as read.")
                            }
                          >
                            Mark Read
                          </BigButton>
                        )}
                        {m.status !== "replied" && (
                          <BigButton
                            color="green"
                            icon={CheckCircle}
                            disabled={loading}
                            onClick={() =>
                              quickUpdate("contact_messages", m.id, { status: "replied" }, "✅ Marked as replied!")
                            }
                          >
                            Mark Replied
                          </BigButton>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== PRODUCT FORM (bottom sheet on mobile) ===== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
          <div className="relative bg-bg-secondary text-text-primary w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl border border-border-custom max-h-[92dvh] overflow-y-auto">
            <div className="sticky top-0 bg-bg-secondary border-b border-border-custom px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h3 className="font-serif text-xl font-bold text-brand-plum dark:text-brand-gold">
                {editingProduct ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="tap-target p-2 rounded-full hover:bg-bg-tertiary"
                aria-label="Close form"
              >
                <XCircle size={26} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="p-name" className="block text-base font-bold mb-2">
                  What is the item called? *
                </label>
                <input
                  id="p-name"
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Ankara Mermaid Dress"
                  className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-base focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="p-cat" className="block text-base font-bold mb-2">
                    Type *
                  </label>
                  <select
                    id="p-cat"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-base focus:outline-none"
                  >
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="two-pieces">Co-ord Sets</option>
                    <option value="skirts">Skirts</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="p-price" className="block text-base font-bold mb-2">
                    Price (KES) *
                  </label>
                  <input
                    id="p-price"
                    type="number"
                    inputMode="numeric"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-base focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="p-desc" className="block text-base font-bold mb-2">
                  Short description
                </label>
                <textarea
                  id="p-desc"
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="e.g. Beautiful Ankara print, fits sizes 10-14"
                  className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-base focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div>
                <span className="block text-base font-bold mb-2">Photo of the item</span>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {defaultImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProdImageUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all h-20 ${
                        prodImageUrl === img.url
                          ? "border-brand-gold ring-2 ring-brand-gold"
                          : "border-border-custom"
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] font-bold py-1 text-center">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="Or paste a photo link here..."
                  aria-label="Custom image URL"
                  className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-brand-gold"
                />
                {prodImageUrl && (
                  <img
                    src={prodImageUrl}
                    alt="Preview"
                    className="mt-3 h-32 w-full object-cover rounded-xl border border-border-custom"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="p-stock" className="block text-base font-bold mb-2">
                    How many in stock? *
                  </label>
                  <input
                    id="p-stock"
                    type="number"
                    inputMode="numeric"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-base focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label htmlFor="p-badge" className="block text-base font-bold mb-2">
                    Label (optional)
                  </label>
                  <select
                    id="p-badge"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    className="w-full bg-bg-primary border-2 border-border-custom px-4 py-3.5 rounded-xl text-base focus:outline-none"
                  >
                    <option value="">No label</option>
                    <option value="New">New</option>
                    <option value="Popular">Popular</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProdActive(!prodActive)}
                className={`w-full tap-target flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  prodActive
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-border-custom bg-bg-primary"
                }`}
              >
                <span className="text-base font-bold">
                  {prodActive ? "✅ Showing in shop" : "🚫 Hidden from shop"}
                </span>
                <span
                  className={`h-7 w-12 rounded-full p-1 transition-colors ${
                    prodActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                      prodActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>

              <div className="pt-2 pb-safe">
                <BigButton color="gold" type="submit" onClick={() => {}} disabled={loading}>
                  {loading ? "Saving..." : editingProduct ? "Save Changes" : "Add to Shop"}
                </BigButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
