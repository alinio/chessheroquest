/**
 * Auth.js (NextAuth v5) — email + password credentials with JWT sessions.
 * Server-side only. Reads AUTH_SECRET from the environment. Route protection is
 * done in the (app) layout via auth() (no edge middleware → node:crypto is fine).
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { users } from "@/db/schema";
import { verifyPassword, DUMMY_PASSWORD_HASH } from "@/src/lib/password";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = rows[0];

        // Constant-time: always run scrypt (against a dummy hash if the user is
        // absent) so response time can't reveal whether the email exists.
        const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
        const ok = await verifyPassword(parsed.data.password, passwordHash);
        if (!user?.passwordHash || !ok) return null;

        return { id: user.id, email: user.email, name: user.displayName ?? null };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
