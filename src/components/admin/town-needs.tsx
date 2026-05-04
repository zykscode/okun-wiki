"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addNeed, deleteNeed } from "@/lib/actions/encyclopedia";
import { Trash2 } from "lucide-react";

interface Need {
  id: string;
  category: string;
  urgency: string;
  description: string;
  status?: string;
}

export function TownNeeds({ townId, needs }: { townId: string; needs: Need[] }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addNeed({
      townId,
      category: formData.get("category") as string,
      urgency: formData.get("urgency") as string,
      description: formData.get("description") as string,
    });
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-wiki-text">Add Community Need</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input name="category" placeholder="e.g. Infrastructure, Education" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urgency</label>
                <Input name="urgency" placeholder="e.g. High, Medium" required />
              </div>
            </div>
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  name="description"
                  placeholder="Describe the need..."
                  required
                  className="h-24"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                Add Need
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-wiki-text">Existing Needs</h2>
        </CardHeader>
        <CardContent>
          {needs.length === 0 ? (
            <p className="text-wiki-muted text-sm">No needs recorded yet.</p>
          ) : (
            <ul className="divide-y divide-wiki-border">
              {needs.map((n) => (
                <li key={n.id} className="py-3 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{n.category}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${n.urgency === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {n.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-wiki-secondary">{n.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 shrink-0 h-9 w-9 p-0"
                    onClick={() => deleteNeed(n.id, townId)}
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
