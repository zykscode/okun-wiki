"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TownsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
      </div>
      <h1 className="text-xl font-bold text-wiki-text mb-2">Failed to load towns</h1>
      <p className="text-wiki-muted text-sm mb-8">
        There was an error fetching town data. Please try again.
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="no-underline flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
