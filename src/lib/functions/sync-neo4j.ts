import { inngest } from "../inngest/client";
import { syncListingToNeo4j, reconcileAllListings } from "../barter-sync";

/**
 * TRIGGERED SYNC: Atomic update of Neo4j when a listing is created or updated.
 */
export const syncListingCreated = inngest.createFunction(
  { id: "sync-listing-created", name: "Sync Listing to Neo4j" },
  { event: "listing.created" },
  async ({ event, step }) => {
    const { listingId } = event.data;
    
    await step.run("neo4j-sync", async () => {
      return await syncListingToNeo4j(listingId);
    });
  }
);

/**
 * RECONCILIATION: Bulk sync of all listings to fix drift.
 */
export const reconcileGraph = inngest.createFunction(
  { id: "reconcile-graph", name: "Reconcile Neo4j Graph" },
  { event: "admin/reconcile.graph" },
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
