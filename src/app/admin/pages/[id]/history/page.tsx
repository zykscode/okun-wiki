import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { HistoryList } from "./history-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PageHistoryPage({ params }: Props) {
  const { id } = await params;

  const page = await db.townPage.findUnique({
    where: { id },
    include: {
      town: { select: { name: true } },
      versions: {
        orderBy: { version: "desc" },
      },
    },
  });

  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/pages`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Pages
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-wiki-text">History: {page.title}</h1>
        </div>
        <Link href={`/admin/pages/${id}/edit`}>
          <Button variant="outline">Edit Current</Button>
        </Link>
      </div>

      <div className="bg-wiki-card border border-wiki-border rounded-xl p-6 theme-transition">
        <p className="text-wiki-muted mb-6">
          Showing edit history for <strong>{page.title}</strong> in{" "}
          <strong>{page.town.name}</strong>. You can compare versions to see what changed over time.
        </p>

        <HistoryList
          pageId={id}
          initialVersions={JSON.parse(JSON.stringify(page.versions))}
          currentContent={page.content}
        />
      </div>
    </div>
  );
}
