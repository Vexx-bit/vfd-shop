import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Visit Us",
  description:
    "Visit Victory Fashion Design at 2nd Sunrise Avenue, Ruiru, Kiambu County. Open Monday to Saturday, 8AM to 6PM. Call or WhatsApp +254 706 232 927.",
  keywords: [
    "tailor near me Ruiru",
    "Victory Fashion Design contact",
    "tailoring shop Kiambu",
    "fitting appointment Ruiru",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Visit Us — Victory Fashion Design",
    description:
      "2nd Sunrise Avenue, Ruiru, Kiambu County. Mon–Sat 8AM–6PM. Call or WhatsApp +254 706 232 927.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
