import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = "https://okunpedia.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [towns, posts] = await Promise.all([
    db.town.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/towns`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/communities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const townRoutes: MetadataRoute.Sitemap = towns.map((town) => ({
    url: `${BASE_URL}/towns/${town.slug}`,
    lastModified: town.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...townRoutes, ...blogRoutes];
}
