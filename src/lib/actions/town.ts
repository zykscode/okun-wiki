import { db } from "@/lib/db";

export async function getTowns() {
  return db.town.findMany({
    where: { published: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { name: "asc" },
  });
}

export async function getFeaturedTowns() {
  return db.town.findMany({
    where: { published: true, featured: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 6,
  });
}

export async function getTownBySlug(slug: string) {
  return db.town.findUnique({
    where: { slug },
    include: {
      pages: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
      festivals: {
        include: { images: true }
      },
      people: true,
      images: true,
      createdBy: { select: { name: true } },
      amenities: true,
      needs: true,
      families: true,
      neighbors: {
        include: { neighbor: { select: { name: true, slug: true } } }
      },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            include: {
              author: { select: { id: true, name: true, image: true } }
            },
            orderBy: { createdAt: "asc" }
          }
        }
      }
    },
  });
}

export async function getTownPage(townSlug: string, pageSlug: string) {
  const town = await db.town.findUnique({
    where: { slug: townSlug },
    select: { id: true, name: true, slug: true },
  });

  if (!town) return null;

  const page = await db.townPage.findUnique({
    where: { townId_slug: { townId: town.id, slug: pageSlug } },
  });

  return page ? { town, page } : null;
}

export async function searchTowns(query: string) {
  return db.town.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: query } },
        { lga: { contains: query } },
        { overview: { contains: query } },
      ],
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTownStats() {
  const [townCount, pageCount, userCount] = await Promise.all([
    db.town.count({ where: { published: true } }),
    db.townPage.count(),
    db.user.count(),
  ]);
  return { townCount, pageCount, userCount };
}
