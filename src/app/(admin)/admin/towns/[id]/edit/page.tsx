import { TownService } from "@/services/town.service";
import { TownForm } from "@/components/admin/TownForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminTownEditPage({ params }: { params: { id: string } }) {
  const [town, lgas, tribes] = await Promise.all([
    prisma.town.findUnique({ where: { id: params.id } }),
    TownService.getAllLGAs(),
    TownService.getAllTribes(),
  ]);

  if (!town) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/towns">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Town</h1>
          <p className="text-muted-foreground">Update {town.name}</p>
        </div>
      </div>

      <div className="p-6 bg-card border rounded-lg">
        <TownForm initialData={town} lgas={lgas} tribes={tribes} />
      </div>
    </div>
  );
}
