import { NextResponse } from "next/server";
import {
  dbQuery,
  dbQueryOne,
  isDbConfigured,
  normaliseOrder,
  normaliseProduct,
} from "@/lib/db";

/**
 * Admin data API — backed by Neon Postgres.
 *
 * SECURITY NOTE: this endpoint is guarded by a single shared PIN sent in the
 * `x-admin-pin` header. That is weak protection: it is short, shared between
 * everyone who has it, and cannot be revoked for one person. Set ADMIN_PIN in
 * the environment so the real value is not committed to git, and plan to move
 * to proper per-user auth before this handles anything sensitive.
 */

const FALLBACK_PIN = "1975";

function pinIsValid(supplied: string | null): boolean {
  const expected = process.env.ADMIN_PIN || FALLBACK_PIN;
  if (!supplied || supplied.length !== expected.length) return false;

  // Constant-time comparison so response timing cannot be used to guess the PIN.
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Columns the dashboard is allowed to write, per table. Anything else in the
 * request body is silently ignored, so a crafted request cannot flip fields
 * like `total` or `order_number`.
 */
const WRITABLE_COLUMNS: Record<string, string[]> = {
  products: [
    "name",
    "category",
    "price",
    "description",
    "image_url",
    "badge",
    "stock_quantity",
    "is_active",
  ],
  orders: [
    "status",
    "payment_status",
    "notes",
    "customer_name",
    "customer_phone",
    "customer_email",
    "delivery_address",
  ],
  enrollments: ["status", "additional_info"],
  contact_messages: ["status"],
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function pickWritable(table: string, data: unknown): Array<[string, unknown]> {
  const allowed = WRITABLE_COLUMNS[table] ?? [];
  if (!data || typeof data !== "object") return [];
  return Object.entries(data as Record<string, unknown>).filter(([key]) =>
    allowed.includes(key)
  );
}

export async function POST(request: Request) {
  try {
    if (!pinIsValid(request.headers.get("x-admin-pin"))) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid Admin PIN." },
        { status: 401 }
      );
    }

    if (!isDbConfigured()) {
      return NextResponse.json(
        {
          error:
            "Database is not configured. Set DATABASE_URL to your Neon connection string.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { action, table, data, id } = body ?? {};

    /* ---------------------------------------------------------------- read */

    if (action === "fetch_all") {
      const [products, orders, enrollments, messages] = await Promise.all([
        dbQuery(`SELECT * FROM products ORDER BY created_at DESC`),
        // Reproduces Supabase's "orders, order_items(*)" nesting in plain SQL.
        dbQuery(
          `SELECT o.*,
                  COALESCE((
                    SELECT json_agg(to_jsonb(oi) ORDER BY oi.product_name)
                      FROM order_items oi
                     WHERE oi.order_id = o.id
                  ), '[]'::json) AS order_items
             FROM orders o
            ORDER BY o.created_at DESC`
        ),
        dbQuery(`SELECT * FROM enrollments ORDER BY created_at DESC`),
        dbQuery(`SELECT * FROM contact_messages ORDER BY created_at DESC`),
      ]);

      return NextResponse.json({
        products: products.map(normaliseProduct),
        orders: orders.map(normaliseOrder),
        enrollments,
        messages,
      });
    }

    /* ---------------------------------------------------------------- seed */

    if (action === "seed") {
      const { force } = body;

      if (force) {
        await dbQuery(`DELETE FROM products`);
      } else {
        const existing = await dbQueryOne(`SELECT id FROM products LIMIT 1`);
        if (existing) {
          return NextResponse.json({
            success: false,
            message: "Database is already seeded with products.",
          });
        }
      }

      const seedData: Array<Record<string, unknown>> = [
        {
          name: "Floral Crepe Maxi Dress",
          price: 2800,
          category: "dresses",
          description:
            "Stunning floral print maxi dress featuring lightweight breathable crepe and a relaxed silhouette.",
          image_url:
            "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
          badge: "New",
          stock_quantity: 15,
          is_active: true,
        },
        {
          name: "Vibrant Ankara Flare Dress",
          price: 3200,
          category: "dresses",
          description:
            "Custom flared Ankara wax fabric gown with gold pleated border accents.",
          image_url:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
          badge: "Popular",
          stock_quantity: 10,
          is_active: true,
        },
        {
          name: "Bespoke Charcoal Double-Breasted Suit",
          price: 7500,
          category: "two-pieces",
          description:
            "Premium tailored men's corporate suit with a structured shoulder profile and custom gold thread borders.",
          image_url:
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
          badge: "New",
          stock_quantity: 5,
          is_active: true,
        },
        {
          name: "Elegant Satin Sweetheart Bridal Gown",
          price: 12000,
          category: "dresses",
          description:
            "Custom sweetheart bridal reception gown with off-shoulder layered silk lace.",
          image_url:
            "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
          badge: "Featured",
          stock_quantity: 3,
          is_active: true,
        },
        {
          name: "Linen Weekend Co-ord Set",
          price: 3800,
          category: "two-pieces",
          description:
            "High-grade breathable cream linen set, suited to weekend chamas and outdoor events.",
          image_url:
            "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
          badge: "Hot",
          stock_quantity: 8,
          is_active: true,
        },
        {
          name: "Handmade Ankara Pencil Skirt",
          price: 2000,
          category: "skirts",
          description:
            "High-waisted fitted pencil skirt in a vibrant heritage pattern, built for elegant office settings.",
          image_url:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
          badge: "Sale",
          stock_quantity: 12,
          is_active: true,
        },
      ];

      const columns = [
        "name",
        "price",
        "category",
        "description",
        "image_url",
        "badge",
        "stock_quantity",
        "is_active",
      ];

      const values: unknown[] = [];
      const rowPlaceholders = seedData.map((item, rowIndex) => {
        const placeholders = columns.map((column, columnIndex) => {
          values.push(item[column] ?? null);
          return `$${rowIndex * columns.length + columnIndex + 1}`;
        });
        return `(${placeholders.join(", ")})`;
      });

      const inserted = await dbQuery(
        `INSERT INTO products (${columns.map((c) => `"${c}"`).join(", ")})
         VALUES ${rowPlaceholders.join(", ")}
         RETURNING id`,
        values
      );

      return NextResponse.json({ success: true, count: inserted.length });
    }

    /* -------------------------------------------------------------- create */

    if (table === "products" && action === "create") {
      const entries = pickWritable("products", data);
      if (entries.length === 0) {
        return NextResponse.json(
          { error: "No product fields were supplied." },
          { status: 400 }
        );
      }

      const columnList = entries.map(([key]) => `"${key}"`).join(", ");
      const placeholders = entries.map((_, i) => `$${i + 1}`).join(", ");
      const item = await dbQueryOne(
        `INSERT INTO products (${columnList}) VALUES (${placeholders}) RETURNING *`,
        entries.map(([, value]) => value)
      );

      return NextResponse.json({
        success: true,
        item: item ? normaliseProduct(item) : null,
      });
    }

    /* -------------------------------------------------------------- delete */

    if (table === "products" && action === "delete") {
      if (typeof id !== "string" || !UUID_RE.test(id)) {
        return NextResponse.json(
          { error: "A valid product id is required." },
          { status: 400 }
        );
      }

      await dbQuery(`DELETE FROM products WHERE id = $1`, [id]);
      return NextResponse.json({ success: true });
    }

    /* -------------------------------------------------------------- update */

    if (
      action === "update" &&
      typeof table === "string" &&
      Object.prototype.hasOwnProperty.call(WRITABLE_COLUMNS, table)
    ) {
      if (typeof id !== "string" || !UUID_RE.test(id)) {
        return NextResponse.json(
          { error: "A valid row id is required." },
          { status: 400 }
        );
      }

      const entries = pickWritable(table, data);
      if (entries.length === 0) {
        return NextResponse.json(
          { error: "No updatable fields were supplied." },
          { status: 400 }
        );
      }

      const setClause = entries
        .map(([key], i) => `"${key}" = $${i + 1}`)
        .join(", ");

      // `table` is a validated key of WRITABLE_COLUMNS, never raw user input.
      const item = await dbQueryOne(
        `UPDATE ${table} SET ${setClause} WHERE id = $${entries.length + 1} RETURNING *`,
        [...entries.map(([, value]) => value), id]
      );

      if (!item) {
        return NextResponse.json({ error: "Row not found." }, { status: 404 });
      }

      const shaped =
        table === "products"
          ? normaliseProduct(item)
          : table === "orders"
            ? normaliseOrder(item)
            : item;

      return NextResponse.json({ success: true, item: shaped });
    }

    return NextResponse.json(
      { error: "Invalid action or table parameters." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin Database API Error:", error);
    return NextResponse.json(
      { error: "Database operation failed", details: error?.message },
      { status: 500 }
    );
  }
}
