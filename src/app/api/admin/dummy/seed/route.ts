import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const dummyServices = [
  "Python Tutoring", "Graphic Design", "Essay Review", "Yoga Session", "Photography",
  "React Mentorship", "Data Structures Help", "Language Exchange (Spanish)", "Video Editing", "Cooking Class",
  "Career Counseling", "Digital Marketing", "UI/UX Feedback", "Math Tutoring", "Music Lessons",
  "Proofreading", "Social Media Management", "Fitness Coaching", "Financial Planning", "Legal Advice",
  "Carpentry", "Plumbing Help", "Gardening Tips", "Dog Walking", "House Sitting"
];

const dummyCommodities = [
  "Scientific Calculator", "Organic Honey", "Used Textbooks", "Handmade Pottery", "Vinyl Records",
  "Desk Lamp", "Ergonomic Chair", "Noise Cancelling Headphones", "Camera Lens", "Backpack",
  "Study Table", "Yoga Mat", "Sketchbook", "Water Bottle", "Power Bank",
  "Laptop Stand", "Monitor", "Keyboard", "Mouse Pad", "Bike",
  "Plants", "Coffee Grinder", "Tea Set", "Board Games", "Wall Art"
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Ensure a System User exists
    console.log("[Seed] Ensuring system user exists...");
    const systemUser = await prisma.user.upsert({
      where: { email: "system@barter.io" },
      update: { role: "ADMIN" },
      create: {
        id: "cl_system_node", // Fixed ID for stability
        email: "system@barter.io",
        name: "BARTER SYSTEM",
        bio: "Automated reciprocity node for network density.",
        school: "CENTRAL HUB",
        isVerified: true,
        role: "ADMIN",
      },
    });

    const userId = systemUser.id;
    console.log(`[Seed] Using User ID: ${userId}. Creating 50 entries...`);

    // 2. Create 25 Services
    const servicePromises = Array.from({ length: 25 }).map((_, i) => {
      const title = dummyServices[i % dummyServices.length];
      return prisma.listing.create({
        data: {
          userId,
          type: "OFFER",
          category: "SERVICE",
          title: `${title} - ${i + 1}`,
          description: `High-quality academic or professional ${title.toLowerCase()} service within the campus network.`,
          tags: [title.split(" ")[0].toUpperCase(), "ACADEMIC"],
          effortEstimate: i % 3 === 0 ? "LOW" : i % 3 === 1 ? "MEDIUM" : "HIGH",
          isSystem: true,
        },
      });
    });

    // 3. Create 25 Commodities
    const commodityPromises = Array.from({ length: 25 }).map((_, i) => {
      const title = dummyCommodities[i % dummyCommodities.length];
      return prisma.listing.create({
        data: {
          userId,
          type: "OFFER",
          category: "COMMODITY",
          title: `${title} - ${i + 26}`,
          description: `Pre-owned or artisanal ${title.toLowerCase()} available for reciprocity exchange. Quality verified.`,
          tags: [title.split(" ")[0].toUpperCase(), "GOODS"],
          condition: i % 2 === 0 ? "EXCELLENT" : "GOOD",
          isSystem: true,
        },
      });
    });

    const results = await Promise.all([...servicePromises, ...commodityPromises]);
    console.log(`[Seed] Success. Created ${results.length} entries.`);

    return NextResponse.json({ message: "50 entries seeded." });
  } catch (error: any) {
    console.error("[Seed] CRITICAL FAILURE:", error);
    
    // Check if it's a Prisma schema sync error
    if (error.message.includes("isSystem") || error.message.includes("does not exist")) {
      return NextResponse.json({ 
        error: "Database schema is out of sync. Please run 'npx prisma db push' or apply sync_schema.sql.",
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: "Seeding failed. See server logs for details.",
      details: error.message 
    }, { status: 500 });
  }
}
