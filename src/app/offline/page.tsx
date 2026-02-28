import { BookOpen, WifiOff } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex p-4 rounded-full bg-wiki-hover mb-4">
          <WifiOff className="h-12 w-12 text-wiki-muted" />
        </div>
        <h1 className="text-2xl font-bold text-wiki-text mb-2">You&apos;re offline</h1>
        <p className="text-wiki-muted max-w-md">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry — 
          previously visited pages may still be available. Try again when you&apos;re back online.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-primary-500">
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">Okunpedia</span>
        </div>
      </div>
    </div>
  );
}
