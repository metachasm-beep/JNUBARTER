import neo4j, { Driver } from 'neo4j-driver';

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

let driver: Driver;

export const getNeo4jDriver = () => {
  if (!driver) {
    if (!process.env.NEO4J_URI) {
      console.warn('NEO4J_URI not set, defaulting to localhost');
    }
    driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
      )
    );
  }
  return driver;
};

export const closeNeo4jDriver = async () => {
  if (driver) {
    await driver.close();
  }
};
