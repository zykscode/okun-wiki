"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogError({
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
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-wiki-text mb-2">Failed to load blog</h2>
      <p className="text-wiki-muted text-sm mb-6">
        There was an error loading this page. Please try again.
      </p>
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="h-4 w-4" /> Retry
      </Button>
    </div>
  );
}
