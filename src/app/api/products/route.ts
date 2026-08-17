import { NextResponse } from "next/server";
import { dbQuery, isDbConfigured, normaliseProduct } from "@/lib/db";

/**
 * Public product catalogue.
 *
 * The shop page used to query Supabase straight from the browser with the anon
 * key. Postgres has no equivalent browser-safe client, so the catalogue is
 * served from here instead and the connection string stays server-side.
 *
 * Cached for 60s: new products show up within a minute without hammering the
 * database on every page view.
 */
export const revalidate = 60;

export async function GET() {
  if (!isDbConfigured()) {
    // No database wired up yet — let the client fall back to its sample data.
    return NextResponse.json({ products: [] });
  }

  try {
    const rows = await dbQuery(
      `SELECT id,
              name,
              category,
              price,
              description,
              image_url,
              badge,
              stock_quantity
         FROM products
        WHERE is_active = true
        ORDER BY created_at DESC`
    );

    return NextResponse.json(
      { products: rows.map(normaliseProduct) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { products: [], error: "Failed to load products" },
      { status: 500 }
    );
  }
}
