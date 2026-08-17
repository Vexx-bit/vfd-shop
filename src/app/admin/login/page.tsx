"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Monogram } from "@/components/BrandMark";

/**
 * Admin sign-in.
 *
 * The PIN is verified by /api/admin/login. Nothing in this component knows the
 * expected value, so reading the bundle tells an attacker nothing.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || pin.trim().length === 0) return;

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error ?? "Sign in failed. Please try again.");
        setPin("");
        setBusy(false);
        return;
      }

      // The dashboard still sends this header with its own requests. The
      // httpOnly cookie set by the server is what actually authorises them.
      try {
        sessionStorage.setItem("vfd_admin_pin", pin);
      } catch {
        // Private browsing can block sessionStorage; the cookie still works.
      }

      router.replace("/admin");
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-secondary px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Monogram className="h-16 w-auto text-brand-plum" />
          <h1 className="mt-5 text-2xl font-semibold text-text-primary">
            Studio Dashboard
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your admin PIN to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-primary border border-custom rounded-2xl p-6 shadow-soft"
        >
          <label
            htmlFor="admin-pin"
            className="block text-xs font-medium uppercase tracking-wider text-text-tertiary mb-2"
          >
            Admin PIN
          </label>
          <input
            id="admin-pin"
            name="pin"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-custom bg-bg-secondary px-4 py-3 text-text-primary outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
          />

          {error ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || pin.trim().length === 0}
            className="tap-target mt-5 w-full rounded-xl bg-brand-plum px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          Sessions last 8 hours. Staff only.
        </p>
      </div>
    </main>
  );
}
