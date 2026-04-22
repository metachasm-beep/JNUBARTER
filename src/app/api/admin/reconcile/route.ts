import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { inngest } from "@/lib/inngest";

/**
 * TRIGGER RECONCILIATION
 * Manually starts the Neo4j reconciliation background job.
 */
export async function POST() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await inngest.send({
      name: "admin/reconcile.graph",
      data: { triggeredBy: session.user.id },
    });

    return NextResponse.json({ message: "Reconciliation job started." });
  } catch (error) {
    console.error("[RECONCILE_API]", error);
    return new NextResponse("Failed to start job", { status: 500 });
  }
}
