import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const PROTECTED_ROUTES = ["/swap", "/profile", "/setup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No session → send to sign-in
  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Has token but email not from JNU (shouldn't happen after signIn gate,
  // but defensive check for stale sessions)
  const email = (token.email as string) ?? "";
  const isJnu =
    email.endsWith("@jnu.ac.in") || email.endsWith("@mail.jnu.ac.in");

  if (!isJnu) {
    return NextResponse.redirect(
      new URL("/auth/error?reason=jnu-only", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/swap/:path*", "/profile/:path*", "/setup/:path*"],
};
