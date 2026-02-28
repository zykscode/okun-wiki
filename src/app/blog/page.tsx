import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { PenSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and news from the Ọ̀kun community.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const where = {
    published: true,
    ...(params.category ? { category: params.category as never } : {}),
  };

  const posts = await db.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, image: true } } },
  });

  const categories = ["NEWS", "CULTURE", "HISTORY", "OPINION", "EVENTS", "EDUCATION", "DEVELOPMENT", "GENERAL"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wiki-text">Community Blog</h1>
        <p className="text-wiki-muted mt-2">Articles, news, and stories from the Ọ̀kun community</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Link href="/blog" className={`px-3 py-1.5 rounded-lg text-sm no-underline transition-colors ${!params.category ? "bg-primary-500 text-white" : "bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover"}`}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${cat}`}
            className={`px-3 py-1.5 rounded-lg text-sm no-underline transition-colors ${params.category === cat ? "bg-primary-500 text-white" : "bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover"}`}
          >
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="no-underline block group">
              <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="flex flex-col sm:flex-row gap-4 py-5">
                  {post.coverImage && (
                    <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-primary-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="primary">{post.category.charAt(0) + post.category.slice(1).toLowerCase()}</Badge>
                      <span className="text-xs text-wiki-muted">{formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-wiki-text group-hover:text-primary-500 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-sm text-wiki-muted mt-2 line-clamp-2">{post.excerpt}</p>}
                    <p className="text-xs text-wiki-muted mt-3">By {post.author.name}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <PenSquare className="h-12 w-12 text-wiki-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-wiki-text">No articles yet</h3>
          <p className="text-wiki-muted mt-1">Check back soon for community stories and news.</p>
        </div>
      )}
    </div>
  );
}
