/**
 * Password hashing — scrypt via node:crypto (no external dependency).
 * Server-only. Stored format: "saltHex:hashHex".
 *
 * Async scrypt (not scryptSync) so a hash never stalls the event loop. Callers
 * MUST cap the input length (we do, via Zod .max(128)) so the work is bounded.
 */
import { scrypt as scryptCb, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;

/**
 * A well-formed dummy hash used to run a constant-time verification when the
 * user does not exist (defeats timing-based account enumeration). It can never
 * match a real password.
 */
export const DUMMY_PASSWORD_HASH = `${"0".repeat(32)}:${"0".repeat(KEYLEN * 2)}`;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), KEYLEN);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
