import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, EyeOff, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminTownsPage() {
  const towns = await db.town.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { pages: true, comments: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-wiki-text">Manage Towns</h1>
        <Link href="/admin/towns/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Town
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {towns.map((town) => (
          <Card key={town.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-wiki-text">{town.name}</h3>
                  {town.published ? (
                    <Badge variant="primary">
                      <Eye className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                  {town.featured && (
                    <Badge variant="earth">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-wiki-muted mt-1">
                  {town.lga} LGA · {town._count.pages} pages · {town._count.comments} comments ·
                  Updated {formatDate(town.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/towns/${town.slug}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/towns/${town.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {towns.length === 0 && (
          <p className="text-center text-wiki-muted py-12">No towns yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
}
