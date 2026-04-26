import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";

interface Props { params: Promise<{ id: string }> }

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({
    where: { id },
    include: { tags: true }
  });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Edit: {post.title}</h1>
      <BlogForm post={post} />
    </div>
  );
}
