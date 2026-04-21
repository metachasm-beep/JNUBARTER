import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { users, realisticServices, realisticCommodities } = await req.json();

    console.log("Cleaning up all previous dummy data...");
    // Delete all system listings
    await prisma.listing.deleteMany({ where: { isSystem: true } });
    // Delete all dummy users
    await prisma.user.deleteMany({ where: { email: { contains: "student_activity" } } });
    await prisma.user.deleteMany({ where: { email: { contains: "@jnu.ac.in" }, isVerified: true, NOT: { email: "metachasm@gmail.com" } } });

    console.log("Injecting fresh users...");
    const createdUsers = [];
    for (const userData of users) {
      const u = await prisma.user.create({ data: userData });
      createdUsers.push(u);
    }

    console.log("Injecting fresh listings...");
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
