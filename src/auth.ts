import NextAuth, { NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }
}

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

      // Remove institutional restriction — allow any Google account (including Gmail)
      try {
        await prisma.user.upsert({
          where: { email },
          update: { isVerified: true },
          create: {
            email,
            name: user.name ?? email.split("@")[0],
            image: user.image ?? null,
            isVerified: true,
          },
        });
      } catch (err) {
        console.error("[auth] upsert error", err);
        // Don't block sign-in for DB errors — log and continue
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Find the user in DB by email to get our CUID
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { isVerified: true },
          });
          session.user.isVerified = dbUser?.isVerified ?? false;
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
