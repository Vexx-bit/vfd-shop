import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio & Lookbook",
  description:
    "Browse real garments made at Victory Fashion Design: bridal gowns, bespoke suits, Ankara pieces, choir robes and corporate uniforms tailored in Ruiru, Kenya.",
  keywords: [
    "tailoring portfolio Kenya",
    "bridal gowns Ruiru",
    "bespoke suits Nairobi",
    "fashion lookbook Kenya",
  ],
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio & Lookbook — Victory Fashion Design",
    description:
      "Real garments from our Ruiru atelier: bridal, bespoke suits, Ankara, choir robes and uniforms.",
    url: "/portfolio",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
