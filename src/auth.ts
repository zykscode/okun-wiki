/* eslint-disable @typescript-eslint/ban-ts-comment */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // @ts-ignore - PrismaAdapter type expects standard @prisma/client, but we use a custom generated path
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [], // Add providers like Google, GitHub here later
  callbacks: {
    async jwt({ token, user }) {
      // If user is passed in (sign in), add role to token
      if (user) {
        // @ts-ignore - role exists on our User model but might not be on NextAuth User type yet
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});
