import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/actions/auth";
import { sanitizeHtml } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await req.json();
  const { tags, ...postData } = data;

  // Process tags: "culture, history" -> connectOrCreate
  const tagList = typeof tags === "string" 
    ? tags.split(",").map(t => t.trim()).filter(Boolean) 
    : [];
  
  const tagConnectOrCreate = tagList.map(name => ({
    where: { name },
    create: { name }
  }));

  try {
    const post = await db.blogPost.create({
      data: { 
        ...postData, 
        content: sanitizeHtml(postData.content || ""), 
        authorId: session.user.id,
        tags: {
          connectOrCreate: tagConnectOrCreate
        }
      },
    });
    await logActivity(session.user.id, "created_post", `post:${post.slug}`, post.title);
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
