const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const client = new Client({ connectionString });
  
  console.log("Connecting to Postgres...");
  try {
    await client.connect();
    console.log("Connected!");
    const res = await client.query('SELECT count(*) FROM "User"');
    console.log("RESULT:", res.rows[0]);
  } catch (err) {
    console.error("CONN_ERROR:", err.message);
  } finally {
    await client.end();
  }
}

main();
