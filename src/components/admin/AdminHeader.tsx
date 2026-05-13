import { User } from "lucide-react";
import { handleSignOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";

export async function AdminHeader() {
  const session = await auth();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        {/* Breadcrumbs or Page Title could go here */}
        <h2 className="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "Admin User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email || "admin@okunpedia.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={handleSignOut}>
                <button className="w-full text-left">Log out</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
