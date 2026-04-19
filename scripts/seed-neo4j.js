const neo4j = require('neo4j-driver');
require('dotenv').config();

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

async function seedNeo4j() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    console.log('Seeding Neo4j with mock barter network...');

    // Clear existing data (CAUTION: Only for fresh setup)
    await session.run('MATCH (n) DETACH DELETE n');

    // Create Users and Skills
    const seedQuery = `
      CREATE (u1:User {id: 'user_1', name: 'Alex Chen'})
      CREATE (u2:User {id: 'user_2', name: 'Sarah Miller'})
      CREATE (u3:User {id: 'user_3', name: 'Tom Baker'})
      
      CREATE (s1:Skill {id: 'skill_1', name: 'Next.js Dev'})
      CREATE (s2:Skill {id: 'skill_2', name: 'UI/UX Audit'})
      CREATE (s3:Skill {id: 'skill_3', name: 'Logo Design'})
      
      // The Triangular Chain:
      // Alex OFFERS Next.js Dev, WANTS UI/UX Audit
      // Sarah OFFERS UI/UX Audit, WANTS Logo Design
      // Tom OFFERS Logo Design, WANTS Next.js Dev
      
      CREATE (u1)-[:OFFERS]->(s1)
      CREATE (u1)-[:WANTS]->(s2)
      
      CREATE (u2)-[:OFFERS]->(s2)
      CREATE (u2)-[:WANTS]->(s3)
      
      CREATE (u3)-[:OFFERS]->(s3)
      CREATE (u3)-[:WANTS]->(s1)
    `;

    await session.run(seedQuery);
    console.log('SUCCESS: Neo4j seeded with a perfect triangular trade loop.');

  } catch (error) {
    console.error('FAILED to seed Neo4j:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedNeo4j();
