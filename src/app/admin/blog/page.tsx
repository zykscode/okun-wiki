import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-wiki-text">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-wiki-text">{post.title}</h3>
                  {post.published ? (
                    <Badge variant="primary">
                      <Eye className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                  <Badge variant="earth">{post.category}</Badge>
                </div>
                <p className="text-sm text-wiki-muted mt-1">
                  By {post.author.name} · {formatDate(post.updatedAt)} · {post.views} views
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-wiki-muted py-12">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}
