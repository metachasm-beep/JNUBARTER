import NextAuth, { NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs))
  ]);
};

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
        await withTimeout(
          (prisma.user as any).upsert({
            where: { email },
            update: { 
              isVerified: true,
              ...(isAdminEmail ? { role: "ADMIN" } : {})
            },
            create: {
              email,
              name: user.name ?? email.split("@")[0],
              image: user.image ?? null,
              isVerified: true,
              role: isAdminEmail ? "ADMIN" : "USER",
            },
          }),
          2000, // 2 second timeout
          null
        );
      } catch (err) {
        console.error("[auth] signIn database sync error:", err);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          const dbUser = (await withTimeout(
            (prisma.user as any).findUnique({
              where: { email: user.email! },
              select: { id: true, role: true, school: true },
            }),
            1500, // 1.5 second timeout
            null
          )) as any;
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role || "USER";
            token.hasProfile = !!dbUser.school;
            console.log(`[auth] JWT Callback: user=${user.email} role=${token.role}`);
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
        console.log(`[auth] Session Callback: user=${session.user.email} role=${session.user.role}`);
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
