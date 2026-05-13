"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, FileText, Tags, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Towns", href: "/admin/towns", icon: MapPin },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Taxonomy", href: "/admin/taxonomy", icon: Tags },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="font-bold text-xl text-primary tracking-tight">
          Okunpedia <span className="text-muted-foreground text-sm font-normal">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground text-center">Okunpedia v0.1.0</div>
    </aside>
  );
}
