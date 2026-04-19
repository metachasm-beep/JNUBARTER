import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendPushNotification, type PushPayload } from "@/lib/push";
import { z } from "zod";

const SendSchema = z.object({
  userIds: z.array(z.string()).min(1).max(100),
  payload: z.object({
    title: z.string().max(100),
    body: z.string().max(300),
    url: z.string().optional(),
  }),
});

/**
 * POST /api/push/send — internal route for sending push notifications.
 * Called by Inngest functions (not directly by the browser).
 * Requires INNGEST_SIGNING_KEY in Authorization header for security.
 */
export async function POST(req: Request) {
  // Require either a session (admin) or an internal signing key
  const authHeader = req.headers.get("authorization");
  const session = await getServerSession(authOptions);

  const isInternalCall =
    authHeader === `Bearer ${process.env.INNGEST_SIGNING_KEY}`;
  const isAdmin = session?.user?.email?.endsWith("@jnu.ac.in");

  if (!isInternalCall && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = SendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { userIds, payload } = parsed.data;

  // Fetch all active subscriptions for these users
  const subscriptions = await (prisma as any).pushSubscription.findMany({
    where: { userId: { in: userIds } },
  });

  if (subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, skipped: "no subscriptions" });
  }

  const pushPayload: PushPayload = {
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/",
    icon: "/icons/icon-192x192.png",
  };

  // Fan out — send to all subscriptions concurrently
  const results = await Promise.allSettled(
    subscriptions.map((sub: any) =>
      sendPushNotification(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        pushPayload
      )
    )
  );

  const sent = results.filter(
    (r) => r.status === "fulfilled" && r.value === true
  ).length;

  return NextResponse.json({ sent, total: subscriptions.length });
}
