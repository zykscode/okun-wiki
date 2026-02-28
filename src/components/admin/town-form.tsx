"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

interface TownData {
  id?: string;
  name: string;
  slug: string;
  tagline: string | null;
  lga: string;
  state: string;
  coordinates: string | null;
  population: number | null;
  founded: string | null;
  overview: string;
  metaDescription: string | null;
  published: boolean;
  featured: boolean;
}

export function TownForm({ town }: { town?: TownData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(town?.name || "");
  const [slug, setSlug] = useState(town?.slug || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      tagline: formData.get("tagline") as string || null,
      lga: formData.get("lga") as string,
      state: formData.get("state") as string || "Kogi",
      coordinates: formData.get("coordinates") as string || null,
      population: formData.get("population") ? parseInt(formData.get("population") as string) : null,
      founded: formData.get("founded") as string || null,
      overview: formData.get("overview") as string,
      metaDescription: formData.get("metaDescription") as string || null,
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    };

    try {
      const url = town?.id ? `/api/admin/towns/${town.id}` : "/api/admin/towns";
      const method = town?.id ? "PUT" : "POST";
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

      router.push("/admin/towns");
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
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Basic Info</h2></CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="name"
                name="name"
                label="Town Name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (!town) setSlug(slugify(e.target.value)); }}
                required
              />
              <Input
                id="slug"
                name="slug"
                label="URL Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <Input id="tagline" name="tagline" label="Tagline" defaultValue={town?.tagline || ""} />
              <Textarea
                id="overview"
                name="overview"
                label="Overview"
                defaultValue={town?.overview || ""}
                className="min-h-[200px]"
                required
              />
              <Textarea id="metaDescription" name="metaDescription" label="Meta Description (SEO)" defaultValue={town?.metaDescription || ""} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Publishing</h2></CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" defaultChecked={town?.published} className="rounded" />
                <span className="text-sm text-wiki-text">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" defaultChecked={town?.featured} className="rounded" />
                <span className="text-sm text-wiki-text">Featured on homepage</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Location</h2></CardHeader>
            <CardContent className="space-y-4">
              <Input id="lga" name="lga" label="LGA" defaultValue={town?.lga || ""} required />
              <Input id="state" name="state" label="State" defaultValue={town?.state || "Kogi"} />
              <Input id="coordinates" name="coordinates" label="Coordinates" placeholder="lat,lng" defaultValue={town?.coordinates || ""} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold text-wiki-text">Details</h2></CardHeader>
            <CardContent className="space-y-4">
              <Input id="population" name="population" label="Population" type="number" defaultValue={town?.population || ""} />
              <Input id="founded" name="founded" label="Founded" placeholder="e.g. Pre-15th century" defaultValue={town?.founded || ""} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : town ? "Update Town" : "Create Town"}
          </Button>
          {town && (
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={async () => {
                if (!confirm("Delete this town? This cannot be undone.")) return;
                await fetch(`/api/admin/towns/${town.id}`, { method: "DELETE" });
                router.push("/admin/towns");
                router.refresh();
              }}
            >
              Delete Town
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
