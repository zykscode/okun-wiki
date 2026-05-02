import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import DOMPurify from "isomorphic-dompurify";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const townId = searchParams.get("townId");
    const pageId = searchParams.get("pageId");

    if (!townId && !pageId) {
      return NextResponse.json({ error: "townId or pageId required" }, { status: 400 });
    }

    const comments = await db.comment.findMany({
      where: {
        ...(townId ? { townId } : {}),
        ...(pageId ? { pageId } : {}),
        parentId: null, // Only top-level comments
        approved: true,
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true } },
        replies: {
          where: { approved: true },
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, image: true } },
            // Could go deeper if needed, but 1 level is good for now
          }
        }
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, townId, pageId, parentId } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Sanitize input to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content);

    const comment = await db.comment.create({
      data: {
        content: sanitizedContent,
        townId: townId || null,
        pageId: pageId || null,
        parentId: parentId || null,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[COMMENTS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
