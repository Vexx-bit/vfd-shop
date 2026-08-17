import { NextResponse } from "next/server";
import { dbQueryOne, isDbConfigured } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      date_of_birth,
      gender,
      id_number,
      email,
      phone,
      address,
      city,
      county,
      education_level,
      has_experience,
      emergency_name,
      emergency_relationship,
      emergency_phone,
      intake_month,
      study_mode,
      additional_info,
    } = body ?? {};

    // Validation
    if (
      !full_name ||
      !date_of_birth ||
      !email ||
      !phone ||
      !id_number ||
      !intake_month ||
      !study_mode
    ) {
      return NextResponse.json(
        { error: "Missing required fields for student registration" },
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

    // The form sends this as either a boolean or a Yes/No string depending on
    // the control used, so normalise it to text for storage.
    const experience =
      has_experience === null || has_experience === undefined
        ? null
        : String(has_experience);

    const enrollment = await dbQueryOne<{ id: string }>(
      `INSERT INTO enrollments (
         full_name, date_of_birth, gender, id_number, email, phone,
         address, city, county, education_level, has_experience,
         emergency_name, emergency_relationship, emergency_phone,
         intake_month, study_mode, additional_info, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'pending')
       RETURNING id`,
      [
        full_name,
        date_of_birth || null,
        gender || null,
        id_number || null,
        email || null,
        phone || null,
        address || null,
        city || null,
        county || null,
        education_level || null,
        experience,
        emergency_name || null,
        emergency_relationship || null,
        emergency_phone || null,
        intake_month || null,
        study_mode || null,
        additional_info || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      enrollmentId: enrollment?.id,
    });
  } catch (error: any) {
    console.error("Enrollment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
