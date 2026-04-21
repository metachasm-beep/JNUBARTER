import { getNeo4jDriver } from './neo4j';

export interface BarterChain {
  id: string;
  users: { id: string; name: string }[];
  listings: { id: string; title: string }[];
  tags: string[];
}

export async function findBarterChains(userId?: string): Promise<BarterChain[]> {
  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    const userMatch = userId 
      ? `MATCH (u1:User {id: $userId})-[:OFFERS]->(l1:Listing)-[:HAS_TAG]->(t1:Tag)` 
      : `MATCH (u1:User)-[:OFFERS]->(l1:Listing)-[:HAS_TAG]->(t1:Tag)`;
      
    const cypher = `
      ${userMatch}
      MATCH (u1)-[:WANTS_TAG]->(t2:Tag)
      
      MATCH (u2:User)-[:OFFERS]->(l2:Listing)-[:HAS_TAG]->(t2)
      MATCH (u2)-[:WANTS_TAG]->(t3:Tag)
      
      MATCH (u3:User)-[:OFFERS]->(l3:Listing)-[:HAS_TAG]->(t3)
      MATCH (u3)-[:WANTS_TAG]->(t1)
      
      WHERE u1 <> u2 AND u2 <> u3 AND u1 <> u3
      
      RETURN u1.id, u1.name, u2.id, u2.name, u3.id, u3.name, 
             l1.id, l1.title, l2.id, l2.title, l3.id, l3.title, 
             t1.name, t2.name, t3.name
      LIMIT 10
    `;

    const result = await session.run(cypher, userId ? { userId } : {});
    
    return result.records.map(record => ({
      id: Math.random().toString(36).substr(2, 9),
      users: [
        { id: record.get('u1.id') || 'Unknown', name: record.get('u1.name') },
        { id: record.get('u2.id') || 'Unknown', name: record.get('u2.name') },
        { id: record.get('u3.id') || 'Unknown', name: record.get('u3.name') }
      ],
      listings: [
        { id: record.get('l1.id') || 'Unknown', title: record.get('l1.title') },
        { id: record.get('l2.id') || 'Unknown', title: record.get('l2.title') },
        { id: record.get('l3.id') || 'Unknown', title: record.get('l3.title') }
      ],
      tags: [record.get('t1.name'), record.get('t2.name'), record.get('t3.name')]
    }));
  } catch (error) {
    console.error('Neo4j Query Error:', error);
    return [];
  } finally {
    await session.close();
  }
}

export async function syncUserToNeo4j(userId: string, name: string, offers: { id: string, title: string, tags: string[] }[], wants: string[]) {
  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    const cypher = `
      MERGE (u:User {id: $userId})
      SET u.name = $name
      
      WITH u
      UNWIND $offers as offerData
      MERGE (l:Listing {id: offerData.id})
      SET l.title = offerData.title, l.userId = $userId
      MERGE (u)-[:OFFERS]->(l)
      WITH u, l, offerData
      UNWIND offerData.tags as tagName
      MERGE (t:Tag {name: tagName})
      MERGE (l)-[:HAS_TAG]->(t)
      
      WITH u
      UNWIND $wants as wantTag
      MERGE (wt:Tag {name: wantTag})
      MERGE (u)-[:WANTS_TAG]->(wt)
    `;

    await session.run(cypher, { userId, name, offers, wants });
  } finally {
    await session.close();
  }
}
