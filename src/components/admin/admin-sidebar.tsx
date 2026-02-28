"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MapPin, FileText, Users, Settings, PenSquare, Activity, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/towns", label: "Towns", icon: MapPin },
  { href: "/admin/pages", label: "Wiki Pages", icon: FileText },
  { href: "/admin/blog", label: "Blog Posts", icon: PenSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/activity", label: "Activity Log", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-wiki-border shrink-0 hidden lg:block theme-transition" style={{ background: "var(--color-wiki-card)" }}>
      <div className="p-4 border-b border-wiki-border">
        <h2 className="font-display font-medium text-lg text-wiki-text tracking-tight">Admin Panel</h2>
        <p className="text-xs text-wiki-muted mt-0.5">Manage Okunpedia</p>
      </div>
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm no-underline transition-all duration-200",
                isActive
                  ? "bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 font-medium"
                  : "text-wiki-muted hover:bg-wiki-hover hover:text-wiki-text"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
