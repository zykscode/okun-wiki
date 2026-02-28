"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";

export function CommentActions({ commentId, approved }: { commentId: string; approved: boolean }) {
  const router = useRouter();

  const action = async (act: string) => {
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, action: act }),
    });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      {!approved && (
        <Button variant="ghost" size="sm" onClick={() => action("approve")} title="Approve">
          <Check className="h-4 w-4 text-green-500" />
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={() => action("reject")} title="Reject">
        <X className="h-4 w-4 text-orange-500" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => action("delete")} title="Delete">
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
