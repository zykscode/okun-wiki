import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole, AccountStatus } from "@prisma/client";
import { logActivity } from "@/lib/actions/auth";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, role, status } = await req.json();

  const updateData: Record<string, string> = {};
  if (role && Object.values(UserRole).includes(role)) updateData.role = role;
  if (status && Object.values(AccountStatus).includes(status)) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const user = await db.user.update({ where: { id: userId }, data: updateData });
  await logActivity(session.user.id, "updated_user", `user:${user.email}`, JSON.stringify(updateData));

  return NextResponse.json({ success: true });
}
