import { SignJWT, jwtVerify } from "jose";

/**
 * Minimal signed-cookie session for the Phase-0 passwordless flow (M9a), signed
 * with AUTH_SECRET (HS256). TODO: consolidate with Auth.js + harden before launch.
 */
export const SESSION_COOKIE = "chq_session";

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "");

export async function signSession(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}
