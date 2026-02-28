"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

const CATEGORIES = ["NEWS", "CULTURE", "HISTORY", "OPINION", "EVENTS", "EDUCATION", "DEVELOPMENT", "GENERAL"];

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string | null;
  published: boolean;
  featured: boolean;
}

export function BlogForm({ post }: { post?: PostData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: formData.get("excerpt") as string || null,
      content: formData.get("content") as string,
      coverImage: formData.get("coverImage") as string || null,
      category: formData.get("category") as string,
      tags: formData.get("tags") as string || null,
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    };

    try {
      const url = post?.id ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Failed to save");
        setLoading(false);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Post Content</h2></CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="title" name="title" label="Title"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (!post) setSlug(slugify(e.target.value)); }}
                required
              />
              <Input id="slug" name="slug" label="URL Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              <Textarea id="excerpt" name="excerpt" label="Excerpt" defaultValue={post?.excerpt || ""} placeholder="Brief summary of the post..." />
              <Textarea
                id="content" name="content" label="Content"
                defaultValue={post?.content || ""}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Write your article here..."
                required
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Publishing</h2></CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" defaultChecked={post?.published} className="rounded" />
                <span className="text-sm text-wiki-text">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" defaultChecked={post?.featured} className="rounded" />
                <span className="text-sm text-wiki-text">Featured</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Details</h2></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wiki-text mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={post?.category || "GENERAL"}
                  className="w-full rounded-lg border border-wiki-border bg-wiki-input px-3 py-2 text-sm text-wiki-text theme-transition cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <Input id="tags" name="tags" label="Tags" placeholder="culture, history, events" defaultValue={post?.tags || ""} />
              <Input id="coverImage" name="coverImage" label="Cover Image URL" defaultValue={post?.coverImage || ""} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
          {post?.id && (
            <Button
              type="button" variant="danger" className="w-full"
              onClick={async () => {
                if (!confirm("Delete this post?")) return;
                await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
                router.push("/admin/blog");
                router.refresh();
              }}
            >
              Delete Post
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
