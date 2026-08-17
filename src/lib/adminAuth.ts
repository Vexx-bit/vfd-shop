/**
 * Admin session handling.
 *
 * The dashboard used to be gated by a PIN compared in the browser, with the
 * expected value hardcoded in the bundle — anyone could read it in devtools —
 * and the API accepted that same PIN as a fallback. This module replaces both
 * with a signed, httpOnly session cookie that is only issued after the server
 * has checked the supplied PIN against ADMIN_PIN.
 *
 * There is deliberately no default PIN. If ADMIN_PIN is unset, admin access is
 * impossible rather than open.
 *
 * This runs in both the Edge runtime (middleware) and Node (route handlers), so
 * it uses Web Crypto only — no `node:crypto`, no `Buffer`.
 */

export const ADMIN_COOKIE = "vfd_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded =
    normalised + "=".repeat((4 - (normalised.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** The configured PIN, or null when ADMIN_PIN is unset. No fallback. */
export function configuredPin(): string | null {
  const pin = process.env.ADMIN_PIN;
  return typeof pin === "string" && pin.length > 0 ? pin : null;
}

/** Admin access is impossible unless ADMIN_PIN is set. Fails closed. */
export function adminAuthConfigured(): boolean {
  return configuredPin() !== null;
}

/**
 * Key used to sign session cookies. ADMIN_SESSION_SECRET is strongly preferred:
 * deriving the key from a short PIN means a leaked cookie could be brute-forced
 * offline to forge more.
 */
function sessionSecret(): string | null {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (typeof explicit === "string" && explicit.length >= 16) return explicit;
  const pin = configuredPin();
  return pin ? `vfd:admin:session:${pin}` : null;
}

/** Constant-time PIN comparison, so response timing cannot leak the value. */
export function pinMatches(supplied: unknown): boolean {
  const expected = configuredPin();
  if (!expected || typeof supplied !== "string") return false;
  if (supplied.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

async function signingKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret) return null;

  const issuedAt = Date.now();
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        iat: issuedAt,
        exp: issuedAt + SESSION_TTL_SECONDS * 1000,
      })
    )
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(secret),
    encoder.encode(payload)
  );

  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function sessionIsValid(
  token: string | null | undefined
): Promise<boolean> {
  const secret = sessionSecret();
  if (!token || !secret) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  try {
    const verified = await crypto.subtle.verify(
      "HMAC",
      await signingKey(secret),
      fromBase64Url(signature),
      encoder.encode(payload)
    );
    if (!verified) return false;

    const claims = JSON.parse(decoder.decode(fromBase64Url(payload))) as {
      exp?: number;
    };
    return typeof claims.exp === "number" && claims.exp > Date.now();
  } catch {
    return false;
  }
}

/** Reads one cookie from a raw Cookie header, for plain Request handlers. */
export function readCookie(
  header: string | null,
  name: string
): string | null {
  if (!header) return null;

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    if (part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return null;
}

/**
 * True when the request carries a valid session cookie, or the exact ADMIN_PIN
 * in the x-admin-pin header. The header path exists so scripts and the current
 * dashboard keep working; it is not a weaker path, because there is no
 * fallback value to guess.
 */
export async function requestIsAuthorised(request: Request): Promise<boolean> {
  if (!adminAuthConfigured()) return false;

  const cookie = readCookie(request.headers.get("cookie"), ADMIN_COOKIE);
  if (await sessionIsValid(cookie)) return true;

  return pinMatches(request.headers.get("x-admin-pin"));
}
