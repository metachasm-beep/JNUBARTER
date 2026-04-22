import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { users, realisticServices, realisticCommodities, forceClean } = await req.json();

    console.log("Cleaning up all previous dummy data...");
    
    // 1. Delete all listings first (foreign key dependency)
    if (forceClean) {
      // Clear logs first
      await prisma.auditLog.deleteMany({}).catch(() => {});
      await prisma.usageLog.deleteMany({}).catch(() => {});
      await prisma.swap.deleteMany({}).catch(() => {});
      await prisma.listing.deleteMany({});
      console.log("Forced purge of all data complete.");
    } else {
      await prisma.listing.deleteMany({ where: { isSystem: true } });
    }

    // 2. Delete all users except the admin whitelist
    const adminEmails = ["metachasm@gmail.com"];
    await prisma.user.deleteMany({
      where: {
        NOT: { email: { in: adminEmails } }
      }
    });
    console.log("User cleanup complete.");

    console.log("Injecting fresh representative users...");
    const createdUsers = [];
    for (const userData of users) {
      const u = await prisma.user.create({ data: userData });
      createdUsers.push(u);
    }

    console.log("Injecting fresh high-fidelity listings with metadata...");
    const listingPromises = createdUsers.map((user, i) => {
      const isService = i % 2 === 0;
      const source = isService ? realisticServices : realisticCommodities;
      const item = source[i % source.length];

      return prisma.listing.create({
        data: {
          userId: user.id,
          type: "OFFER",
          category: isService ? "SERVICE" : "COMMODITY",
          title: item.title,
          description: item.desc,
          tags: item.tags || [isService ? "SERVICE" : "GOODS", "ACADEMIC"],
          effortEstimate: isService ? (i % 3 === 0 ? "LOW" : i % 3 === 1 ? "MEDIUM" : "HIGH") as any : undefined,
          condition: !isService ? (i % 2 === 0 ? "Good" : "New") : undefined,
          isSystem: true
        }
      });
    });

    await Promise.all(listingPromises);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Reseed final failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
