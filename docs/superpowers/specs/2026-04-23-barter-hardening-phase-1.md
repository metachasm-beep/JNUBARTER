# Design Spec: BARTER Security & Performance Hardening (Phase 1)

**Status:** DRAFT
**Author:** Antigravity (Superpowers)
**Date:** 2026-04-23

## 1. Problem Statement
The functional audit identified three critical gaps:
1.  **Database Performance:** Lack of indexes on foreign keys and status enums leads to slow queries as the platform scales.
2.  **Middleware Bypass:** The `/admin` route is not matched by the middleware configuration, potentially bypassing role checks.
3.  **API Vulnerability:** Core mutation routes (Listings, Swaps) lack rate limiting, exposing the system to spam and LLM cost spikes.

## 2. Proposed Solution (Approach 1)

### 2.1 Database Indexing
Add `@index` to high-traffic foreign keys and query filters:
- `Listing`: `userId`, `type`, `category`.
- `Swap`: `initiatorId`, `receiverId`, `status`.
- `Notification`: `userId`, `refId`.
- `AuditLog`: `userId`.

### 2.2 Middleware Hardening
Update `src/middleware.ts` to explicitly include `/admin` in the `matcher`. This ensures the `token.role !== "ADMIN"` check is always executed for administrative paths.

### 2.3 Upstash Ratelimiting
Implement a `src/lib/ratelimit.ts` utility using the `slidingWindow` algorithm.
- **POST /api/listings**: 5 per 10 mins.
- **POST /api/swaps**: 10 per 10 mins.
- **FALLBACK**: Use IP-based limiting for non-authenticated routes.

## 3. Implementation Details

### 3.1 Upstash Utility
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/barter",
});
```

### 3.2 Prisma Changes
```prisma
model Listing {
  // ...
  @@index([userId])
  @@index([type])
  @@index([category])
}
```

## 4. Acceptance Criteria
- [ ] `prisma validate` passes with new indexes.
- [ ] `/admin` route redirects unauthenticated users to sign-in.
- [ ] Exceeding 5 listings in 10 mins returns a `429 Too Many Requests` error.
- [ ] `@clerk/nextjs` is removed from `package.json`.
