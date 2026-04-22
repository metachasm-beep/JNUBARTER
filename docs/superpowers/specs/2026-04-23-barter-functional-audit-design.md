# Design Spec: BARTER Functional Audit

**Date:** 2026-04-23
**Topic:** General Functional Audit of the BARTER Codebase
**Approach:** Layer-First Systematic Audit

## Goal
Conduct a comprehensive functional audit of the JNU Barter platform to identify architectural debt, security vulnerabilities, and performance bottlenecks, ensuring a production-grade academic exchange experience.

## Audit Scope

### 1. Data Layer & Schema Consistency
*   **Prisma Audit:** Verify `schema.prisma` for redundant relations, missing indexes, and alignment with the Neon/Postgres environment.
*   **Neo4j Integration:** Review graph data synchronization logic and verify "academic exchange" relationship handling.
*   **Policy Enforcement:** Ensure "Zero-Money" constraints are enforced at the database level.

### 2. Authentication & Security Architecture
*   **Auth Resolution:** Investigate the dual presence of Clerk and NextAuth. Resolve any session conflicts or redundant code.
*   **Route Protection:** Verify `middleware.ts` coverage for `/admin`, `/profile`, and `/swap`.
*   **Role Management:** Audit "Admin" role assignment and enforcement for the Command Center.

### 3. UI/UX & Frontend Performance
*   **React 19/Next.js 16 Audit:** Check for proper async handling in `params` and Server Component optimization.
*   **3D/GL Performance:** Analyze `ParallaxHero` and other R3F components for memory leaks and rendering efficiency.
*   **PWA/Mobile Readiness:** Verify Serwist/Capacitor consistency and "App Cinematic Glass" aesthetic across devices.

### 4. Infrastructure & Background Jobs
*   **Inngest Workflows:** Review reliability of background jobs (e.g., listing expirations, notifications).
*   **Infrastructure Scaling:** Audit Upstash (Redis/Ratelimit) implementation for bottlenecks.
*   **Telemetry:** Verify "Canary Watch" and infrastructure telemetry coverage for critical failure points.

## Methodology
Using the **Superpowers** workflow, specifically:
*   **Systematic Debugging** for identifying hidden architectural issues.
*   **Verification Before Completion** for validating findings.

## Success Criteria
*   Documented "Health Report" of the codebase.
*   Identified list of high-priority fixes for architectural, security, and performance issues.
*   Clear roadmap for transitioning to a single Auth provider (if recommended).
