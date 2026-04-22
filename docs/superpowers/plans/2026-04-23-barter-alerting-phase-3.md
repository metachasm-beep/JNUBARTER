# Implementation Plan: Phase 3 Alerting & Canary Watch

**Goal:** Transform passive telemetry into active infrastructure and security alerting.

## Task 1: Alert Dispatcher [/]
- [ ] Create `src/lib/alerts.ts` with Discord webhook support.
- [ ] Implement cooldown logic to prevent notification spam.

## Task 2: Canary Watch Integration [/]
- [ ] Update `src/app/api/admin/telemetry/route.ts` to check thresholds.
- [ ] Trigger alerts for database downtime or high latency.

## Task 3: Billing & Security Alerts [/]
- [ ] Add cost-threshold checks in the telemetry route.
- [ ] Inject alert triggers in mutation routes for repeated rate-limit violations.

## Task 4: Validation [/]
- [ ] Manually trigger a "Mock Alert" via a temporary route.
- [ ] Verify Discord notification formatting and metadata.
