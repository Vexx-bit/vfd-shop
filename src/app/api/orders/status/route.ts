import { NextResponse } from "next/server";
import { dbQueryOne, isDbConfigured } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Missing orderNumber parameter" },
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

    const order = await dbQueryOne<{
      status: string;
      payment_status: string;
    }>(
      `SELECT status, payment_status
         FROM orders
        WHERE order_number = $1
        LIMIT 1`,
      [orderNumber]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: order.status,
        payment_status: order.payment_status,
      },
      {
        // This is polled while the customer waits on the M-Pesa prompt, so it
        // must never be served from a cache.
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: any) {
    console.error("Order status API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
