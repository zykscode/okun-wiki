import Link from "next/link";
import { auth } from "@/lib/auth";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export async function Header() {
  const session = await auth();

  return (
    <header
      className="sticky top-0 z-50 border-b border-wiki-border theme-transition"
      style={{ background: "var(--color-wiki-card)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-[860px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="p-2 rounded-xl bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400 group-hover:bg-forest-600 group-hover:text-white dark:group-hover:bg-forest-500 transition-all duration-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-medium text-wiki-text tracking-tight transition-colors group-hover:text-forest-600 dark:group-hover:text-forest-400">
                Okunpedia
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-wiki-muted font-medium mt-0.5">
                The Encyclopedia of Okun Land
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {[
              { href: "/", label: "Home" },
              { href: "/towns", label: "Towns" },
              { href: "/map", label: "Map" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-wiki-muted hover:text-wiki-text transition-colors group py-1"
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-forest-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-wiki-muted hover:text-forest-600 dark:hover:text-forest-400 rounded-xl hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all duration-200"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Link>

            <ThemeToggle />

            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
