/**
 * Town Service — Data Access Layer
 *
 * All town data is now served from PostgreSQL via Prisma.
 * The service interface is intentionally unchanged so that
 * no UI components need to be modified.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Default includes for all town queries
const townIncludes = {
  lga: { include: { state: true } },
  tribe: true,
  images: { orderBy: { isPrimary: "desc" } as Prisma.TownImageOrderByWithRelationInput },
  pages: { orderBy: { order: "asc" } as Prisma.TownPageOrderByWithRelationInput },
  festivals: { include: { images: true } },
  people: true,
  amenities: true,
  needs: true,
  families: true,
  neighboringA: { include: { townB: { select: { name: true, slug: true } } } },
  neighboringB: { include: { townA: { select: { name: true, slug: true } } } },
  sisterTownsA: { include: { townB: { select: { name: true, slug: true } } } },
  sisterTownsB: { include: { townA: { select: { name: true, slug: true } } } },
} satisfies Prisma.TownInclude;

export type TownWithRelations = Prisma.TownGetPayload<{
  include: typeof townIncludes;
}>;

export const TownService = {
  /** Fetch all published towns */
  async getAllTowns(): Promise<TownWithRelations[]> {
    return prisma.town.findMany({
      where: { published: true },
      include: townIncludes,
      orderBy: { name: "asc" },
    });
  },

  /** Fetch all towns for Admin (including unpublished) */
  async getAdminTowns(): Promise<TownWithRelations[]> {
    return prisma.town.findMany({
      include: townIncludes,
      orderBy: { name: "asc" },
    });
  },

  /** Fetch all towns grouped by LGA (for the towns listing page) */
  async getTownsGroupedByLGA(): Promise<Record<string, TownWithRelations[]>> {
    const towns = await prisma.town.findMany({
      where: { published: true },
      include: townIncludes,
      orderBy: { name: "asc" },
    });

    return towns.reduce(
      (acc, town) => {
        const lgaName = town.lga.name;
        if (!acc[lgaName]) acc[lgaName] = [];
        acc[lgaName].push(town);
        return acc;
      },
      {} as Record<string, TownWithRelations[]>,
    );
  },

  /** Fetch featured towns */
  async getFeaturedTowns(): Promise<TownWithRelations[]> {
    return prisma.town.findMany({
      where: { published: true, featured: true },
      include: townIncludes,
      orderBy: { name: "asc" },
    });
  },

  /** Fetch a single town by its slug */
  async getTownBySlug(slug: string): Promise<TownWithRelations | null> {
    return prisma.town.findUnique({
      where: { slug },
      include: townIncludes,
    });
  },

  /** Fetch all towns for static params generation */
  async getAllSlugs(): Promise<string[]> {
    const towns = await prisma.town.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return towns.map((t) => t.slug);
  },

  /** Fetch all LGAs for admin forms */
  async getAllLGAs() {
    return prisma.lGA.findMany({
      include: { state: true },
      orderBy: { name: "asc" },
    });
  },

  /** Fetch all Tribes for admin forms */
  async getAllTribes() {
    return prisma.tribe.findMany({ orderBy: { name: "asc" } });
  },

  /** Full-text search across towns (name, tagline, overview) */
  async searchTowns(query: string): Promise<TownWithRelations[]> {
    return prisma.town.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { tagline: { contains: query, mode: "insensitive" } },
          { overview: { contains: query, mode: "insensitive" } },
        ],
      },
      include: townIncludes,
      take: 20,
    });
  },
};
