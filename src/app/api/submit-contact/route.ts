import { NextResponse } from "next/server";
import { dbQueryOne, isDbConfigured } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body ?? {};

    // Validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, phone, message)" },
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

    const contactMessage = await dbQueryOne<{ id: string }>(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, 'new')
       RETURNING id`,
      [name, email || null, phone, subject || "General Inquiry", message]
    );

    return NextResponse.json({
      success: true,
      message: "Message submitted successfully",
      messageId: contactMessage?.id,
    });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
