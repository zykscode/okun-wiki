import { z } from "zod";

export const TagSchema = z.object({
  name: z.string().min(2, "Tag name is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
});

export const BlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(100, "Content must be at least 100 characters"),
  coverImage: z.string().url().optional().nullable(),
  category: z
    .enum(["GENERAL", "HISTORY", "CULTURE", "DEVELOPMENT", "DIASPORA", "INTERVIEW"])
    .default("GENERAL"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tagIds: z.array(z.string().cuid()).default([]),
  relatedTownIds: z.array(z.string().cuid()).default([]),
});

export type BlogPostFormValues = z.infer<typeof BlogPostSchema>;
export type TagFormValues = z.infer<typeof TagSchema>;
