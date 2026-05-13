import { BlogService } from "@/services/blog.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";

import { BlogInteractions } from "@/features/blog/blog-interactions";
import { ThreadedComments } from "@/features/town/threaded-comments";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function toTitleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export async function generateStaticParams() {
  try {
    const posts = await BlogService.getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.warn(
      "⚠️ Could not fetch blog posts during build time static generation. Pages will be generated on-demand at runtime.",
    );
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author?.name || "Okunpedia"],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) notFound();

  const readTime = readingTime(post.content);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-wiki-muted hover:text-forest-600 dark:hover:text-forest-400 no-underline mb-8 group transition-colors"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to blog
      </Link>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge variant="primary" className="rounded-full">
            {toTitleCase(post.category)}
          </Badge>
          <span className="text-xs text-wiki-muted flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-wiki-text leading-tight mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-wiki-secondary leading-relaxed mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-5 text-sm text-wiki-muted border-t border-wiki-border pt-4">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" aria-hidden="true" />
            <span>{post.author?.name || "Okunpedia"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={post.createdAt.toISOString()}>
              {formatDate(post.createdAt.toISOString())}
            </time>
          </span>
        </div>
      </header>

      {/* Blog Interactions (likes, bookmarks, share) */}
      <BlogInteractions postId={post.id} />

      {/* Article content */}
      <div
        className="wiki-content prose dark:prose-invert max-w-none bg-wiki-card border border-wiki-border rounded-2xl p-6 sm:p-8 theme-transition"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author card */}
      <div className="mt-8 p-6 bg-wiki-card border border-wiki-border rounded-2xl theme-transition flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-forest-600/10 flex items-center justify-center flex-shrink-0">
          <User className="h-6 w-6 text-forest-600 dark:text-forest-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs text-wiki-muted uppercase tracking-wider mb-1">Written by</p>
          <h3 className="font-semibold text-wiki-text">{post.author?.name || "Okunpedia"}</h3>
          <p className="text-sm text-wiki-muted">Okunpedia Editorial Team</p>
        </div>
      </div>

      {/* Threaded comments */}
      <section aria-label="Community discussion" className="mt-10">
        <ThreadedComments pageId={slug} />
      </section>

      {/* Navigation back */}
      <div className="mt-8 pt-6 border-t border-wiki-border">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 dark:text-forest-400 hover:underline no-underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All articles
        </Link>
      </div>
    </article>
  );
}
