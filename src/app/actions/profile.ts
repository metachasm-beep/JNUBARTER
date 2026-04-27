"use server";

import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { ProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const SecurityLayer = {
  sanitize(text: string): string {
    if (!text) return "";
    // Aggressive regex to strip HTML tags for server-side safety
    return text.replace(/<[^>]*>?/gm, "").trim();
  },
};

export type SyncResult = { success: true; error?: never } | { success: false; error: string };

export async function atomicSyncUserAction(data: z.infer<typeof ProfileSchema>): Promise<SyncResult> {
  console.log(`[atomicSyncUserAction] Initializing for user: ${data.userId}`);
  
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.error("[atomicSyncUserAction] Unauthorized attempt detected.");
    return { success: false, error: "UNAUTHORIZED" };
  }

  const sanitizedBio = SecurityLayer.sanitize(data.bio || "");
  const sanitizedName = SecurityLayer.sanitize(data.name);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update User Profile
      await tx.user.update({
        where: { id: data.userId },
        data: {
          name: sanitizedName,
          bio: sanitizedBio,
          school: data.school,
          hostel: data.hostel,
        },
      });

      // 2. Handle Initial Listings (Offers)
      if (data.offers && data.offers.length > 0) {
        // Convert to individual creates if createMany causes issues, but createMany is preferred
        await tx.listing.createMany({
          data: data.offers.map((off) => ({
            userId: data.userId,
            title: off.title.toUpperCase(),
            category: off.category,
            type: "OFFER",
            description: `Initial offering for ${off.title}`,
            effortEstimate: off.effort,
            condition: off.condition,
          })),
          skipDuplicates: true,
        });
      }

      return { success: true } as SyncResult;
    });

    // 3. Neo4j Sync via Inngest (Non-blocking for DB transaction)
    try {
      await inngest.send({
        name: "profile.updated",
        data: {
          userId: data.userId,
          name: sanitizedName,
          offers: data.offers,
          wants: data.wants ?? [],
        },
      });
    } catch (inngestErr) {
      console.warn("[atomicSyncUserAction] Inngest sync failed but DB was updated:", inngestErr);
      // We don't fail the user request if only the background sync fails
    }

    return result;
  } catch (error: any) {
    console.error("[atomicSyncUserAction] CRITICAL_FAILURE:", error);
    return { 
      success: false, 
      error: error.message || "Database synchronization failed" 
    };
  }
}
