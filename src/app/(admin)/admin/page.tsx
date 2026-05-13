import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MapPin, FileText, Tags, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const [townCount, blogCount, lgaCount, userCount] = await Promise.all([
    prisma.town.count(),
    prisma.blogPost.count(),
    prisma.lGA.count(),
    prisma.user.count(),
  ]);

  const stats = [
    { title: "Total Towns", value: townCount, icon: MapPin },
    { title: "Total Blogs", value: blogCount, icon: FileText },
    { title: "Total LGAs", value: lgaCount, icon: Tags },
    { title: "Total Users", value: userCount, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome to the Okunpedia Admin Dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
