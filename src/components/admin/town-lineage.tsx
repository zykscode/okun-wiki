"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addFamily, deleteFamily } from "@/lib/actions/encyclopedia";
import { Trash2 } from "lucide-react";

interface Family {
  id: string;
  name: string;
  history: string;
  headOfFamily?: string | null;
}

export function TownLineage({ townId, families }: { townId: string; families: Family[] }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addFamily({
      townId,
      name: formData.get("name") as string,
      history: formData.get("history") as string,
      headOfFamily: formData.get("headOfFamily") as string,
    });
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-wiki-text">Add Prominent Family</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Family Name</label>
                <Input name="name" placeholder="e.g. Olayemi Family" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Head of Family</label>
                <Input name="headOfFamily" placeholder="e.g. Chief Olayemi" />
              </div>
            </div>
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-1">Family History & Lineage</label>
                <Textarea
                  name="history"
                  placeholder="Trace the history..."
                  required
                  className="h-24"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                Add Family
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-wiki-text">Family Lineages</h2>
        </CardHeader>
        <CardContent>
          {families.length === 0 ? (
            <p className="text-wiki-muted text-sm">No families added yet.</p>
          ) : (
            <ul className="divide-y divide-wiki-border">
              {families.map((f) => (
                <li key={f.id} className="py-4 flex justify-between items-start">
                  <div>
                    <p className="font-medium">{f.name}</p>
                    {f.headOfFamily && (
                      <p className="text-xs text-wiki-muted mb-2">Head: {f.headOfFamily}</p>
                    )}
                    <p className="text-sm text-wiki-secondary">{f.history}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 shrink-0 ml-4 h-9 w-9 p-0"
                    onClick={() => deleteFamily(f.id, townId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
