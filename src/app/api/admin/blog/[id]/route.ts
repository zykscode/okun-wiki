import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/actions/auth";

async function checkEditor() {
  const session = await auth()
  if (!session?.user?.id) return null
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) return null
  return session.user.id
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await checkEditor();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const data = await req.json();
  try {
    const post = await db.blogPost.update({ where: { id }, data });
    await logActivity(userId, "updated_post", `post:${post.slug}`, post.title);
    return NextResponse.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await checkEditor();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  try {
    const post = await db.blogPost.delete({ where: { id } });
    await logActivity(userId, "deleted_post", `post:${post.slug}`, post.title);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}
