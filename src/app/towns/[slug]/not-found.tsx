import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Town Not Found" };

export default function TownNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <MapPin className="h-7 w-7 text-blue-500" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-wiki-text mb-3">Town not found</h1>
      <p className="text-wiki-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
        This town hasn&apos;t been documented yet. You can help by adding it to the encyclopedia.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href="/towns" className="no-underline flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Browse All Towns
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="no-underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
