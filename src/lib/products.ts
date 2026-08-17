import { dbQueryOne, isDbConfigured, normaliseProduct } from "@/lib/db";

/** The subset of a product needed to render and share a single item. */
export type ShareableProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Products seeded from the database have UUID ids. The shop's offline fallback
 * list uses "f1".."f6", which are not shareable because they do not exist
 * server-side — checking the shape first avoids a pointless database round trip.
 */
export function looksLikeProductId(id: string): boolean {
  return UUID_RE.test(id);
}

export async function loadProductById(
  id: string
): Promise<ShareableProduct | null> {
  if (!looksLikeProductId(id) || !isDbConfigured()) return null;

  try {
    const row = await dbQueryOne(
      `SELECT id, name, category, price, description, image_url
         FROM products
        WHERE id = $1 AND is_active = true
        LIMIT 1`,
      [id]
    );
    if (!row) return null;

    const product = normaliseProduct(row) as Record<string, unknown>;

    return {
      id: String(product.id ?? id),
      name: String(product.name ?? "Victory Fashion piece"),
      category: String(product.category ?? "dresses"),
      price: Number(product.price ?? 0),
      description:
        typeof product.description === "string" ? product.description : null,
      image_url:
        typeof product.image_url === "string" ? product.image_url : null,
    };
  } catch (error) {
    console.error("Product lookup failed:", error);
    return null;
  }
}
