import { NextResponse } from "next/server";
import { dbQuery, dbQueryOne, isDbConfigured } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log("M-Pesa Callback received:", JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      return NextResponse.json(
        { ResultCode: 1, ResultDesc: "Invalid Callback Data" },
        { status: 400 }
      );
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;

    if (!isDbConfigured()) {
      console.error("M-Pesa callback arrived but DATABASE_URL is not set.");
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Callback received",
      });
    }

    if (ResultCode === 0) {
      // Payment successful
      const { CallbackMetadata } = Body.stkCallback;
      const metadata: Record<string, any> = {};

      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach((item: any) => {
          metadata[item.Name] = item.Value;
        });
      }

      console.log("Parsed M-Pesa Callback Metadata:", metadata);

      const mpesaReceiptNumber = metadata.MpesaReceiptNumber ?? null;
      const amount = metadata.Amount;

      /**
       * Marks the order paid and deducts stock in a single statement.
       *
       * The `payment_status <> 'paid'` guard makes this idempotent: Safaricom
       * retries callbacks, and without it a retry would deduct stock twice for
       * one payment.
       */
      const result = await dbQueryOne<{
        order_number: string | null;
        stock_updated: number;
      }>(
        `WITH paid AS (
           UPDATE orders
              SET payment_status = 'paid',
                  status = 'confirmed',
                  mpesa_transaction_id = $1,
                  notes = $2
            WHERE checkout_request_id = $3
              AND payment_status <> 'paid'
           RETURNING id, order_number
         ),
         deductions AS (
           SELECT oi.product_id, SUM(oi.quantity) AS qty
             FROM order_items oi
             JOIN paid ON paid.id = oi.order_id
            WHERE oi.product_id IS NOT NULL
            GROUP BY oi.product_id
         ),
         restocked AS (
           UPDATE products p
              SET stock_quantity = GREATEST(0, p.stock_quantity - d.qty)
             FROM deductions d
            WHERE p.id = d.product_id
           RETURNING p.id
         )
         SELECT (SELECT order_number FROM paid) AS order_number,
                (SELECT COUNT(*) FROM restocked)::int AS stock_updated`,
        [
          mpesaReceiptNumber,
          `Paid KES ${amount} via M-Pesa. Receipt: ${mpesaReceiptNumber}. Description: ${ResultDesc}.`,
          CheckoutRequestID,
        ]
      );

      if (result?.order_number) {
        console.log(
          `Order ${result.order_number} marked as paid. Stock adjusted on ${result.stock_updated} product(s).`
        );
      } else {
        console.log(
          `No unpaid order matched CheckoutRequestID ${CheckoutRequestID} — likely a duplicate callback.`
        );
      }
    } else {
      // Payment failed or cancelled
      console.log(
        `Payment failed for CheckoutRequestID ${CheckoutRequestID}. ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}`
      );

      await dbQuery(
        `UPDATE orders
            SET payment_status = 'failed',
                notes = $1
          WHERE checkout_request_id = $2
            AND payment_status <> 'paid'`,
        [`M-Pesa payment failed or cancelled: ${ResultDesc}`, CheckoutRequestID]
      );
    }

    // Always return success to Safaricom so it stops retrying.
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    });
  } catch (error: any) {
    console.error("M-Pesa Callback Handler Error:", error);
    // Still return success to Safaricom to avoid a retry loop; we log internally.
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Error processed",
    });
  }
}
