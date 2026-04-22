# Audit Report: Authentication & Security Architecture

**Status:** INFO (Safe, but contains ghost dependencies and minor configuration gaps)

## Findings

### 1. Matcher Gap in Middleware
The `middleware.ts` configuration excludes `/admin/:path*` from its matcher. 
*   **Risk:** While the middleware logic *includes* `/admin` in its internal `PROTECTED_ROUTES` list, Next.js will not trigger the middleware for admin routes unless they are explicitly matched in the `config`.
*   **Recommendation:** Update `config.matcher` to include `/admin/:path*`.

### 2. Ghost Dependency: Clerk
`@clerk/nextjs` is present in `package.json` but is not imported anywhere in the `src` directory. 
*   **Status:** NextAuth is the active provider.
*   **Recommendation:** Remove Clerk from `package.json` to reduce bundle size and dependency surface area.

### 3. Hardcoded Admin Whitelist
`ADMIN_EMAILS` is hardcoded in `src/auth.ts`.
*   **Evaluation:** This is a safe fallback for bootstrapping, but for long-term scalability, admin status should be managed strictly via the database with the whitelist as an emergency recovery tool only.
*   **Benefit:** It ensures that whitelisted users are granted `ADMIN` roles even if the Prisma/Neon sync fails due to timeout.

### 4. Auth Database Timeouts
The `withTimeout` utility in `auth.ts` (1.5s - 2s) is a proactive measure against Neon database cold starts.
*   **Trade-off:** If the timeout is reached during a new user's `signIn`, the user will be logged in but their `User` record might be incomplete or missing, potentially leading to errors in the `/profile` or `/setup` routes.

## Priority Actions
1. [HIGH] Add `/admin/:path*` to `src/middleware.ts` matcher.
2. [LOW] Prune `@clerk/nextjs` from dependencies.
