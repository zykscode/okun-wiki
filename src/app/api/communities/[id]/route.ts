import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: communityId } = await params;

    if (!communityId) {
      return NextResponse.json({ error: "Community ID is required" }, { status: 400 });
    }

    const community = await db.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                status: true,
                bio: true,
                location: true,
              },
            },
          },
          orderBy: {
            joinedAt: "desc",
          },
        },
        updates: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            updates: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Map `updates` to `articles` to satisfy the frontend component from okunpedia
    const mappedCommunity = {
      ...community,
      articles: community.updates,
      _count: {
        members: community._count.members,
        articles: community._count.updates,
      },
    };

    return NextResponse.json(mappedCommunity);
  } catch (error) {
    console.error("Error fetching community:", error);
    return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 });
  }
}
