import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Admin fortress (Phase A) — allowlist parsing + the requireAdmin guard.
 * env/auth/navigation are mocked: env.ts is server-only (throws under jsdom)
 * and auth() needs a live session.
 */
const mocks = vi.hoisted(() => ({
  env: { ADMIN_EMAILS: undefined as string | undefined },
  auth: vi.fn(),
}));

vi.mock("@/src/lib/env", () => ({ env: mocks.env }));
vi.mock("@/src/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { parseAdminEmails, isAdminEmail, requireAdmin } from "./admin";

describe("parseAdminEmails", () => {
  it("returns [] for undefined or empty input", () => {
    expect(parseAdminEmails(undefined)).toEqual([]);
    expect(parseAdminEmails("")).toEqual([]);
    expect(parseAdminEmails(" , ,")).toEqual([]);
  });

  it("normalizes case and whitespace", () => {
    expect(parseAdminEmails(" Alain@Monkeoz.com , ops@CHQ.io ")).toEqual([
      "alain@monkeoz.com",
      "ops@chq.io",
    ]);
  });
});

describe("isAdminEmail", () => {
  it("rejects null / empty / whitespace emails", () => {
    expect(isAdminEmail(null, "a@b.co")).toBe(false);
    expect(isAdminEmail(undefined, "a@b.co")).toBe(false);
    expect(isAdminEmail("", "a@b.co")).toBe(false);
    expect(isAdminEmail("   ", "a@b.co")).toBe(false);
  });

  it("rejects everyone when the allowlist is unset (closed by default)", () => {
    expect(isAdminEmail("a@b.co", undefined)).toBe(false);
  });

  it("matches case-insensitively with trimming", () => {
    expect(isAdminEmail(" A@B.co ", "a@b.co,c@d.io")).toBe(true);
    expect(isAdminEmail("c@d.io", "a@b.co, C@D.io")).toBe(true);
    expect(isAdminEmail("x@y.z", "a@b.co,c@d.io")).toBe(false);
  });

  it("never matches on substrings", () => {
    expect(isAdminEmail("a@b.co.evil.com", "a@b.co")).toBe(false);
  });

  it("defaults to env.ADMIN_EMAILS", () => {
    mocks.env.ADMIN_EMAILS = "root@chq.io";
    expect(isAdminEmail("root@chq.io")).toBe(true);
    expect(isAdminEmail("user@chq.io")).toBe(false);
  });
});

describe("requireAdmin", () => {
  beforeEach(() => {
    mocks.env.ADMIN_EMAILS = "root@chq.io";
    mocks.auth.mockReset();
  });

  it("404s when there is no session (route stays invisible)", async () => {
    mocks.auth.mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("404s for a signed-in non-admin (no talking 403)", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "u1", email: "player@chq.io" } });
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("returns the normalized admin session for an allowlisted email", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "u1", email: " Root@CHQ.io " } });
    await expect(requireAdmin()).resolves.toEqual({
      userId: "u1",
      email: "root@chq.io",
    });
  });
});
