import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Activity } from "lucide-react";

export default async function AdminActivityPage() {
  const logs = await db.activityLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Activity Log</h1>
      <Card>
        <CardContent className="py-4">
          {logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm border-b border-wiki-border last:border-0 pb-3 last:pb-0">
                  <Activity className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-wiki-text">
                      <span className="font-medium">{log.user.name || log.user.email}</span>{" "}
                      <span className="text-wiki-muted">{log.action.replace(/_/g, " ")}</span>{" "}
                      <span className="font-medium">{log.target}</span>
                    </p>
                    {log.details && <p className="text-wiki-muted text-xs mt-0.5">{log.details}</p>}
                    <p className="text-wiki-muted text-xs mt-0.5">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-wiki-muted text-center py-8">No activity recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
