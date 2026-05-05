import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserRoleSelect } from "@/components/admin/user-role-select";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { createdTowns: true, comments: true, blogPosts: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Manage Users</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-wiki-text">{user.name || "Unnamed"}</h3>
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "primary"
                        : user.role === "EDITOR"
                          ? "earth"
                          : "default"
                    }
                  >
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === "ACTIVE" ? "primary" : "default"}>
                    {user.status}
                  </Badge>
                </div>
                <p className="text-sm text-wiki-muted mt-1">
                  {user.email} · Joined {formatDate(user.createdAt)} · {user._count.createdTowns}{" "}
                  towns · {user._count.blogPosts} posts
                </p>
              </div>
              <UserRoleSelect
                userId={user.id}
                currentRole={user.role}
                currentStatus={user.status}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
