import { getNeo4jDriver } from '../neo4j';

export async function findTriangularTrades() {
  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (u1:User)-[:WANTS]->(s1:Skill)<-[:OFFERS]-(u2:User),
            (u2)-[:WANTS]->(s2:Skill)<-[:OFFERS]-(u3:User),
            (u3)-[:WANTS]->(s3:Skill)<-[:OFFERS]-(u1:User)
      WHERE u1 <> u2 AND u2 <> u3 AND u3 <> u1
      RETURN 
        u1.name as user1, u2.name as user2, u3.name as user3,
        s1.name as skill1, s2.name as skill2, s3.name as skill3
      LIMIT 5
    `);

    return result.records.map(record => ({
      chain: [
        { from: record.get('user1'), to: record.get('user2'), exchange: record.get('skill1') },
        { from: record.get('user2'), to: record.get('user3'), exchange: record.get('skill2') },
        { from: record.get('user3'), to: record.get('user1'), exchange: record.get('skill3') },
      ]
    }));
  } catch (error) {
    console.error('Neo4j Error:', error);
    return [];
  } finally {
    await session.close();
  }
}
