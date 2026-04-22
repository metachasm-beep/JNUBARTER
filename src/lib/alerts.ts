/**
 * BARTER ALERT DISPATCHER
 * Logic for pushing critical system and security events to Discord.
 */

const WEBHOOK_URL = process.env.DISCORD_ALERTS_WEBHOOK;

type AlertType = "SECURITY" | "INFRASTRUCTURE" | "BILLING" | "SYSTEM";

// Simple in-memory cooldown to avoid spam (Reset on server restart)
const cooldownMap = new Map<string, number>();
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export async function sendAlert(type: AlertType, message: string, metadata?: any) {
  if (!WEBHOOK_URL) {
    console.warn(`[Alerts] No webhook configured. Type: ${type}, Message: ${message}`);
    return;
  }

  // Cooldown check
  const now = Date.now();
  const lastAlert = cooldownMap.get(`${type}:${message}`);
  if (lastAlert && now - lastAlert < COOLDOWN_MS) {
    return;
  }
  cooldownMap.set(`${type}:${message}`, now);

  const colors = {
    SECURITY: 15158332, // Red
    INFRASTRUCTURE: 15844367, // Gold
    BILLING: 3447003, // Blue
    SYSTEM: 3066993, // Green
  };

  const payload = {
    embeds: [
      {
        title: `🚨 BARTER Alert: ${type}`,
        description: message,
        color: colors[type] || colors.SYSTEM,
        fields: metadata ? Object.entries(metadata).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true
        })) : [],
        timestamp: new Date().toISOString(),
        footer: { text: "Barter Canary Watch" }
      }
    ]
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      console.error("[Alerts] Discord API failed:", await res.text());
    }
  } catch (err) {
    console.error("[Alerts] Failed to dispatch alert:", err);
  }
}
