import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      name, 
      bio, 
      school, 
      hostel, 
      roomNumber, 
      program, 
      year, 
      dob, 
      gender, 
      phone 
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        school,
        hostel,
        roomNumber,
        program,
        year,
        dob: dob ? new Date(dob) : null,
        gender,
        phone
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
