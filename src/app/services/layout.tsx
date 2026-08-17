import type { Metadata } from "next";

/**
 * Default metadata for /services. The [slug] detail pages override this with
 * their own per-service titles and descriptions.
 */
export const metadata: Metadata = {
  title: "Tailoring Services",
  description:
    "Custom dressmaking, bridal and occasion wear, men's wear, choir robes, corporate uniforms, repairs and alterations — tailored to measure in Ruiru, Kenya.",
  keywords: [
    "custom dressmaking Ruiru",
    "bridal tailor Kenya",
    "corporate uniforms Nairobi",
    "choir robes Kenya",
    "clothing alterations Ruiru",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Tailoring Services — Victory Fashion Design",
    description:
      "Bespoke dressmaking, bridal wear, men's wear, choir robes, uniforms, repairs and alterations in Ruiru, Kenya.",
    url: "/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
