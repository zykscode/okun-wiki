import Link from "next/link";
import { BookOpen, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Decorative number */}
        <p className="-mb-8 text-[8rem] font-display font-bold leading-none text-wiki-text/5 select-none">
          404
        </p>

        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-wiki-text mb-3">This page doesn&apos;t exist</h1>
        <p className="text-wiki-muted text-sm leading-relaxed mb-8">
          The page you&apos;re looking for may have been moved, renamed, or hasn&apos;t been written
          yet. This is a community-driven encyclopedia — perhaps you could create it?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/towns" className="no-underline gap-2 flex items-center">
              <BookOpen className="h-4 w-4" /> Browse Towns
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search" className="no-underline gap-2 flex items-center">
              <Search className="h-4 w-4" /> Search
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/" className="no-underline gap-2 flex items-center text-wiki-muted">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
