const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("Connected to Neon DB!");

    // Check if enum exists
    const checkEnum = await client.query(`SELECT 1 FROM pg_type WHERE typname = 'VerificationStatus'`);
    if (checkEnum.rows.length === 0) {
      console.log("Creating ENUM type...");
      await client.query(`CREATE TYPE "VerificationStatus" AS ENUM ('PENDING_REVIEW', 'VERIFIED', 'REJECTED')`);
    }

    console.log("Updating column to ENUM...");
    // If there is existing string data, we might need to map it. 
    // Wait, the previous string was 'PENDING', 'COMPLETED', 'FAILED'.
    // The new Enum is 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'.
    await client.query(`UPDATE "VerificationReport" SET status = 'PENDING_REVIEW' WHERE status = 'PENDING'`);
    await client.query(`UPDATE "VerificationReport" SET status = 'VERIFIED' WHERE status = 'COMPLETED'`);
    await client.query(`UPDATE "VerificationReport" SET status = 'REJECTED' WHERE status = 'FAILED'`);

    await client.query(`ALTER TABLE "VerificationReport" ALTER COLUMN status TYPE "VerificationStatus" USING status::text::"VerificationStatus"`);
    
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

main();
