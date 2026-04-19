import { getNeo4jDriver } from './neo4j';

export interface BarterChain {
  id: string;
  users: string[];
  listings: string[];
  tags: string[];
}

export async function findBarterChains(): Promise<BarterChain[]> {
  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    // Triangular Trade Pattern: A -> B -> C -> A
    // (u1 offers listing with tag t1, wants tag t2)
    // (u2 offers listing with tag t2, wants tag t3)
    // (u3 offers listing with tag t3, wants tag t1)
    
    const cypher = `
      MATCH (u1:User)-[:OFFERS]->(l1:Listing)-[:HAS_TAG]->(t1:Tag)
      MATCH (u1)-[:WANTS_TAG]->(t2:Tag)
      
      MATCH (u2:User)-[:OFFERS]->(l2:Listing)-[:HAS_TAG]->(t2)
      MATCH (u2)-[:WANTS_TAG]->(t3:Tag)
      
      MATCH (u3:User)-[:OFFERS]->(l3:Listing)-[:HAS_TAG]->(t3)
      MATCH (u3)-[:WANTS_TAG]->(t1)
      
      WHERE u1 <> u2 AND u2 <> u3 AND u1 <> u3
      
      RETURN u1.name, u2.name, u3.name, l1.title, l2.title, l3.title, t1.name, t2.name, t3.name
      LIMIT 5
    `;

    const result = await session.run(cypher);
    
    return result.records.map(record => ({
      id: Math.random().toString(36).substr(2, 9),
      users: [record.get('u1.name'), record.get('u2.name'), record.get('u3.name')],
      listings: [record.get('l1.title'), record.get('l2.title'), record.get('l3.title')],
      tags: [record.get('t1.name'), record.get('t2.name'), record.get('t3.name')]
    }));
  } catch (error) {
    console.error('Neo4j Query Error:', error);
    return [];
  } finally {
    await session.close();
  }
}

export async function syncUserToNeo4j(userId: string, name: string, offers: { title: string, tags: string[] }[], wants: string[]) {
  const driver = getNeo4jDriver();
  const session = driver.session();

  try {
    const cypher = `
      MERGE (u:User {id: $userId})
      SET u.name = $name
      
      WITH u
      UNWIND $offers as offerData
      MERGE (l:Listing {title: offerData.title, userId: $userId})
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
