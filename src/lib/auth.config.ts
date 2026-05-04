import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // This will be handled in the main auth.ts where we have DB access
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: string })?.role;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isAdminApiRoute = nextUrl.pathname.startsWith("/api/admin");
      const isAuthRoute = nextUrl.pathname.startsWith("/auth");

      if (isAdminRoute || isAdminApiRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: unknown }).role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
