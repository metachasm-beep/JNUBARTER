# Audit Report: Infrastructure & Background Jobs

**Status:** INFO (Reliable background layer, missing API protection)

## Findings

### 1. Inngest Reliability
The background job layer is well-architected using Inngest.
*   **Coordination:** `expireStaleSwaps` correctly coordinates updates between Postgres and Neo4j using idempotent steps.
*   **Frequency:** Cron jobs (e.g., 6h intervals) are appropriately timed for a campus-scale barter network.
*   **Monitoring:** Background failures are logged, and the step-based execution allows for granular retries.

### 2. Ratelimiting & Resource Protection
*   **Gap:** There is no rate limiting on core API routes (`/api/listings`, `/api/swaps`). 
*   **Risk:** This exposes the platform to automated spam and potentially high LLM costs from unauthorized or excessive embedding generation.
*   **Observation:** `@upstash/ratelimit` is in `package.json` but is currently a "ghost" dependency with no active implementation.

### 3. Telemetry & "Canary Watch"
*   **Infrastructure Health:** The `Canary Watch` provides a robust heartbeat by checking DB connectivity (`SELECT 1`) and system pulse (active swaps).
*   **Cost Management:** LLM cost tracking is integrated into the telemetry pipeline, allowing admins to monitor infrastructure expenses in real-time.

### 4. Push Notification Pipeline
*   **Implementation:** Uses a standard `fetch` call to a local API endpoint from within Inngest.
*   **Resilience:** The push step is non-blocking and caught within a try/catch, preventing notification failures from breaking core job logic.

## Priority Actions
1. [HIGH] Implement Upstash Ratelimit on `POST /api/listings` and `/api/swaps` to protect against spam and cost spikes.
2. [MEDIUM] Add alerting (e.g., Slack/Discord hook) to the `Canary Watch` for when the status changes to `DEGRADED`.
