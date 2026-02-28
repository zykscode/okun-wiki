"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserRoleSelect({
  userId,
  currentRole,
  currentStatus,
}: {
  userId: string;
  currentRole: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (field: string, value: string) => {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [field]: value }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 ml-4">
      <select
        value={currentRole}
        onChange={(e) => update("role", e.target.value)}
        disabled={loading}
        className="text-sm border border-wiki-border rounded-lg px-2 py-1 bg-wiki-input text-wiki-text theme-transition cursor-pointer"
      >
        <option value="USER">User</option>
        <option value="EDITOR">Editor</option>
        <option value="ADMIN">Admin</option>
      </select>
      <select
        value={currentStatus}
        onChange={(e) => update("status", e.target.value)}
        disabled={loading}
        className="text-sm border border-wiki-border rounded-lg px-2 py-1 bg-wiki-input text-wiki-text theme-transition cursor-pointer"
      >
        <option value="ACTIVE">Active</option>
        <option value="SUSPENDED">Suspended</option>
        <option value="PENDING">Pending</option>
      </select>
    </div>
  );
}
