import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Neon (Postgres) data layer — replaces the previous Supabase client.
 *
 * Neon's serverless driver talks to Postgres over HTTP, so it works inside
 * Next.js route handlers on Vercel without connection-pooling headaches, and
 * the free tier does not auto-pause the way Supabase's does.
 *
 * Set DATABASE_URL to the POOLED Neon connection string (the host containing
 * "-pooler"), for example:
 *   postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
 *
 * This must be a server-only variable. Never prefix it with NEXT_PUBLIC_.
 */

let cachedSql: NeonQueryFunction<false, false> | null = null;

/** True when DATABASE_URL is present, so callers can degrade gracefully. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getSql(): NeonQueryFunction<false, false> {
  if (cachedSql) return cachedSql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local for local dev, and to the Vercel project environment variables for production."
    );
  }

  cachedSql = neon(connectionString);
  return cachedSql;
}

/**
 * Run a parameterised query and get rows back.
 *
 * Always pass user input via `params` ($1, $2, ...). Never interpolate user
 * input into `text` — that is how SQL injection happens.
 */
export async function dbQuery<T = Record<string, any>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = getSql();
  const rows = await sql.query(text, params as any[]);
  return rows as unknown as T[];
}

/** Convenience helper for queries that return at most one row. */
export async function dbQueryOne<T = Record<string, any>>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await dbQuery<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Postgres returns numeric/decimal columns as strings to preserve precision,
 * but the UI does arithmetic and .toLocaleString() on them. Normalise first.
 */
export function toNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Shape helpers used across API routes. */
export type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  badge: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
};

/** Coerce a raw products row into the numeric shape the UI expects. */
export function normaliseProduct<T extends Record<string, any>>(row: T): T {
  return {
    ...row,
    price: toNumber(row.price),
    stock_quantity: toNumber(row.stock_quantity),
  };
}

/** Coerce a raw orders row into the numeric shape the UI expects. */
export function normaliseOrder<T extends Record<string, any>>(row: T): T {
  return {
    ...row,
    subtotal: toNumber(row.subtotal),
    delivery_fee: toNumber(row.delivery_fee),
    total: toNumber(row.total),
    order_items: Array.isArray(row.order_items)
      ? row.order_items.map((item: Record<string, any>) => ({
          ...item,
          quantity: toNumber(item.quantity),
          price: toNumber(item.price),
          subtotal: toNumber(item.subtotal),
        }))
      : [],
  };
}
