import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, FileText, Users, PenSquare, MessageSquare, Activity } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [townCount, pageCount, userCount, postCount, commentCount, recentActivity] = await Promise.all([
    db.town.count(),
    db.townPage.count(),
    db.user.count(),
    db.blogPost.count(),
    db.comment.count(),
    db.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const stats = [
    { label: "Towns", value: townCount, icon: MapPin, href: "/admin/towns", color: "text-green-500" },
    { label: "Wiki Pages", value: pageCount, icon: FileText, href: "/admin/pages", color: "text-blue-500" },
    { label: "Users", value: userCount, icon: Users, href: "/admin/users", color: "text-purple-500" },
    { label: "Blog Posts", value: postCount, icon: PenSquare, href: "/admin/blog", color: "text-orange-500" },
    { label: "Comments", value: commentCount, icon: MessageSquare, href: "/admin/comments", color: "text-pink-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="no-underline">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-3 py-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-wiki-text">{stat.value}</p>
                  <p className="text-xs text-wiki-muted">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-500" />
            <h2 className="font-semibold text-wiki-text">Recent Activity</h2>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-wiki-text">
                      <span className="font-medium">{log.user.name || log.user.email}</span>{" "}
                      <span className="text-wiki-muted">{log.action.replace(/_/g, " ")}</span>{" "}
                      <span className="font-medium">{log.target}</span>
                    </p>
                    {log.details && <p className="text-wiki-muted text-xs">{log.details}</p>}
                    <p className="text-wiki-muted text-xs">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-wiki-muted text-sm">No activity yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
