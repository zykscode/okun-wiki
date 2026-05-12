import { MetadataRoute } from "next";
import { towns } from "@/data/towns";
import { getBlogPosts } from "@/lib/blog";

const BASE_URL = "https://okunpedia.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/towns`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${BASE_URL}/communities`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const townRoutes: MetadataRoute.Sitemap = towns
    .filter((town) => town.featured || true) // or published if added to town interface
    .map((town) => ({
      url: `${BASE_URL}/towns/${town.slug}`,
      lastModified: new Date(), // Local static data doesn't have updatedAt yet
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...townRoutes, ...blogRoutes];
}
