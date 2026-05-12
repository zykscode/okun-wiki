import { BlogService } from "@/services/blog.service";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { PenSquare, Clock, User } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles, stories, and news from the Okun community. Explore culture, history, and development.",
};

const CATEGORIES = [
  "NEWS",
  "CULTURE",
  "HISTORY",
  "OPINION",
  "EVENTS",
  "EDUCATION",
  "DEVELOPMENT",
  "GENERAL",
];

function toTitleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  let posts = await BlogService.getAllPosts();

  if (params.category) {
    posts = posts.filter((p) => p.category === params.category);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest-600 dark:text-forest-400 mb-2">
          Community Blog
        </p>
        <h1 className="text-4xl font-display font-bold text-wiki-text">Stories from Okun Land</h1>
        <p className="text-wiki-muted mt-2 text-lg">
          Articles, news, and culture from the heart of Kogi State.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8" role="navigation" aria-label="Filter by category">
        <Link
          href="/blog"
          className={`px-3 py-1.5 rounded-full text-sm font-medium no-underline transition-all ${
            !params.category
              ? "bg-forest-600 text-white shadow-sm"
              : "bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${cat}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium no-underline transition-all ${
              params.category === cat
                ? "bg-forest-600 text-white shadow-sm"
                : "bg-wiki-card border border-wiki-border text-wiki-muted hover:bg-wiki-hover"
            }`}
          >
            {toTitleCase(cat)}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="no-underline block group"
              aria-label={`Read: ${post.title}`}
            >
              <article className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-0.5">
                <div className="flex flex-col sm:flex-row gap-0 sm:gap-0">
                  {post.coverImage && (
                    <div className="relative w-full sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-forest-50 dark:bg-forest-900/20">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 224px"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="primary" className="rounded-full text-xs">
                          {toTitleCase(post.category)}
                        </Badge>
                        <span className="text-xs text-wiki-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {readingTime(post.content)}
                        </span>
                      </div>
                      <h2 className="text-xl font-display font-semibold text-wiki-text group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-wiki-muted mt-2 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-wiki-border text-xs text-wiki-muted">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" aria-hidden="true" />
                        {post.author}
                      </span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span className="ml-auto text-forest-600 dark:text-forest-400 font-medium group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-wiki-hover mb-4">
            <PenSquare className="h-8 w-8 text-wiki-muted" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-wiki-text">No articles yet</h3>
          <p className="text-wiki-muted mt-1 text-sm">
            {params.category
              ? `No articles in "${toTitleCase(params.category)}" yet. Try another category.`
              : "Check back soon for community stories and news."}
          </p>
        </div>
      )}
    </div>
  );
}
