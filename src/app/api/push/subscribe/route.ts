import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVapidPublicKey } from "@/lib/push";
import { z } from "zod";

const SubscribeSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
});

/** GET /api/push/subscribe — return VAPID public key for client-side setup */
export async function GET() {
  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return NextResponse.json(
      { error: "Push notifications not configured" },
      { status: 503 }
    );
  }
  return NextResponse.json({ publicKey });
}

/** POST /api/push/subscribe — store a new push subscription */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  try {
    // Upsert by endpoint — handles subscription refresh
    await (prisma as any).pushSubscription.upsert({
      where: { endpoint: parsed.data.endpoint },
      update: {
        p256dh: parsed.data.p256dh,
        auth: parsed.data.auth,
        userId: session.user.id,
      },
      create: {
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.p256dh,
        auth: parsed.data.auth,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[push/subscribe] error:", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

/** DELETE /api/push/subscribe — unsubscribe current user's subscriptions */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { endpoint } = await req.json().catch(() => ({}));

  if (endpoint) {
    await (prisma as any).pushSubscription.deleteMany({
      where: { endpoint, userId: session.user.id },
    });
  } else {
    await (prisma as any).pushSubscription.deleteMany({
      where: { userId: session.user.id },
    });
  }

  return NextResponse.json({ ok: true });
}
