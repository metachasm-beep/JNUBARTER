import { config } from "dotenv";
config();
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Attempting database connection...");
  try {
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({ 
      take: 5,
      select: { id: true, email: true, name: true }
    });
    console.log("USER_COUNT:", count);
    console.log("SAMPLE_USERS:", JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("DATABASE_ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
