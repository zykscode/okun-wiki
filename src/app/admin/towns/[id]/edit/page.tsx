import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TownForm } from "@/components/admin/town-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TownAmenities } from "@/components/admin/town-amenities";
import { TownNeeds } from "@/components/admin/town-needs";
import { TownLineage } from "@/components/admin/town-lineage";

interface EditTownPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTownPage({ params }: EditTownPageProps) {
  const { id } = await params;
  const town = await db.town.findUnique({
    where: { id },
    include: {
      amenities: true,
      needs: true,
      families: true,
    },
  });

  if (!town) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-wiki-text">Edit: {town.name}</h1>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="amenities">Social Amenities</TabsTrigger>
          <TabsTrigger value="needs">Community Needs</TabsTrigger>
          <TabsTrigger value="lineage">Family Lineage</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <TownForm town={town} />
        </TabsContent>

        <TabsContent value="amenities">
          <TownAmenities townId={town.id} amenities={town.amenities} />
        </TabsContent>

        <TabsContent value="needs">
          <TownNeeds townId={town.id} needs={town.needs} />
        </TabsContent>

        <TabsContent value="lineage">
          <TownLineage townId={town.id} families={town.families} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
