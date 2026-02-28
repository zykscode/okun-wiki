import { db } from "@/lib/db";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await db.siteSetting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Site Settings</h1>
      <SettingsForm settings={settingsMap} />
    </div>
  );
}
