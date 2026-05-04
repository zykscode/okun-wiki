"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sanitizeHtml } from "@/lib/sanitize";

export async function addComment(data: { content: string; townId: string; parentId?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to comment");
  }

  const sanitizedContent = sanitizeHtml(data.content);

  const comment = await db.comment.create({
    data: {
      content: sanitizedContent,
      townId: data.townId,
      parentId: data.parentId || null,
      authorId: session.user.id,
    },
  });

  // We should also revalidate the specific town path to show the comment immediately
  // But we need the town slug for that. We'll just revalidate the layout or specific paths.
  revalidatePath(`/towns/[slug]`, "page");
  return comment;
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const comment = await db.comment.findUnique({
    where: { id },
    select: { authorId: true },
  });

  // Basic check: only author can delete (in a real app, admins can too)
  if (!comment || comment.authorId !== session.user.id) {
    throw new Error("Unauthorized to delete this comment");
  }

  await db.comment.delete({ where: { id } });
  revalidatePath(`/towns/[slug]`, "page");
}
