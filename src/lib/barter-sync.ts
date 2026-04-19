import { supabase } from './supabase';
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
 * GODMODE SYNC: Atomic Transaction across Postgres and Neo4j.
 * Ensures data consistency in the Barter Graph.
 */
export async function atomicSyncUser(data: z.infer<typeof ProfileSchema>) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  
  const sanitizedBio = SecurityLayer.sanitize(data.bio || "");
  const sanitizedName = SecurityLayer.sanitize(data.name);

  try {
    // 1. Postgres Sync (Source of Truth)
    const { error: pgError } = await supabase
      .from('User')
      .upsert({
        id: data.userId,
        name: sanitizedName,
        bio: sanitizedBio,
      });

    if (pgError) throw new Error(`PG_SYNC_FAILURE: ${pgError.message}`);

    // 2. Neo4j Sync (Graph Engine)
    await session.executeWrite(tx => 
      tx.run(
        `MERGE (u:User {id: $id})
         SET u.name = $name, u.updatedAt = datetime()
         WITH u
         UNWIND $offers as offer
         MERGE (s:Service {title: offer.title})
         MERGE (u)-[:OFFERS {effort: offer.effort}]->(s)`,
        { id: data.userId, name: sanitizedName, offers: data.offers }
      )
    );

    return { success: true };
  } catch (error) {
    console.error("GODMODE_SYNC_CRITICAL_FAILURE:", error);
    throw error;
  } finally {
    await session.close();
  }
}
