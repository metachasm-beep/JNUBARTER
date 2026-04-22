# Implementation Plan: Phase 2 Synchronization & Resilience

**Goal:** Ensure Neo4j stays in sync with Prisma for optimal graph-based matching.

## Task 1: Neo4j Utility Expansion [/]
- [ ] Update `src/lib/neo4j.ts` or `src/lib/barter-sync.ts` with a `syncListingToNeo4j` helper.
- [ ] Implement batch reconciliation logic (Prisma -> Neo4j).

## Task 2: Inngest Sync Handlers [/]
- [ ] Create `src/lib/functions/sync-neo4j.ts`.
- [ ] Define `sync.listing.created` and `sync.neo4j.reconcile` functions.
- [ ] Register functions in `src/app/api/inngest/route.ts`.

## Task 3: API Integration [/]
- [ ] Update `POST /api/listings` to emit `listing.created` Inngest event.
- [ ] Ensure deleted listings (if supported) trigger node removal.

## Task 4: Admin Controls [/]
- [ ] Update `/admin/telemetry` to include a "Reconcile Graph Database" button.
- [ ] Implement the API route to trigger the reconciliation job.

## Task 5: Validation [/]
- [ ] Manually trigger reconciliation and verify Neo4j node count via `cypher`.
- [ ] Verify real-time sync on new listing creation.
