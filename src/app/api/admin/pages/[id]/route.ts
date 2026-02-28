import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/actions/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  // Save version before updating
  const current = await db.townPage.findUnique({ where: { id } });
  if (current) {
    const versionCount = await db.pageVersion.count({ where: { pageId: id } });
    await db.pageVersion.create({
      data: {
        pageId: id,
        content: current.content,
        editSummary: "Auto-saved before edit",
        version: versionCount + 1,
        createdBy: session.user.id,
      },
    });
  }

  const page = await db.townPage.update({ where: { id }, data });
  await logActivity(session.user.id, "edited_page", `page:${page.slug}`, page.title);

  return NextResponse.json(page);
}
