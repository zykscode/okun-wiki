import { requireAdmin } from "@/lib/actions/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin — Okunpedia" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">{children}</div>
    </div>
  );
}
