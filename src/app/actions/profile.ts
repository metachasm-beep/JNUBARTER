"use server";

import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { ProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const SecurityLayer = {
  sanitize(text: string): string {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).trim();
  },
};

export async function atomicSyncUserAction(data: z.infer<typeof ProfileSchema>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  const sanitizedBio = SecurityLayer.sanitize(data.bio || "");
  const sanitizedName = SecurityLayer.sanitize(data.name);

  try {
    // 1. Postgres Sync
    const user = await prisma.user.update({
      where: { id: data.userId },
      data: {
        name: sanitizedName,
        bio: sanitizedBio,
        school: data.school,
        hostel: data.hostel,
      },
    });

    // Handle initial listings (Offers)
    if (data.offers && data.offers.length > 0) {
      await prisma.listing.createMany({
        data: data.offers.map((off) => ({
          userId: data.userId,
          title: off.title,
          category: off.category,
          type: "OFFER",
          description: `Initial offering for ${off.title}`,
          effortEstimate: off.effort,
          condition: off.condition,
        })),
        skipDuplicates: true,
      });
    }

    // 2. Neo4j Sync via Inngest
    await inngest.send({
      name: "profile.updated",
      data: {
        userId: data.userId,
        name: sanitizedName,
        offers: data.offers,
        wants: data.wants ?? [],
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("SERVER_ACTION_SYNC_FAILURE:", error);
    throw new Error(`PROFILE_SAVE_FAILED: ${error.message}`);
  }
}
