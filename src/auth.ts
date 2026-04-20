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
      if (!user.email) return false;
      
      const email = user.email;
      const isAdminEmail = ADMIN_EMAILS.includes(email);
      const isJNUEmail = email.endsWith("@jnu.ac.in");

      // Only allow JNU emails or whitelisted admin emails
      if (!isAdminEmail && !isJNUEmail) {
        return false;
      }

      try {
        // We use a very permissive upsert. If the 'role' or 'isSuspended' columns 
        // don't exist yet (migration pending), we catch the error to prevent 
        // blocking sign-in entirely.
        await (prisma.user as any).upsert({
          where: { email },
          update: { 
            isVerified: true,
            // Only attempt to set role if it's an admin email. 
            // Using spread to avoid setting undefined if column doesn't exist.
            ...(isAdminEmail ? { role: "ADMIN" } : {})
          },
          create: {
            email,
            name: user.name ?? email.split("@")[0],
            image: user.image ?? null,
            isVerified: true,
            role: isAdminEmail ? "ADMIN" : "USER",
          },
        });
      } catch (err) {
        console.error("[auth] signIn database sync error (likely missing columns):", err);
        // CRITICAL: Do NOT return false here. We want to allow sign-in 
        // even if the user record couldn't be created/updated in the DB
        // for this session.
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          const dbUser = await (prisma.user as any).findUnique({
            where: { email: user.email! },
            select: { id: true, role: true, school: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role || "USER";
            token.hasProfile = !!dbUser.school;
          }
        } catch (err) {
          console.error("[auth] jwt callback error:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") || "USER";
        (session.user as any).hasProfile = !!token.hasProfile;
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
