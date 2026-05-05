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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await checkAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const data = await req.json();
  try {
    const town = await db.town.update({
      where: { id },
      data: {
        ...data,
        overview: data.overview !== undefined ? sanitizeHtml(data.overview) : undefined,
      },
    });
    await logActivity(userId, "updated_town", `town:${town.slug}`, town.name);
    return NextResponse.json(town);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await checkAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  try {
    const town = await db.town.delete({ where: { id } });
    await logActivity(userId, "deleted_town", `town:${town.slug}`, town.name);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}
