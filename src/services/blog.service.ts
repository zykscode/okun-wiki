/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Default includes for blog queries
const blogIncludes = {
  tags: { include: { tag: true } },
  relatedTowns: { include: { town: { select: { name: true, slug: true } } } },
  author: { select: { name: true, image: true } },
} satisfies Prisma.BlogPostInclude;

export type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: typeof blogIncludes;
}>;

export const BlogService = {
  /**
   * Fetch all published blog posts
   */
  async getAllPosts(): Promise<BlogPostWithRelations[]> {
    return prisma.blogPost.findMany({
      where: { published: true },
      include: blogIncludes,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Fetch featured blog posts
   */
  async getFeaturedPosts(): Promise<BlogPostWithRelations[]> {
    return prisma.blogPost.findMany({
      where: { published: true, featured: true },
      include: blogIncludes,
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  },

  /**
   * Fetch a single blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: blogIncludes,
    });
  },

  /**
   * Fetch all slugs for static param generation
   */
  async getAllSlugs(): Promise<string[]> {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  },

  /**
   * Fetch posts by category
   */
  async getPostsByCategory(category: any): Promise<BlogPostWithRelations[]> {
    return prisma.blogPost.findMany({
      where: { published: true, category },
      include: blogIncludes,
      orderBy: { createdAt: "desc" },
    });
  },
};
