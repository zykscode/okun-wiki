"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SETTINGS_FIELDS = [
  { key: "site_name", label: "Site Name", type: "input", defaultValue: "Ọ̀kun Wiki" },
  { key: "site_tagline", label: "Tagline", type: "input", defaultValue: "The Encyclopedia of Ọ̀kun Land" },
  { key: "site_description", label: "Description", type: "textarea", defaultValue: "A community-driven encyclopedia..." },
  { key: "contact_email", label: "Contact Email", type: "input", defaultValue: "" },
  { key: "social_twitter", label: "Twitter/X Handle", type: "input", defaultValue: "" },
  { key: "social_facebook", label: "Facebook URL", type: "input", defaultValue: "" },
  { key: "analytics_id", label: "Google Analytics ID", type: "input", defaultValue: "" },
  { key: "maintenance_mode", label: "Maintenance Mode (yes/no)", type: "input", defaultValue: "no" },
];

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    SETTINGS_FIELDS.forEach((f) => {
      data[f.key] = (formData.get(f.key) as string) || "";
    });

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-wiki-text">General</h2></CardHeader>
          <CardContent className="space-y-4">
            {SETTINGS_FIELDS.filter((f) => !f.key.startsWith("social_") && !f.key.startsWith("analytics")).map((field) => (
              field.type === "textarea" ? (
                <Textarea
                  key={field.key}
                  id={field.key}
                  name={field.key}
                  label={field.label}
                  defaultValue={settings[field.key] || field.defaultValue}
                />
              ) : (
                <Input
                  key={field.key}
                  id={field.key}
                  name={field.key}
                  label={field.label}
                  defaultValue={settings[field.key] || field.defaultValue}
                />
              )
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-wiki-text">Social & Analytics</h2></CardHeader>
          <CardContent className="space-y-4">
            {SETTINGS_FIELDS.filter((f) => f.key.startsWith("social_") || f.key.startsWith("analytics")).map((field) => (
              <Input
                key={field.key}
                id={field.key}
                name={field.key}
                label={field.label}
                defaultValue={settings[field.key] || field.defaultValue}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">✓ Settings saved</span>}
        </div>
      </div>
    </form>
  );
}
