import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  adminAuthConfigured,
  createSessionToken,
  pinMatches,
} from "@/lib/adminAuth";

/**
 * Exchanges the admin PIN for a signed session cookie.
 *
 * The comparison happens here, on the server, against ADMIN_PIN. The browser
 * never learns the expected value, so the JavaScript bundle no longer leaks it.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin access is not configured. Set ADMIN_PIN in the environment.",
      },
      { status: 503 }
    );
  }

  let supplied: unknown = null;
  try {
    const body = await request.json();
    supplied = body?.pin;
  } catch {
    supplied = null;
  }

  // A small fixed delay makes rapid online guessing impractical without
  // needing shared rate-limit state across serverless invocations.
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!pinMatches(supplied)) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Could not start a session." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
