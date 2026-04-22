import { config } from "dotenv";
config();
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Fetching users...");
  try {
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

    console.log(`Fetched ${users.length} users.`);
    if (users.length > 0) {
      console.log("Sample user:", JSON.stringify(users[0], null, 2));
    }
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
