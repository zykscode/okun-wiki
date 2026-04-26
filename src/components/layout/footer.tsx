import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-wiki-border/50 mt-auto backdrop-blur-md bg-wiki-card/30">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-forest-600/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-xl font-display font-medium text-wiki-text tracking-tight">Okunpedia</span>
            </div>
            <p className="text-sm text-wiki-muted leading-relaxed">
              A community-driven encyclopedia documenting the rich history, culture,
              and heritage of Ọ̀kun towns in Kogi State, Nigeria.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 text-wiki-text">Explore</h3>
            <li><Link href="/towns" className="text-sm text-wiki-muted hover:text-blue-500 dark:hover:text-blue-400 no-underline transition-colors">All Towns</Link></li>
            <li><Link href="/blog" className="text-sm text-wiki-muted hover:text-blue-500 dark:hover:text-blue-400 no-underline transition-colors">Blog</Link></li>
            <li><Link href="/about" className="text-sm text-wiki-muted hover:text-blue-500 dark:hover:text-blue-400 no-underline transition-colors">About</Link></li>
            <li><Link href="/admin" className="text-sm text-wiki-muted hover:text-blue-500 dark:hover:text-blue-400 no-underline transition-colors">Admin Dashboard</Link></li>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-wiki-text">Contribute</h3>
          <p className="text-sm text-wiki-muted leading-relaxed">
            Know something about an Ọ̀kun town? Sign up and help us document our heritage.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-wiki-border flex items-center justify-center gap-3 text-xs text-wiki-muted">
        <span>© {new Date().getFullYear()} Okunpedia</span>
        <span className="text-wiki-border">·</span>
        <span>Built with ❤️ for Ọ̀kun land</span>
      </div>
    </footer >
  );
}
