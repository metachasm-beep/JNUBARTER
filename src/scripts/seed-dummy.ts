import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  console.log("Seeding dummy data...");

  // 1. Ensure a System User exists
  const systemUser = await prisma.user.upsert({
    where: { email: "system@barter.io" },
    update: {},
    create: {
      email: "system@barter.io",
      name: "BARTER SYSTEM",
      bio: "Automated reciprocity node for network density.",
      school: "CENTRAL HUB",
      isVerified: true,
      role: "ADMIN",
    },
  });

  const userId = systemUser.id;

  // 2. Create 25 Services
  for (let i = 0; i < 25; i++) {
    const title = dummyServices[i % dummyServices.length];
    await prisma.listing.create({
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
  }

  // 3. Create 25 Commodities
  for (let i = 0; i < 25; i++) {
    const title = dummyCommodities[i % dummyCommodities.length];
    await prisma.listing.create({
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
  }

  console.log("Seeding completed: 50 dummy entries created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
