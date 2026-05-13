"use server";

import { prisma } from "@/lib/prisma";
import { BlogPostSchema, TagSchema } from "./schemas";
import { revalidatePath } from "next/cache";

// ─── Tag CRUD ─────────────────────────────────────────────────────────────────

export async function createTag(data: unknown) {
  const parsed = TagSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const tag = await prisma.tag.create({ data: parsed.data });
  revalidatePath("/admin/taxonomy/tags");
  return { data: tag };
}

export async function deleteTag(id: string) {
  const tag = await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/taxonomy/tags");
  return { data: tag };
}

// ─── BlogPost CRUD ────────────────────────────────────────────────────────────

export async function createBlogPost(data: unknown) {
  const parsed = BlogPostSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { tagIds, relatedTownIds, ...postData } = parsed.data;
  const authorId = process.env.ADMIN_USER_IDS?.split(",")[0] ?? "";

  const post = await prisma.blogPost.create({
    data: {
      ...postData,
      authorId,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
      relatedTowns: {
        create: relatedTownIds.map((townId) => ({ townId })),
      },
    },
    include: { tags: true, relatedTowns: true },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { data: post };
}

export async function updateBlogPost(id: string, data: unknown) {
  const parsed = BlogPostSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { tagIds, relatedTownIds, ...postData } = parsed.data;

  // Replace all tags and town relations
  await prisma.blogPostTag.deleteMany({ where: { postId: id } });
  await prisma.blogPostTown.deleteMany({ where: { postId: id } });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...postData,
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
      relatedTowns: {
        create: relatedTownIds.map((townId) => ({ townId })),
      },
    },
    include: { tags: { include: { tag: true } }, relatedTowns: true },
  });

  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { data: post };
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { data: post };
}

export async function toggleBlogPublished(id: string, published: boolean) {
  const post = await prisma.blogPost.update({
    where: { id },
    data: { published },
  });
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { data: post };
}

export async function incrementViews(slug: string) {
  await prisma.blogPost.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}
