import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TownForm } from "@/components/admin/town-form";

interface EditTownPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTownPage({ params }: EditTownPageProps) {
  const { id } = await params;
  const town = await db.town.findUnique({ where: { id } });
  if (!town) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Edit: {town.name}</h1>
      <TownForm town={town} />
    </div>
  );
}
