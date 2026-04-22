# BARTER Technical Roadmap: 2026 Sustainability & Growth

**Status:** Finalized (Hardening Phase 1-3 Complete)
**Author:** Antigravity AI
**Date:** 2026-04-23

## 1. Executive Summary
Following a comprehensive functional audit, the BARTER platform has undergone a critical hardening phase to address performance bottlenecks, security gaps, and data synchronization risks. The infrastructure is now optimized for high-traffic academic exchange.

## 2. Completed Hardening (Phase 1-3)
### 2.1 Performance & Data Layer [DONE]
- **Indexing:** Applied 10+ `@index` tags to Prisma schema core models (Listing, Swap, User, AuditLog).
- **Graph Parity:** Implemented Inngest-driven Neo4j reconciliation to ensure 100% accuracy in multi-swap discovery.
- **Sync Hooks:** Integrated atomic Neo4j updates into mutation pipelines.

### 2.2 Security & Resilience [DONE]
- **API Throttling:** Implemented Upstash sliding-window rate limiting for mutations (Listings & Swaps).
- **Middleware Shield:** Closed the `/admin` matcher gap in Next.js middleware.
- **Active Alerting:** Deployed Discord webhook integration for real-time infrastructure and security notifications.
- **Canary Watch:** Enhanced telemetry with latency measurement and automated downtime alerts.

### 2.3 Hygiene [DONE]
- **Pruning:** Removed redundant `@clerk/nextjs` dependency to reduce production bundle size.

## 3. Future Roadmap (Post-Hardening)
### 3.1 Q3 2026: Scholarly Verification 2.0
- **AI Peer Review:** Automate the research verification process using multi-agentic consensus.
- **Institutional SSO:** Transition from Google OAuth to JNU-specific SSO if available for higher trust.

### 3.2 Q4 2026: Graph Intelligence
- **Advanced Topology:** Implement weight-based matching in Neo4j to prioritize "High Reputation" nodes in multi-swaps.
- **Network Sentiment:** Expand the sentiment engine to detect academic trends across departments.

### 3.3 2027: Decentralized Resilience
- **Edge Deployment:** Move core matching logic to Vercel Edge for sub-50ms global latency.
- **Offline Mode:** Enhance PWA capabilities with background sync for low-connectivity campus areas.

## 4. Maintenance Protocol
- **Weekly:** Review Canary Watch telemetry for latency trends.
- **Monthly:** Run full Neo4j reconciliation job via Admin Command Center.
- **Quarterly:** Prune audit logs older than 90 days.
