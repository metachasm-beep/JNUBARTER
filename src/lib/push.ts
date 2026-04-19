/**
 * JNU BARTER — Web Push helper
 * Uses the `web-push` package with VAPID keys stored in env.
 *
 * Generate VAPID keys once via:
 *   npx web-push generate-vapid-keys
 * Then add to .env:
 *   VAPID_PUBLIC_KEY=...
 *   VAPID_PRIVATE_KEY=...
 *   VAPID_MAILTO=admin@jnu.ac.in
 */
import webPush from "web-push";

let initialized = false;

function initWebPush() {
  if (initialized) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const mailto = process.env.VAPID_MAILTO ?? "admin@jnu.ac.in";

  if (!publicKey || !privateKey) {
    console.warn(
      "[push] VAPID keys not set — push notifications disabled. " +
      "Run: npx web-push generate-vapid-keys"
    );
    return;
  }

  webPush.setVapidDetails(`mailto:${mailto}`, publicKey, privateKey);
  initialized = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

export interface StoredSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Send a push notification to a single subscription.
 * Returns false (silently) if VAPID keys are not configured.
 */
export async function sendPushNotification(
  subscription: StoredSubscription,
  payload: PushPayload
): Promise<boolean> {
  initWebPush();
  if (!initialized) return false;

  try {
    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
      { TTL: 86400 } // 24h TTL
    );
    return true;
  } catch (err: any) {
    // 410 Gone — subscription expired/revoked
    if (err.statusCode === 410) {
      console.info("[push] subscription gone:", subscription.endpoint);
    } else {
      console.error("[push] send error:", err.message);
    }
    return false;
  }
}

/** Generate VAPID public key for client-side subscription. */
export function getVapidPublicKey(): string {
  return process.env.VAPID_PUBLIC_KEY ?? "";
}
