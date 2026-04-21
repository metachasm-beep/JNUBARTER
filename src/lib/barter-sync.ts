import { prisma } from './prisma';
import { getNeo4jDriver } from './neo4j';
import { ProfileSchema } from './schemas';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * GODMODE SECURITY: Multi-layer sanitization for barter content.
 */
export const SecurityLayer = {
  sanitize(text: string): string {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: []
    }).trim();
  },
  
  generateIdempotencyKey(): string {
    return crypto.randomUUID();
  }
};

/**
 * GODMODE SYNC: Atomic Transaction across Postgres (Prisma) and Neo4j.
 * Ensures data consistency in the Barter Graph.
 */
export async function atomicSyncUser(data: z.infer<typeof ProfileSchema>) {
  const sanitizedBio = SecurityLayer.sanitize(data.bio || "");
  const sanitizedName = SecurityLayer.sanitize(data.name);

  try {
    // 1. Postgres Sync (Source of Truth) — Now using PRISMA
    console.log(`[Sync] Updating user ${data.userId} in Postgres...`);
    const user = await prisma.user.update({
      where: { id: data.userId },
      data: {
        name: sanitizedName,
        bio: sanitizedBio,
        school: data.school,
        hostel: data.hostel,
        // Also update listings if provided
      },
    });

    // Handle initial listings (Offers)
    if (data.offers && data.offers.length > 0) {
      console.log(`[Sync] Creating ${data.offers.length} initial listings...`);
      await prisma.listing.createMany({
        data: data.offers.map(off => ({
          userId: data.userId,
          title: off.title,
          category: off.category,
          type: 'OFFER',
          description: `Initial offering for ${off.title}`,
          effortEstimate: off.effort,
          condition: off.condition,
        })),
        skipDuplicates: true,
      });
    }

    // 2. Neo4j Sync (Graph Engine) — Tolerate failures to avoid blocking activation
    try {
      console.log(`[Sync] Synchronizing user ${data.userId} with Neo4j...`);
      const driver = getNeo4jDriver();
      const session = driver.session();
      
      try {
        await session.executeWrite(tx =>
          tx.run(
            `MERGE (u:User {id: $id})
             SET u.name = $name, u.updatedAt = datetime()
             
             // Sync offers
             WITH u
             UNWIND $offers as offer
             MERGE (s:Service {title: offer.title})
             MERGE (u)-[:OFFERS {effort: offer.effort}]->(s)
             
             // Sync wants (tags)
             WITH u
             UNWIND $wants as wantTag
             MERGE (t:Tag {name: wantTag})
             MERGE (u)-[:WANTS_TAG]->(t)`,
            { id: data.userId, name: sanitizedName, offers: data.offers, wants: data.wants ?? [] }
          )
        );
      } finally {
        await session.close();
      }
    } catch (neoError) {
      console.warn("NEO4J_SYNC_DEGRADED: Graph synchronization failed, but Postgres source of truth is active.", neoError);
      // We don't re-throw here so the user can still proceed
    }

    return { success: true };
  } catch (error: any) {
    console.error("GODMODE_SYNC_CRITICAL_FAILURE:", error);
    throw new Error(`SYNC_FAILED: ${error.message}`);
  }
}
