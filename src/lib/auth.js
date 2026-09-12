import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// 30 days -- Auth.js re-signs the session cookie for this same duration on
// every request (its built-in sliding-session refresh always uses this one
// config value, not anything set per sign-in), so a per-login "remember me"
// toggle can't actually vary session length here without much deeper
// surgery. This one setting already means the admin stays logged in for a
// long time without re-entering credentials.
const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

// Single-admin login: one AdminUser row, seeded via prisma/seed.js. No
// signup flow, no roles — see CLAUDE.md Phase 2 scope.
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();
        if (!email || !password) return null;

        const admin = await db.adminUser.findUnique({ where: { email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
});
