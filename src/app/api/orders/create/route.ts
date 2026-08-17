import { NextResponse } from "next/server";
import { dbQueryOne, isDbConfigured } from "@/lib/db";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      items,
    } = body ?? {};

    // Validation
    if (
      !order_number ||
      !customer_name ||
      !customer_phone ||
      !delivery_address ||
      subtotal === undefined ||
      total === undefined ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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

    /**
     * Line items arrive from the cart, which can hold demo products whose ids
     * are not real UUIDs. Null those out rather than letting the insert blow up.
     */
    const lineItems = items.map((item: any) => ({
      product_id:
        typeof item?.product_id === "string" && UUID_RE.test(item.product_id)
          ? item.product_id
          : null,
      product_name: String(item?.product_name ?? "Item"),
      quantity: Math.max(1, Math.round(Number(item?.quantity) || 1)),
      price: Number(item?.price) || 0,
    }));

    const isWhatsApp = payment_method === "whatsapp";

    /**
     * One statement, so the order and its items either both land or neither
     * does. The previous Supabase version could leave an order with no items
     * if the second insert failed.
     */
    const created = await dbQueryOne<{ order_id: string }>(
      `WITH new_order AS (
         INSERT INTO orders (
           order_number, customer_name, customer_phone, customer_email,
           delivery_address, subtotal, delivery_fee, total,
           status, payment_status, notes
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10)
         RETURNING id
       )
       INSERT INTO order_items (
         order_id, product_id, product_name, quantity, price, subtotal
       )
       SELECT new_order.id,
              item.product_id,
              item.product_name,
              item.quantity,
              item.price,
              item.price * item.quantity
         FROM new_order,
              jsonb_to_recordset($11::jsonb)
                AS item(product_id uuid, product_name text, quantity int, price numeric)
       RETURNING order_id`,
      [
        order_number,
        customer_name,
        customer_phone,
        customer_email || null,
        delivery_address,
        subtotal,
        delivery_fee ?? 0,
        total,
        isWhatsApp ? "unpaid" : "pending",
        `Placed via ${isWhatsApp ? "WhatsApp Order Flow" : "M-Pesa STK Push Flow"}.`,
        JSON.stringify(lineItems),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: created?.order_id,
    });
  } catch (error: any) {
    // A duplicate order_number trips the unique constraint (Postgres 23505).
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "That order number already exists. Please retry." },
        { status: 409 }
      );
    }

    console.error("Order API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
