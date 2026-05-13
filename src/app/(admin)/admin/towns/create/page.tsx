import { TownService } from "@/services/town.service";
import { TownForm } from "@/components/admin/TownForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminTownCreatePage() {
  const [lgas, tribes] = await Promise.all([TownService.getAllLGAs(), TownService.getAllTribes()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/towns">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Town</h1>
          <p className="text-muted-foreground">Add a new town to the database.</p>
        </div>
      </div>

      <div className="p-6 bg-card border rounded-lg">
        <TownForm lgas={lgas} tribes={tribes} />
      </div>
    </div>
  );
}
