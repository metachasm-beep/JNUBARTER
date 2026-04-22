import { config } from "dotenv";
config(); // Load .env first

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 20) + "...");
  
  const sanitizedUrl = process.env.DATABASE_URL!.trim().replace(/^["']|["']$/g, '').replace(/[\r\n]/g, '').replace(/\s/g, '');
  const adapter = new PrismaNeon({ connectionString: sanitizedUrl });
  const prisma = new PrismaClient({ adapter });

  console.log("Connecting to Prisma...");
  try {
    const count = await prisma.user.count();
    console.log(`TOTAL USERS COUNT: ${count}`);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        reputation: true,
        isVerified: true,
        idCardUrl: true,
        createdAt: true,
        _count: { select: { listings: true, swapsInitiated: true, swapsReceived: true } },
        verificationReports: { take: 1, orderBy: { createdAt: "desc" }, select: { status: true } },
      },
    });

    console.log(`FETCHED USERS: ${users.length}`);
    if (users.length > 0) {
      console.log("First User ID:", users[0].id);
    }
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
