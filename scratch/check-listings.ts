import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.listing.count();
  const flagged = await prisma.listing.count({ where: { isFlagged: true } });
  const offers = await prisma.listing.count({ where: { type: 'OFFER' } });
  const wants = await prisma.listing.count({ where: { type: 'WANT' } });
  
  const sample = await prisma.listing.findMany({
    take: 5,
    include: { user: { select: { isVerified: true, school: true } } }
  });

  console.log("--- Listing Diagnostics ---");
  console.log(`Total Listings: ${total}`);
  console.log(`Flagged: ${flagged}`);
  console.log(`Offers: ${offers}`);
  console.log(`Wants: ${wants}`);
  console.log("\nSample Listings:");
  sample.forEach(l => {
    console.log(`- [${l.id}] ${l.title} (${l.type}) | User Verified: ${l.user.isVerified} | School: ${l.user.school}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
