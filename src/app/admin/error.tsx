"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { if (process.env.NODE_ENV !== "production") console.error(error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-wiki-text mb-2">Admin panel error</h2>
      <p className="text-wiki-muted text-sm mb-6">Something went wrong loading this admin page.</p>
      <Button onClick={reset} className="gap-2"><RefreshCw className="h-4 w-4" /> Retry</Button>
    </div>
  );
}
