import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";

export default async function AdminPagesPage() {
  const pages = await db.townPage.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      town: { select: { name: true, slug: true } },
      _count: { select: { versions: true, comments: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Wiki Pages</h1>
      <div className="space-y-3">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-wiki-text">{page.title}</h3>
                  <Badge variant="primary">{page.town.name}</Badge>
                  <Badge variant="earth">{page.type}</Badge>
                  {!page.published && <Badge variant="default">Draft</Badge>}
                </div>
                <p className="text-sm text-wiki-muted mt-1">
                  {page._count.versions} versions · {page._count.comments} comments · Updated{" "}
                  {formatDate(page.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/towns/${page.town.slug}/${page.slug}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/pages/${page.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.length === 0 && (
          <p className="text-center text-wiki-muted py-12">No wiki pages yet.</p>
        )}
      </div>
    </div>
  );
}
