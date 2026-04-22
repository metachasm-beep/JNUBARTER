import { prisma } from './prisma';
import { getNeo4jDriver } from './neo4j';
import { ProfileSchema } from './schemas';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';


/**
 * SYNC PROFILE: Extracted Neo4j sync logic. Used by the Inngest background event.
 */
export async function syncProfileToNeo4j(userId: string, name: string, offers: any[], wants: string[]) {
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
        { id: userId, name: name, offers: offers, wants: wants }
      )
    );
  } finally {
    await session.close();
  }
}

/**
 * SYNC LISTING: Ensures a single listing is mirrored in Neo4j.
 */
export async function syncListingToNeo4j(listingId: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true }
    });

    if (!listing) return;

    const driver = getNeo4jDriver();
    const session = driver.session();

    try {
      await session.executeWrite(tx =>
        tx.run(
          `MERGE (u:User {id: $userId})
           MERGE (l:Listing {id: $listingId})
           SET l.title = $title, 
               l.type = $type, 
               l.category = $category,
               l.updatedAt = datetime()
           MERGE (u)-[:POSTED]->(l)
           
           // Clean old tags and re-link
           WITH l
           OPTIONAL MATCH (l)-[r:TAGGED]->()
           DELETE r
           
           WITH l
           UNWIND $tags as tagName
           MERGE (t:Tag {name: tagName})
           MERGE (l)-[:TAGGED]->(t)`,
          { 
            userId: listing.userId, 
            listingId: listing.id,
            title: listing.title,
            type: listing.type,
            category: listing.category,
            tags: listing.tags
          }
        )
      );
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error(`[Neo4jSync] Failed to sync listing ${listingId}:`, error);
    throw error;
  }
}

/**
 * RECONCILE ALL: Bulk sync of all Prisma listings to Neo4j.
 */
export async function reconcileAllListings() {
  const listings = await prisma.listing.findMany();
  console.log(`[Reconcile] Syncing ${listings.length} listings to Neo4j...`);

  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    // We use a single heavy transaction for reconciliation (or we could batch)
    // For now, we'll do it in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < listings.length; i += chunkSize) {
      const chunk = listings.slice(i, i + chunkSize);
      await session.executeWrite(tx =>
        tx.run(
          `UNWIND $batch as item
           MERGE (u:User {id: item.userId})
           MERGE (l:Listing {id: item.id})
           SET l.title = item.title,
               l.type = item.type,
               l.category = item.category,
               l.updatedAt = datetime()
           MERGE (u)-[:POSTED]->(l)
           
           WITH l, item
           UNWIND item.tags as tagName
           MERGE (t:Tag {name: tagName})
           MERGE (l)-[:TAGGED]->(t)`,
          { batch: chunk }
        )
      );
      console.log(`[Reconcile] Synced chunk ${i / chunkSize + 1}`);
    }
    
    // Prune stale listings
    const listingIds = listings.map(l => l.id);
    await session.executeWrite(tx =>
      tx.run(
        `MATCH (l:Listing)
         WHERE NOT l.id IN $validIds
         DETACH DELETE l`,
        { validIds: listingIds }
      )
    );

    return { total: listings.length };
  } finally {
    await session.close();
  }
}
