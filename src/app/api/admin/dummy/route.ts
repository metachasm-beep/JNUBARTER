import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const all = searchParams.get("all") === "true";

  try {
    if (all) {
      const result = await prisma.listing.deleteMany({
        where: { isSystem: true },
      });
      return NextResponse.json({ message: `Deleted ${result.count} dummy entries.` });
    }

    if (id) {
      const result = await prisma.listing.delete({
        where: { id, isSystem: true },
      });
      return NextResponse.json({ message: "Deleted dummy entry." });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dummyEntries = await prisma.listing.findMany({
    where: { isSystem: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(dummyEntries);
}
