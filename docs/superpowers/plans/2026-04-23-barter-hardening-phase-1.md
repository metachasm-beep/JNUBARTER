# Implementation Plan: Phase 1 Hardening

**Goal:** Secure and optimize the BARTER platform based on Approach 1.

## Task 1: Database Indexing Optimization [/]
- [ ] Add `@index` to `User`, `Listing`, `Swap`, `Notification`, and `AuditLog` in `prisma/schema.prisma`.
- [ ] Run `npx prisma validate` to ensure schema integrity.
- [ ] Generate Prisma client (`npx prisma generate`).

## Task 2: Middleware & Security Hardening [/]
- [ ] Update `config.matcher` in `src/middleware.ts` to include `/admin/:path*`.
- [ ] Verify that `/admin` protection logic correctly uses the expanded matcher.

## Task 3: Upstash Ratelimit Integration [/]
- [ ] Create `src/lib/ratelimit.ts` with standard "Fair Use" configurations.
- [ ] Implement ratelimiting in `POST /api/listings`.
- [ ] Implement ratelimiting in `POST /api/swaps` and `POST /api/swaps/:id/execute`.
- [ ] Test 429 response handling.

## Task 4: Hygiene & Cleanup [/]
- [ ] Remove `@clerk/nextjs` from `package.json`.
- [ ] Run `npm install` to update lockfile.

## Task 5: Final Validation [/]
- [ ] Verify build stability (`npm run build`).
- [ ] Verify admin accessibility for whitelisted emails.
