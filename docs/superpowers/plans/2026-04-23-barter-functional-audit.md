# BARTER Functional Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conduct a comprehensive functional audit of the BARTER codebase across Data, Auth, UI, and Infrastructure layers.

**Architecture:** Layer-first systematic analysis using ripgrep for discovery, Prisma CLI for data validation, and manual code review for architectural patterns. Findings will be documented in a central health report.

**Tech Stack:** Next.js 16, Prisma, Neon, Clerk, NextAuth, Inngest, Upstash.

---

### Task 1: Data Layer & Schema Audit

**Files:**
- Modify: `docs/superpowers/audit/data-layer-report.md` [NEW]
- Check: `prisma/schema.prisma`
- Check: `src/lib/neo4j.ts` (if exists)

- [ ] **Step 1: Validate Prisma Schema**
    Run: `npx prisma validate`
    Expected: Success or specific schema errors.
- [ ] **Step 2: Check for redundant relations and missing indexes**
    Inspect `prisma/schema.prisma` for fields without `@index` and potential N+1 relationship traps.
- [ ] **Step 3: Audit Neo4j synchronization logic**
    Grep for `neo4j` usage in `src/app/api` and `src/lib` to find where data is mirrored.
- [ ] **Step 4: Verify "Zero-Money" constraints**
    Grep for `price`, `cost`, `amount`, `currency` in schemas and swap logic to ensure no monetary fields are being used for swaps.
- [ ] **Step 5: Document findings and commit**
    Create `docs/superpowers/audit/data-layer-report.md` with findings.
    ```bash
    git add docs/superpowers/audit/data-layer-report.md
    git commit -m "audit: data layer findings"
    ```

### Task 2: Authentication & Security Audit

**Files:**
- Modify: `docs/superpowers/audit/auth-security-report.md` [NEW]
- Check: `src/auth.ts`, `src/middleware.ts`
- Check: `package.json`

- [ ] **Step 1: Map Clerk vs NextAuth usage**
    Run: `grep -r "clerk" src` and `grep -r "next-auth" src`
    Identify overlap and potential session conflicts.
- [ ] **Step 2: Audit Middleware route protection**
    Inspect `src/middleware.ts` to ensure `/admin`, `/profile`, and `/swap` are strictly protected.
- [ ] **Step 3: Verify Admin role enforcement**
    Search for `ADMIN` role checks in `src/app/admin` and verify if they rely on secure server-side session data.
- [ ] **Step 4: Document findings and commit**
    Create `docs/superpowers/audit/auth-security-report.md`.
    ```bash
    git add docs/superpowers/audit/auth-security-report.md
    git commit -m "audit: auth and security findings"
    ```

### Task 3: UI/UX & Frontend Performance Audit

**Files:**
- Modify: `docs/superpowers/audit/frontend-report.md` [NEW]
- Check: `src/components/ParallaxHero.tsx`
- Check: `src/app/layout.tsx`

- [ ] **Step 1: Check Next.js 16 / React 19 compatibility**
    Inspect `src/app` for async `params` usage in routes (breaking change in Next.js 15+).
- [ ] **Step 2: Analyze ParallaxHero rendering**
    Review `src/components/ParallaxHero.tsx` for heavy useEffect hooks or unoptimized 3D textures.
- [ ] **Step 3: Verify PWA / Mobile Consistency**
    Check `public/manifest.json` and `next.config.ts` (Serwist config) for PWA health.
- [ ] **Step 4: Document findings and commit**
    Create `docs/superpowers/audit/frontend-report.md`.
    ```bash
    git add docs/superpowers/audit/frontend-report.md
    git commit -m "audit: frontend and PWA findings"
    ```

### Task 4: Infrastructure & Background Jobs Audit

**Files:**
- Modify: `docs/superpowers/audit/infrastructure-report.md` [NEW]
- Check: `src/app/api/inngest/route.ts`
- Check: `src/lib/upstash.ts` (if exists)

- [ ] **Step 1: Audit Inngest functions**
    Inspect `src/inngest` (or wherever functions are defined) for error handling and retry logic.
- [ ] **Step 2: Check Upstash Ratelimit implementation**
    Grep for `@upstash/ratelimit` to ensure critical API routes are protected.
- [ ] **Step 3: Verify Telemetry coverage**
    Search for `Canary` or `Telemetry` keywords to see if infrastructure health is being monitored.
- [ ] **Step 4: Document findings and commit**
    Create `docs/superpowers/audit/infrastructure-report.md`.
    ```bash
    git add docs/superpowers/audit/infrastructure-report.md
    git commit -m "audit: infrastructure findings"
    ```

### Task 5: Final Health Report Consolidation

**Files:**
- Modify: `docs/superpowers/audit/FINAL-HEALTH-REPORT.md` [NEW]

- [ ] **Step 1: Consolidate all layer reports**
    Summarize findings into a high-level executive report with "Critical", "Warning", and "Info" labels.
- [ ] **Step 2: Propose Roadmap**
    Outline 3-5 prioritized follow-up tasks (e.g., "Migrate Clerk to NextAuth").
- [ ] **Step 3: Final Commit**
    ```bash
    git add docs/superpowers/audit/FINAL-HEALTH-REPORT.md
    git commit -m "audit: final consolidated health report"
    ```
