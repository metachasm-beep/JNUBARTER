import NextAuth, { NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

const ADMIN_EMAILS = ["metachasm@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? "";
      const shouldBeAdmin = ADMIN_EMAILS.includes(email);

      try {
        await prisma.user.upsert({
          where: { email },
          update: { 
            isVerified: true,
            role: shouldBeAdmin ? "ADMIN" : undefined 
          },
          create: {
            email,
            name: user.name ?? email.split("@")[0],
            image: user.image ?? null,
            isVerified: true,
            role: shouldBeAdmin ? "ADMIN" : "USER",
          },
        });
      } catch (err) {
        console.error("[auth] upsert error", err);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") || "USER";
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { isVerified: true, role: true },
          });
          session.user.isVerified = dbUser?.isVerified ?? false;
          session.user.role = dbUser?.role ?? "USER";
        } catch {
          session.user.isVerified = false;
        }
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export const auth = () => NextAuth(authOptions);
export const signIn = () => {};
export const signOut = () => {};
