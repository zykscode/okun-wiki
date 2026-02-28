import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ towns: [], posts: [] });

  const [towns, posts] = await Promise.all([
    db.town.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q } },
          { lga: { contains: q } },
          { overview: { contains: q } },
          { tagline: { contains: q } },
        ],
      },
      select: { name: true, slug: true, tagline: true, lga: true },
      take: 5,
    }),
    db.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: { title: true, slug: true, excerpt: true, category: true },
      take: 5,
    }),
  ]);

  return NextResponse.json({ towns, posts });
}
