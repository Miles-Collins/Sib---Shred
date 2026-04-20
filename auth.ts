import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { getAdminRoleForEmail } from "@/lib/admin-rbac";

export function isGoogleAuthConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return Boolean(user.email);
    },
    async jwt({ token }) {
      const role = token.email ? await getAdminRoleForEmail(token.email) : null;
      token.role = role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
  trustHost: true,
});
