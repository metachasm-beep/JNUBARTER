import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const swap = await prisma.swap.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            listing: {
              select: { title: true, type: true, category: true }
            }
          }
        },
        initiator: {
          select: { name: true, image: true, school: true }
        },
        receiver: {
          select: { name: true, image: true, school: true }
        }
      }
    });

    if (!swap) {
      return NextResponse.json({ error: "Swap not found" }, { status: 404 });
    }

    // Only participants can see swap details
    const userId = session.user.id;
    if (swap.initiatorId !== userId && swap.receiverId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ swap });
  } catch (error) {
    console.error("[GET /api/swaps/[id]]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
