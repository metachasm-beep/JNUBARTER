# Audit Report: Data Layer & Schema Consistency

**Status:** WARNING (Performance/Consistency Risks)

## Findings

### 1. Missing Database Indexes
Most foreign key relationships in `schema.prisma` lack explicit `@index` tags. While PostgreSQL handles some optimization, the lack of indexes on high-traffic fields like `userId` (Listings, Swaps), `initiatorId`/`receiverId` (Swaps), and `refId` (Notifications) will lead to linear scan performance degradation as the database grows.
*   **Recommendation:** Add `@index` to all foreign key fields and status fields.

### 2. Neo4j Synchronization Gaps
The `atomicSyncUser` logic handles profile setup but lacks a generic synchronization pattern for ongoing Listing updates. 
*   **Consistency Risk:** If a user adds an "Offer" later through the standard UI, it appears to bypass the Neo4j Graph, making it invisible to the matching engine.
*   **Resilience Risk:** Neo4j sync failures are caught and logged but not queued for retry. This can lead to permanent data divergence between Postgres and the Graph.

### 3. "Zero-Money" Policy Integrity
The policy is strictly enforced via `src/lib/agents/policy-guard.ts`. 
*   **Status:** EXCELLENT. 
*   **Logic:** Uses regex (`AMOUNT_PATTERN`) and keyword detection (`CURRENCY_SYMBOLS`).
*   **Isolation:** Monetary tracking is correctly isolated to `UsageLog` for infrastructure telemetry only.

### 4. Prisma vs Neo4j Relationship Mapping
`MultiSwapParticipant` introduces complex circular dependencies. The current schema tracks these in Postgres, but the Neo4j engine doesn't seem to have a mirrored "Circle of Swap" logic yet.

## Priority Actions
1. [HIGH] Add `@index` to foreign keys in `schema.prisma`.
2. [MEDIUM] Implement a background reconciliation job (Inngest) to sync Postgres Listings to Neo4j.
