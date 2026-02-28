import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import Link from "next/link";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug }, select: { title: true, excerpt: true } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, bio: true, image: true } } },
  });

  if (!post) notFound();

  // Increment views
  await db.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-wiki-muted hover:text-primary-500 no-underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      {post.coverImage && (
        <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <header className="mb-8">
        <Badge variant="primary" className="mb-3">
          {post.category.charAt(0) + post.category.slice(1).toLowerCase()}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-wiki-text mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-wiki-muted flex-wrap">
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author.name}</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{post.views + 1} views</span>
        </div>
        {post.tags && (
          <div className="flex gap-2 mt-3">
            {post.tags.split(",").map((tag) => (
              <Badge key={tag.trim()} variant="outline">{tag.trim()}</Badge>
            ))}
          </div>
        )}
      </header>

      <div className="wiki-content bg-wiki-card border border-wiki-border rounded-xl p-6 sm:p-8 theme-transition">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Author card */}
      <div className="mt-8 p-6 bg-wiki-card border border-wiki-border rounded-xl theme-transition">
        <p className="text-xs text-wiki-muted uppercase tracking-wider mb-2">Written by</p>
        <h3 className="font-semibold text-wiki-text">{post.author.name}</h3>
        {post.author.bio && <p className="text-sm text-wiki-muted mt-1">{post.author.bio}</p>}
      </div>
    </article>
  );
}
