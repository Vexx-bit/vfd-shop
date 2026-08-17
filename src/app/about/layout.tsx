import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Meet Antonina Harrison, Master Tailor and founder of Victory Fashion Design. Crafting bespoke garments in Ruiru, Kiambu County since 2008.",
  keywords: [
    "Antonina Harrison tailor",
    "Victory Fashion Design Ruiru",
    "master tailor Kenya",
    "tailoring studio Kiambu",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story — Victory Fashion Design",
    description:
      "Master Tailor Antonina Harrison has been crafting bespoke garments in Ruiru since 2008.",
    url: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
