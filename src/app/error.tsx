"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service in production
    if (process.env.NODE_ENV !== "production") {
      console.error("[Error Boundary]", error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-wiki-text mb-2">Something went wrong</h1>
        <p className="text-wiki-muted text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-2 text-xs font-mono text-wiki-muted/70">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2 no-underline flex items-center">
              <Home className="h-4 w-4" /> Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
