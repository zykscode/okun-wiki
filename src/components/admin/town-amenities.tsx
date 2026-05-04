"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addAmenity, deleteAmenity } from "@/lib/actions/encyclopedia";
import { Trash2 } from "lucide-react";

interface Amenity {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string | null;
}

export function TownAmenities({ townId, amenities }: { townId: string; amenities: Amenity[] }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addAmenity({
      townId,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
    });
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-wiki-text">Add Social Amenity</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input name="name" placeholder="e.g. General Hospital" required />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Type</label>
              <Input name="type" placeholder="e.g. Healthcare" required />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Status</label>
              <Input name="status" placeholder="e.g. Functional" required />
            </div>
            <Button type="submit" disabled={loading}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-wiki-text">Existing Amenities</h2>
        </CardHeader>
        <CardContent>
          {amenities.length === 0 ? (
            <p className="text-wiki-muted text-sm">No amenities added yet.</p>
          ) : (
            <ul className="divide-y divide-wiki-border">
              {amenities.map((a) => (
                <li key={a.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-sm text-wiki-muted">
                      {a.type} &bull; {a.status}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 h-9 w-9 p-0"
                    onClick={() => deleteAmenity(a.id, townId)}
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
