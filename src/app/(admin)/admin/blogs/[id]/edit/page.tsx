import { BlogForm } from "@/components/admin/BlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogEditPage({ params }: { params: { id: string } }) {
  const [blog, tags, towns] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        relatedTowns: true,
      },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.town.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground">Update {blog.title}</p>
        </div>
      </div>

      <div className="p-6 bg-card border rounded-lg">
        <BlogForm initialData={blog} tags={tags} towns={towns} />
      </div>
    </div>
  );
}
