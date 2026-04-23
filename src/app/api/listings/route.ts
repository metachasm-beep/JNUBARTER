import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { validatePolicy } from "@/lib/agents/policy-guard";
import { embedText, listingToEmbedText, persistListingEmbedding } from "@/lib/embeddings";
import { z } from "zod";
import { listingLimit } from "@/lib/ratelimit";
import { inngest } from "@/lib/inngest/client";
import { sendAlert } from "@/lib/alerts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const category = searchParams.get("category");
    const school = searchParams.get("school");
    const cursor = searchParams.get("cursor"); // pagination
    const take = 20;

    const where: {
      type?: ListingType;
      category?: "SERVICE" | "COMMODITY";
      user?: { school?: { contains: string; mode: "insensitive" } };
    } = {};

    if (typeParam === "OFFER" || typeParam === "WANT") {
      where.type = typeParam as ListingType;
    }
    if (category === "SERVICE" || category === "COMMODITY") {
      where.category = category as "SERVICE" | "COMMODITY";
    }
    if (school) {
      where.user = { school: { contains: school, mode: "insensitive" } };
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            school: true,
            hostel: true,
            reputation: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: take + 1, // fetch one extra to know if there's a next page
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    const hasMore = listings.length > take;
    const data = hasMore ? listings.slice(0, take) : listings;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return NextResponse.json({ listings: data, nextCursor });
  } catch (error) {
    console.error("[GET /api/listings]", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// ─── POST /api/listings — create listing ──────────────────────────────────

const CreateListingSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(1000),
  type: z.enum(["OFFER", "WANT"]),
  category: z.enum(["SERVICE", "COMMODITY"]).default("SERVICE"),
  effortEstimate: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  condition: z.string().max(80).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  images: z.array(z.string().url()).max(5).default([]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🛡️ IDENTITY GATE: Only verified members may post to the marketplace.
  // This enforces the Manual ID Review pipeline end-to-end.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isVerified: true },
  });
  if (!dbUser?.isVerified) {
    return NextResponse.json(
      {
        error: "ID_NOT_VERIFIED",
        message:
          "Your JNU identity has not been verified yet. Please upload your ID card and wait for admin approval before posting.",
      },
      { status: 403 }
    );
  }

  // Ratelimit guard
  const { success } = await listingLimit.limit(session.user.id);
  if (!success) {
    await sendAlert("SECURITY", "User hitting listing rate limit repeatedly", {
      userId: session.user.id,
      email: session.user.email
    });
    return NextResponse.json(
      { error: "Too many listings. Please wait a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = CreateListingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { title, description, type, category, effortEstimate, condition, tags, images } =
    parsed.data;

  // Policy guard — block monetary listings
  const fullText = `${title}. ${description}. ${tags.join(", ")}`;
  const policyResult = await validatePolicy(fullText);
  if (policyResult.isViolating) {
    return NextResponse.json(
      {
        error: "Zero-Money Policy Violation",
        reason: policyResult.reason,
        flagged: policyResult.flaggedContent,
      },
      { status: 422 }
    );
  }

  // Create listing in Postgres
  const listing = await prisma.listing.create({
    data: {
      userId: session.user.id,
      title,
      description,
      type,
      category,
      effortEstimate: effortEstimate ?? null,
      condition: condition ?? null,
      tags,
      images,
    },
    include: {
      user: {
        select: { id: true, name: true, school: true, reputation: true, isVerified: true },
      },
    },
  });

  // Generate embedding asynchronously — never block the response
  // The embedding will be stored via Supabase RPC once ready
  embedText(listingToEmbedText(title, description, tags))
    .then((vec) => {
      if (vec) return persistListingEmbedding(listing.id, vec);
    })
    .catch((err) =>
      console.error("[POST /api/listings] embedding failed:", err)
    );

  // Sync to Neo4j via Inngest
  await inngest.send({
    name: "listing.created",
    data: { listingId: listing.id },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
