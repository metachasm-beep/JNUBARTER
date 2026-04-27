import { inngest } from "../inngest/client";
import { syncListingToNeo4j, reconcileAllListings, syncProfileToNeo4j } from "../barter-sync";

/**
 * TRIGGERED SYNC: Atomic update of Neo4j when a listing is created or updated.
 */
export const syncListingCreated = inngest.createFunction(
  { 
    id: "sync-listing-created", 
    name: "Sync Listing to Neo4j",
    triggers: [{ event: "barter/listing.approved" }]
  },
  async ({ event, step }) => {
    const { listingId } = event.data;
    
    await step.run("neo4j-sync", async () => {
      return await syncListingToNeo4j(listingId);
    });
  }
);

/**
 * TRIGGERED SYNC: Atomic update of Neo4j when a user profile is created/updated.
 */
export const syncProfileUpdated = inngest.createFunction(
  { 
    id: "sync-profile-updated", 
    name: "Sync Profile to Neo4j",
    triggers: [{ event: "profile.updated" }]
  },
  async ({ event, step }) => {
    const { userId, name, offers, wants } = event.data;
    
    await step.run("neo4j-sync-profile", async () => {
      return await syncProfileToNeo4j(userId, name, offers, wants);
    });
  }
);

/**
 * RECONCILIATION: Bulk sync of all listings to fix drift.
 */
export const reconcileGraph = inngest.createFunction(
  { 
    id: "reconcile-graph", 
    name: "Reconcile Neo4j Graph",
    triggers: [{ event: "admin/reconcile.graph" }]
  },
  async ({ step }) => {
    const result = await step.run("bulk-reconcile", async () => {
      return await reconcileAllListings();
    });

    return { 
      message: "Graph reconciliation complete",
      stats: result
    };
  }
);
