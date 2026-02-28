import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { commentId, action } = await req.json();

  if (action === "approve") {
    await db.comment.update({ where: { id: commentId }, data: { approved: true, flagged: false } });
  } else if (action === "reject") {
    await db.comment.update({ where: { id: commentId }, data: { approved: false } });
  } else if (action === "delete") {
    await db.comment.delete({ where: { id: commentId } });
  }

  return NextResponse.json({ success: true });
}
