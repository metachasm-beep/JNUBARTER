import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

export const getNeo4jDriver = () => {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    if (typeof window === 'undefined') {
      console.log(`[Neo4j] Connecting to ${uri.split('@').pop()} as ${user}`);
    }

    try {
      driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
        maxConnectionPoolSize: 10,
        connectionTimeout: 10000, // 10s
      });
    } catch (err) {
      console.error("[Neo4j] Initialization failed:", err);
      throw err;
    }
  }
  return driver;
};

export const closeNeo4jDriver = async () => {
  if (driver) {
    await driver.close();
  }
};
