# Design Specification: Phase 3 Alerting & Canary Watch

**Status:** Draft
**Date:** 2026-04-23
**Focus:** Real-time Telemetry Notifications & Infrastructure Health

## 1. Problem Statement
The BARTER platform has "Canary Watch" telemetry, but it requires an admin to manually open the dashboard to see issues. If a database goes down or LLM costs spike, there is no immediate notification.

## 2. Proposed Solution
Implement an "Active Alerting" layer that pushes critical telemetry data to external channels (Discord/Slack).

### 2.1 Alerting Dispatcher
Create `src/lib/alerts.ts`:
- **Function:** `sendAlert(type: AlertType, message: string, metadata: any)`
- **Channel:** Discord Webhook (via `DISCORD_ALERTS_WEBHOOK`).
- **Types:** `SECURITY`, `INFRASTRUCTURE`, `BILLING`.

### 2.2 Canary Watch Enhancement
Modify `src/app/api/admin/telemetry/route.ts`:
- Check for database latencies.
- If Neon or Neo4j latency > 500ms (or offline), trigger a `sendAlert`.
- Check daily LLM cost. If > $2.00, trigger a `sendAlert`.

### 2.3 Security Integration
Modify `src/lib/ratelimit.ts` or API routes:
- If a user is consistently hitting 429s (rate limited), trigger a `SECURITY` alert.

## 3. Configuration
Add `DISCORD_ALERTS_WEBHOOK` to the environment variables.

## 4. Risks & Mitigations
- **Alert Fatigue:** Implement a "Cooldown" (e.g., max 1 alert per 15 mins for the same issue) to avoid spamming the channel.
