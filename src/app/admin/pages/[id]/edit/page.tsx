import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PageEditForm } from "@/components/admin/page-edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await db.townPage.findUnique({
    where: { id },
    include: { town: { select: { name: true } } },
  });
  if (!page) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">
        Edit: {page.title} <span className="text-wiki-muted font-normal">({page.town.name})</span>
      </h1>
      <PageEditForm page={page} />
    </div>
  );
}
