"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { slugify } from "@/lib/utils";

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

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  tags?: string | { id: string; name: string }[] | null;
  published: boolean;
  featured: boolean;
}

export function BlogForm({ post }: { post?: PostData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [category, setCategory] = useState(post?.category || "GENERAL");
  const [tags, setTags] = useState(
    Array.isArray(post?.tags)
      ? post.tags.map((t: { id: string; name: string }) => t.name).join(", ")
      : (post?.tags as string) || "",
  );
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = post?.id ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || null,
          content,
          coverImage: coverImage || null,
          category,
          tags: tags || null,
          published,
          featured,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Failed to save");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
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
            <CardHeader>
              <h2 className="font-semibold text-wiki-text">Post Content</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="title"
                label="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!post) setSlug(slugify(e.target.value));
                }}
                required
              />
              <Input
                id="slug"
                label="URL Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <Textarea
                id="excerpt"
                label="Excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post…"
              />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-wiki-text">Content</label>
                  <span className="text-xs text-wiki-muted">
                    Auto-saving drafted to localStorage
                  </span>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <RichTextEditor
                    content={content}
                    onChange={(val) => {
                      setContent(val);
                      localStorage.setItem("blog_draft", val);
                    }}
                    placeholder="Write your article here…"
                    minHeight="500px"
                  />
                  <div
                    className="hidden xl:block prose dark:prose-invert max-w-none border border-wiki-border rounded-lg p-6 bg-wiki-card overflow-y-auto"
                    style={{ maxHeight: "500px" }}
                  >
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      <p className="text-wiki-muted text-center mt-20">Live Preview</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-wiki-text">Publishing</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-wiki-text">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-wiki-text">Featured</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-wiki-text">Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wiki-text mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-wiki-border bg-wiki-input px-3 py-2 text-sm text-wiki-text cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                id="tags"
                label="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="culture, history, kabba"
              />
              <Input
                id="coverImage"
                label="Cover Image URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://…"
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : post ? "Update Post" : "Create Post"}
          </Button>
          {post?.id && (
            <Button
              type="button"
              variant="danger"
              className="w-full"
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
