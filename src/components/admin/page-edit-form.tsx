"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      published: formData.get("published") === "on",
      order: parseInt(formData.get("order") as string) || 0,
    };

    await fetch(`/api/admin/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Content</h2></CardHeader>
            <CardContent className="space-y-4">
              <Input id="title" name="title" label="Page Title" defaultValue={page.title} required />
              <Textarea
                id="content"
                name="content"
                label="Content"
                defaultValue={page.content}
                className="min-h-[500px] font-mono text-sm"
                required
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Settings</h2></CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" defaultChecked={page.published} className="rounded" />
                <span className="text-sm text-wiki-text">Published</span>
              </label>
              <Input id="order" name="order" label="Sort Order" type="number" defaultValue={page.order} />
              <p className="text-xs text-wiki-muted">Type: {page.type} · Slug: {page.slug}</p>
            </CardContent>
          </Card>
          <div className="flex items-center gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            {saved && <span className="text-sm text-green-600 dark:text-green-400">✓ Saved</span>}
          </div>
        </div>
      </div>
    </form>
  );
}
