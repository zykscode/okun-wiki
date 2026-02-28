import Link from "next/link";
import { auth } from "@/lib/auth";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-wiki-border theme-transition" style={{ background: "var(--color-wiki-card)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-[860px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-coral-500 to-coral-700 text-white group-hover:shadow-lg group-hover:shadow-coral-500/30 transition-all duration-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-coral-500 to-coral-700 bg-clip-text text-transparent">Ọ̀kun Wiki</span>
              <span className="hidden sm:block text-[11px] text-wiki-muted leading-tight">The Encyclopedia of Ọ̀kun Land</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {[
              { href: "/", label: "Home" },
              { href: "/towns", label: "Towns" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-wiki-muted hover:text-wiki-text no-underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-wiki-muted hover:text-coral-500 no-underline rounded-xl hover:bg-wiki-hover transition-all duration-200"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Link>

            <ThemeToggle />

            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link href="/auth/register"><Button size="sm">Sign up</Button></Link>
              </div>
            )}

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
