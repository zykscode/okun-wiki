"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CheckCircle2, History } from "lucide-react";
import Link from "next/link";

interface PageData {
  id: string;
  title: string;
  slug: string;
  type: string;
  content: string;
  published: boolean;
  order: number;
}

export function PageEditForm({ page }: { page: PageData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [published, setPublished] = useState(page.published);
  const [order, setOrder] = useState(page.order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, published, order }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Failed to save");
        return;
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
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
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-wiki-text">Content</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="title"
                label="Page Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-wiki-text mb-2">Content</label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write the page content here…"
                  minHeight="500px"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-wiki-text">Settings</h2>
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
              <div>
                <label className="block text-sm font-medium text-wiki-text mb-1">Sort Order</label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                />
              </div>
              <p className="text-xs text-wiki-muted">
                Type: {page.type} · Slug: {page.slug}
              </p>

              <div className="pt-4 border-t border-wiki-border">
                <Link href={`/admin/pages/${page.id}/history`}>
                  <Button variant="outline" size="sm" className="w-full" type="button">
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving…" : "Save Changes"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
