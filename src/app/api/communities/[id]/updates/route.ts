import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Simple in-memory rate limiting map: userId -> timestamp of last post
// Note: In a production serverless environment, use Upstash Redis.
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: communityId } = await params;
    if (!communityId) {
      return NextResponse.json({ error: "Community ID requires" }, { status: 400 });
    }

    const updates = await db.communityUpdate.findMany({
      where: { communityId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: [{ isSOS: "desc" }, { createdAt: "desc" }],
      take: 20,
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const now = Date.now();
    const lastPostTime = rateLimitMap.get(userId);

    if (lastPostTime && now - lastPostTime < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json(
        { error: "You are posting too frequently. Please wait a minute." },
        { status: 429 },
      );
    }

    // Update rate limit timestamp
    rateLimitMap.set(userId, now);

    const { id: communityId } = await params;
    const { content, isSOS } = await req.json();

    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const newUpdate = await db.communityUpdate.create({
      data: {
        content,
        isSOS: !!isSOS,
        authorId: session.user.id,
        communityId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
  }
}
