import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const schools = ["SIS", "SLL&CS", "SSS", "SPS", "SL", "SCSS", "SBT"];
const hostels = ["Tapti", "Mahi", "Mandavi", "Lohit", "Chandrabhaga", "Koyna", "Shipra"];

const serviceTitles = [
  "Python Debugging", "Academic Writing", "Hindi Translation", "React JS Help", 
  "Guitar Lessons", "Statistical Analysis", "UI Design Feedback", "Yoga Coaching",
  "Digital Marketing", "Video Editing", "Cookery Workshop", "French Tutoring"
];

const commodityTitles = [
  "Lab Coat", "Drafter", "Reference Books", "Kindle Paperwhite", "Scientific Calculator",
  "Desk Lamp", "Power Bank", "Water Bottle", "Backpack", "Study Table"
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN" && secret !== "jnu_activity_seed_2026_safe") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Seeding 50 dummy users via API...");
    const userPromises = Array.from({ length: 50 }).map((_, i) => {
      return prisma.user.upsert({
        where: { email: `student_activity_${i}@jnu.ac.in` },
        update: { isVerified: true },
        create: {
          email: `student_activity_${i}@jnu.ac.in`,
          name: `Active Student ${i + 1}`,
          bio: `Active researcher in ${schools[i % schools.length]}. Interested in peer-to-peer reciprocity.`,
          school: schools[i % schools.length],
          hostel: hostels[i % hostels.length],
          isVerified: true,
          reputation: Math.floor(Math.random() * 100),
        }
      });
    });

    const createdUsers = await Promise.all(userPromises);
    const userIds = createdUsers.map(u => u.id);
    console.log(`[Seed] Created/Found ${userIds.length} users.`);

    console.log("Seeding 50 dummy listings via API...");
    const listingPromises = Array.from({ length: 50 }).map((_, i) => {
      const userId = userIds[i % userIds.length];
      const isService = i % 2 === 0;
      const title = isService 
        ? serviceTitles[i % serviceTitles.length] 
        : commodityTitles[i % commodityTitles.length];

      return prisma.listing.create({
        data: {
          userId,
          type: 'OFFER',
          category: isService ? 'SERVICE' : 'COMMODITY',
          title: `${title} #${i+1}`,
          description: `Quality ${title.toLowerCase()} offered for campus exchange. Verified by community standards.`,
          effortEstimate: isService ? (i % 3 === 0 ? 'LOW' : i % 3 === 1 ? 'MEDIUM' : 'HIGH' as any) : undefined,
          condition: !isService ? (i % 2 === 0 ? 'Good' : 'New') : undefined,
          isSystem: true
        }
      });
    });

    await Promise.all(listingPromises);
    console.log("[Seed] Success. 50 users and 50 listings created.");

    return NextResponse.json({ message: "Seeding successful. 50 users and 50 listings created." });
  } catch (error: any) {
    console.error("[Seed] CRITICAL FAILURE:", error);
    return NextResponse.json({ 
      error: "Seeding failed.", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
