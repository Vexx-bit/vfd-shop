import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, CartProvider } from "./providers";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vfd-shop.vercel.app"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title: {
    default: "Victory Fashion Design — Bespoke Tailoring & Academy in Ruiru",
    template: "%s | Victory Fashion Design",
  },
  description: "Victory Fashion Design (Ruiru, Kenya) offers custom dressmaking, bridal wear, corporate uniforms, repairs, and our flagship Fashion Training Academy.",
  keywords: ["tailor Ruiru", "fashion academy Ruiru", "bespoke dressmaker Kenya", "bridal tailor Nairobi", "fashion school Ruiru", "clothing repairs Ruiru"],
  applicationName: "Victory Fashion Design",
  authors: [{ name: "Victory Fashion Design" }],
  creator: "Victory Fashion Design",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Victory Fashion Design — Bespoke Tailoring & Academy",
    description: "Premium bespoke custom dressmaking, bridal wear, corporate uniforms, and professional fashion courses in Ruiru, Kiambu County, Kenya.",
    url: SITE_URL,
    siteName: "Victory Fashion Design",
    images: [
      {
        url: "/assets/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Victory Fashion Design Studio",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victory Fashion Design — Bespoke Tailoring & Academy",
    description: "Premium bespoke custom dressmaking, bridal wear, and fashion training school in Ruiru.",
    images: ["/assets/images/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    types: {
      // Backed by src/app/feed.xml/route.ts.
      "application/rss+xml": [
        { url: "/feed.xml", title: "Victory Fashion Design Journal Feed" },
      ],
    },
  },
  category: "Fashion",
};

/**
 * Structured data.
 *
 * Two entities, because the business genuinely is two things: a tailoring shop
 * and a training school. Splitting them lets Google surface the academy for
 * course searches without muddling the retail listing.
 *
 * Note: no aggregateRating. The "4.9/5" on the site isn't tied to verifiable
 * reviews, and self-declared review markup is exactly what Google issues manual
 * actions for. Once the Google Business Profile has real reviews, they show up
 * in search on their own.
 */
const businessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ClothingStore", "LocalBusiness"],
      "@id": `${SITE_URL}/#business`,
      name: "Victory Fashion Design",
      alternateName: "Victory Fashion Designers",
      description:
        "Bespoke tailoring house in Ruiru, Kenya. Custom dressmaking, bridal and occasion wear, men's wear, choir robes, corporate uniforms, repairs and alterations.",
      slogan: "Where smartness matters",
      url: SITE_URL,
      image: `${SITE_URL}/assets/images/og-home.jpg`,
      logo: `${SITE_URL}/icon.svg`,
      telephone: "+254706232927",
      email: "info@victoryfashion.co.ke",
      foundingDate: "2008",
      priceRange: "KES",
      currenciesAccepted: "KES",
      paymentAccepted: "M-Pesa, Cash",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2nd Sunrise Avenue",
        addressLocality: "Ruiru",
        addressRegion: "Kiambu County",
        addressCountry: "KE",
      },
      areaServed: [
        { "@type": "City", name: "Ruiru" },
        { "@type": "City", name: "Nairobi" },
        { "@type": "AdministrativeArea", name: "Kiambu County" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      founder: {
        "@type": "Person",
        name: "Antonina Harrison",
        jobTitle: "Master Tailor & Managing Director",
      },
      sameAs: ["https://wa.me/254706232927"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tailoring Services",
        itemListElement: [
          "Custom Dressmaking",
          "Bridal & Occasion Wear",
          "Men's Wear",
          "Choir Robes & Group Orders",
          "Corporate Uniforms",
          "Repairs & Alterations",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#academy`,
      name: "Victory Fashion Academy",
      description:
        "Professional fashion design and tailoring courses in Ruiru, Kenya, covering pattern drafting, garment construction and business skills.",
      url: `${SITE_URL}/academy`,
      telephone: "+254706232927",
      parentOrganization: { "@id": `${SITE_URL}/#business` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "2nd Sunrise Avenue",
        addressLocality: "Ruiru",
        addressRegion: "Kiambu County",
        addressCountry: "KE",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Victory Fashion Design",
      inLanguage: "en-KE",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-KE"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
