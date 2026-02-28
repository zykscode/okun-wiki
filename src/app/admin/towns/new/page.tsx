import { TownForm } from "@/components/admin/town-form";

export default function NewTownPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Create New Town</h1>
      <TownForm />
    </div>
  );
}
