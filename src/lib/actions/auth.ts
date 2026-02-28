import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });
  
  if (!user || user.role !== "ADMIN" || user.status !== "ACTIVE") {
    redirect("/");
  }
  
  return session;
}

export async function requireEditor() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });
  
  if (!user || user.status !== "ACTIVE" || !["ADMIN", "EDITOR"].includes(user.role)) {
    redirect("/");
  }
  
  return session;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  return session;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  
  return db.user.findUnique({
    where: { id: session.user.id },
  });
}

export async function logActivity(userId: string, action: string, target: string, details?: string) {
  await db.activityLog.create({
    data: { userId, action, target, details },
  });
}
