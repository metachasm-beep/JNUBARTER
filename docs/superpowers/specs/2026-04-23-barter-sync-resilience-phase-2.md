# Design Specification: Phase 2 Synchronization & Resilience

**Status:** Draft
**Date:** 2026-04-23
**Focus:** Neo4j Graph Reconciliation & Inngest Automation

## 1. Problem Statement
The BARTER platform uses Neo4j for graph-based multi-swap discovery. However, the current implementation lacks a robust mechanism to ensure listings in Prisma are mirrored in Neo4j. This leads to:
- Missing nodes in the matching graph.
- Stale data in swap discovery results.
- Manual intervention required for data consistency.

## 2. Proposed Solution
Implement a "Sync-on-Mutation" pattern coupled with a "Background Reconciliation" job.

### 2.1 Neo4j Listing Schema
Each listing in Prisma should correspond to a `:Listing` node in Neo4j:
- `id` (Unique)
- `title`
- `type` (OFFER/WANT)
- `category`
- `userId` (Relationship: `(User)-[:POSTED]->(Listing)`)

### 2.2 Inngest Background Worker
Create an Inngest function `sync.neo4j.listings`:
- **Trigger:** Manual (via Admin) or Scheduled (Daily).
- **Action:** 
    1. Fetch all listings from Prisma.
    2. Batch `MERGE` nodes and relationships into Neo4j.
    3. Remove Neo4j nodes that no longer exist in Prisma.

### 2.3 API Integration
Modify `POST /api/listings`:
- After successful Prisma creation, dispatch an Inngest event `listing.created`.
- Inngest handler updates Neo4j atomically.

## 3. UI Integration
Add a "Reconcile Graph" button to the Admin Telemetry dashboard (`/admin/telemetry`).

## 4. Risks & Mitigations
- **Neo4j Connection Overhead:** Use pooling and batching to avoid exhausting database resources during bulk sync.
- **Inngest Reliability:** Use retries with exponential backoff for Neo4j mutations.
