import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
