import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const firstNames = ["Arjun", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Amit", "Ishita", "Karan", "Pooja", "Siddharth", "Kavita", "Rohan", "Meera", "Aditya", "Zoya", "Manish", "Riya", "Varun", "Tanvi"];
const lastNames = ["Sharma", "Verma", "Iyer", "Singh", "Kapoor", "Gupta", "Reddy", "Malhotra", "Joshi", "Das", "Nair", "Patel", "Chopra", "Deshmukh", "Banerjee", "Khan", "Trivedi", "Menon", "Bose", "Kulkarni"];
const schools = ["SIS", "SSS", "SLLCS", "SCSS", "SPS", "SBT", "SL"];
const hostels = ["Tapti", "Mahi-Mandavi", "Koyna", "Sabarmati", "Jhelum", "Chenab", "Lohit", "Chandrabhaga"];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== "jnu_force_real_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Force cleaning old dummy users...");
    await prisma.user.deleteMany({
      where: { email: { startsWith: "student_activity_" } }
    });

    console.log("Creating 50 fresh realistic users...");
    const usersData = Array.from({ length: 50 }).map((_, i) => {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const school = schools[i % schools.length];
      const hostel = hostels[i % hostels.length];
      
      return {
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i+100}@jnu.ac.in`, // Use i+100 to avoid conflicts
        name: `${fName} ${lName}`,
        bio: `Research scholar at ${school}. Passionate about academic reciprocity and peer support.`,
        school: school,
        hostel: hostel,
        isVerified: true,
        reputation: Math.floor(Math.random() * 50) + 10,
        role: "USER" as any
      };
    });

    // We can't use createMany because of potential unique constraints or adapter limits, so we use Promise.all
    const userPromises = usersData.map(data => prisma.user.create({ data }));
    await Promise.all(userPromises);

    return NextResponse.json({ message: "50 realistic users created from scratch." });
  } catch (error: any) {
    console.error("Force real users failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
