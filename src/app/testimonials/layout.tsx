import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "What brides, professionals, choirs and academy graduates say about Victory Fashion Design in Ruiru, Kenya.",
  keywords: [
    "Victory Fashion Design reviews",
    "tailor reviews Ruiru",
    "bridal tailor reviews Kenya",
  ],
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Client Testimonials — Victory Fashion Design",
    description:
      "What brides, professionals, choirs and academy graduates say about our work.",
    url: "/testimonials",
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
