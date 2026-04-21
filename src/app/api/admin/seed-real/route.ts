import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const firstNames = ["Arjun", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Amit", "Ishita", "Karan", "Pooja", "Siddharth", "Kavita", "Rohan", "Meera", "Aditya", "Zoya", "Manish", "Riya", "Varun", "Tanvi"];
const lastNames = ["Sharma", "Verma", "Iyer", "Singh", "Kapoor", "Gupta", "Reddy", "Malhotra", "Joshi", "Das", "Nair", "Patel", "Chopra", "Deshmukh", "Banerjee", "Khan", "Trivedi", "Menon", "Bose", "Kulkarni"];
const schools = ["SIS", "SSS", "SLLCS", "SCSS", "SPS", "SBT", "SL"];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== "jnu_real_seed_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Updating 50 dummy users with realistic names...");
    const updates = [];
    
    for (let i = 0; i < 50; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fName} ${lName}`;
      const school = schools[i % schools.length].toLowerCase();
      const realEmail = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@jnu.ac.in`;
      
      // We look for the previous dummy entries by their old email pattern
      const update = prisma.user.updateMany({
        where: { email: `student_activity_${i}@jnu.ac.in` },
        data: {
          name: fullName,
          email: realEmail,
          bio: `Final year research student at ${schools[i % schools.length]}. Specialized in academic exchange and peer collaboration.`,
        }
      });
      updates.push(update);
    }

    await Promise.all(updates);
    return NextResponse.json({ message: "50 users updated with realistic identities." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
