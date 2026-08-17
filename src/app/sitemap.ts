import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vfd-shop.vercel.app"
).replace(/\/+$/, "");

/**
 * Public routes only. /admin and /api are excluded here and disallowed in
 * robots.ts.
 *
 * Priorities are weighted towards the pages that actually earn business:
 * the shop and the six service pages people search for by name in Ruiru.
 */
const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/academy", changeFrequency: "weekly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },

  // Service detail pages — these carry the long-tail local search terms.
  { path: "/services/custom-dressmaking", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/bridal-and-occasion-wear", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/mens-wear", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/choir-robes-and-group-orders", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/corporate-uniforms", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/repairs-and-alterations", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
