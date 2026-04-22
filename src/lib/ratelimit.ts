import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * BARTER RATELIMIT GUARD
 * Uses Upstash Redis (Sliding Window) to protect mutations and expensive AI routes.
 */
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 m"), // Default: 10 requests per 10 minutes
  analytics: true,
  prefix: "@upstash/ratelimit/barter",
});

/**
 * Specialized limiters for higher-stakes operations.
 */
export const listingLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"), // Max 5 listings per 10 mins
  analytics: true,
  prefix: "@upstash/ratelimit/barter/listings",
});

export const swapLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 m"), // Max 10 swap actions per 10 mins
  analytics: true,
  prefix: "@upstash/ratelimit/barter/swaps",
});
