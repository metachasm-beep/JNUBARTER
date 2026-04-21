import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const realisticServices = [
  { title: "PhD Thesis Formatting Help", desc: "Assisting with LaTeX or MS Word formatting for social science dissertations." },
  { title: "Statistical Analysis in R", desc: "Help with data visualization and hypothesis testing for research papers." },
  { title: "German Language Tutoring", desc: "Beginner to Intermediate German conversation practice for language students." },
  { title: "Python for Data Science", desc: "Hands-on help with Pandas and NumPy for academic research projects." },
  { title: "Academic Proofreading", desc: "Reviewing essays and papers for grammar, flow, and citation accuracy." },
  { title: "React & Next.js Mentorship", desc: "Guided help for building modern web applications for campus projects." },
  { title: "Yoga & Breathwork Session", desc: "Relaxing morning yoga sessions at the hostels to destress from exams." },
  { title: "Digital Portrait Illustration", desc: "Custom digital art and character design for personal or academic use." },
  { title: "Spanish Conversation Exchange", desc: "Exchange your English/Hindi for Spanish speaking practice." },
  { title: "Career CV & Resume Review", desc: "Help with tailoring your CV for academic or corporate internships." }
];

const realisticCommodities = [
  { title: "Lab Coat (Size M)", desc: "Well-maintained lab coat, perfect for science or biotechnology students." },
  { title: "Casio Scientific Calculator", desc: "Reliable scientific calculator with all advanced functions needed for physics." },
  { title: "GRE Prep Books (Kaplan)", desc: "Slightly used GRE study guides with practice tests and strategy notes." },
  { title: "Ergonomic Desk Chair", desc: "Comfortable chair for long study sessions. Pick up from Tapti hostel." },
  { title: "Kindle Paperwhite", desc: "E-reader in excellent condition, pre-loaded with some academic classics." },
  { title: "Handmade Clay Pottery", desc: "Decorative artisanal pots made in the campus hobby workshop." },
  { title: "Organic Honey (500g)", desc: "Pure honey sourced directly from local producers in the North East." },
  { title: "Noise-Cancelling Headphones", desc: "Great for studying in the library. Bluetooth enabled, 20h battery." },
  { title: "Portable Power Bank (20k mAh)", desc: "Fast charging power bank, essential for long days at the schools." },
  { title: "Reference Book: International Relations", desc: "Standard textbook for SIS students. Good condition, no markings." }
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== "jnu_listing_seed_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Updating 50 dummy listings with realistic content...");
    
    // Fetch all system listings
    const systemListings = await prisma.listing.findMany({
      where: { isSystem: true },
      take: 50
    });

    const updates = systemListings.map((listing, i) => {
      const isService = listing.category === "SERVICE";
      const source = isService ? realisticServices : realisticCommodities;
      const item = source[i % source.length];

      return prisma.listing.update({
        where: { id: listing.id },
        data: {
          title: item.title,
          description: item.desc,
          tags: isService ? ["ACADEMIC", "SKILLS"] : ["GOODS", "CAMPUS"],
        }
      });
    });

    await Promise.all(updates);
    return NextResponse.json({ message: "50 listings updated with realistic data." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
