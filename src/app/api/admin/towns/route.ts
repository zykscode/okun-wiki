import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/actions/auth";
import { sanitizeHtml } from "@/lib/sanitize";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || user.role !== "ADMIN") return null;
  return session.user.id;
}

export async function POST(req: NextRequest) {
  const userId = await checkAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const data = await req.json();
  try {
    const town = await db.town.create({
      data: { ...data, overview: sanitizeHtml(data.overview || ""), createdById: userId },
    });
    await logActivity(userId, "created_town", `town:${town.slug}`, town.name);
    return NextResponse.json(town, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create town";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
