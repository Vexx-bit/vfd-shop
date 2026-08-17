import type { Metadata } from "next";

/**
 * shop/page.tsx is a client component and cannot export metadata itself, so
 * the route's SEO lives here.
 */
export const metadata: Metadata = {
  title: "Shop Ready-To-Wear",
  description:
    "Shop handcrafted ready-to-wear dresses, Ankara pieces, co-ord sets and skirts from Victory Fashion Design in Ruiru. Order on WhatsApp or pay with M-Pesa.",
  keywords: [
    "ready to wear Kenya",
    "Ankara dresses Ruiru",
    "buy dresses online Kenya",
    "M-Pesa fashion store",
  ],
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Ready-To-Wear — Victory Fashion Design",
    description:
      "Handcrafted dresses, co-ord sets and skirts, ready to wear. Order on WhatsApp or pay with M-Pesa.",
    url: "/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
