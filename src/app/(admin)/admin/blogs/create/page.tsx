import { BlogForm } from "@/components/admin/BlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogCreatePage() {
  const [tags, towns] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.town.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Post</h1>
          <p className="text-muted-foreground">Draft a new blog post.</p>
        </div>
      </div>

      <div className="p-6 bg-card border rounded-lg">
        <BlogForm tags={tags} towns={towns} />
      </div>
    </div>
  );
}
