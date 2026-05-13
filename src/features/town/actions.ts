"use server";

import { prisma } from "@/lib/prisma";
import {
  TownSchema,
  TownPageSchema,
  FestivalSchema,
  ProminentPersonSchema,
  AmenitySchema,
  CommunityNeedSchema,
  LGASchema,
  TribeSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export async function createLGA(data: unknown) {
  const parsed = LGASchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const lga = await prisma.lGA.create({ data: parsed.data });
  revalidatePath("/admin/taxonomy/lgas");
  return { data: lga };
}

export async function createTribe(data: unknown) {
  const parsed = TribeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const tribe = await prisma.tribe.create({ data: parsed.data });
  revalidatePath("/admin/taxonomy/tribes");
  return { data: tribe };
}

// ─── Town CRUD ────────────────────────────────────────────────────────────────

export async function createTown(data: unknown) {
  const parsed = TownSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  // createdBy: in production, get from session — placeholder cuid for now
  const createdById = process.env.ADMIN_USER_IDS?.split(",")[0] ?? "";

  const town = await prisma.town.create({
    data: { ...parsed.data, createdById },
  });
  revalidatePath("/towns");
  revalidatePath("/admin/towns");
  return { data: town };
}

export async function updateTown(id: string, data: unknown) {
  const parsed = TownSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const town = await prisma.town.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath(`/towns/${town.slug}`);
  revalidatePath("/admin/towns");
  return { data: town };
}

export async function deleteTown(id: string) {
  const town = await prisma.town.delete({ where: { id } });
  revalidatePath("/towns");
  revalidatePath("/admin/towns");
  return { data: town };
}

export async function togglePublished(id: string, published: boolean) {
  const town = await prisma.town.update({
    where: { id },
    data: { published },
  });
  revalidatePath(`/towns/${town.slug}`);
  revalidatePath("/admin/towns");
  return { data: town };
}

// ─── TownPage CRUD ────────────────────────────────────────────────────────────

export async function createTownPage(townId: string, data: unknown) {
  const parsed = TownPageSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { editSummary, ...pageData } = parsed.data;

  const page = await prisma.townPage.create({
    data: { ...pageData, townId },
  });

  // Create initial version
  await prisma.pageVersion.create({
    data: {
      pageId: page.id,
      content: page.content,
      editSummary: editSummary ?? "Initial version",
      version: 1,
      createdById: process.env.ADMIN_USER_IDS?.split(",")[0] ?? "",
    },
  });

  revalidatePath(`/towns`);
  revalidatePath("/admin/towns");
  return { data: page };
}

export async function updateTownPage(pageId: string, townSlug: string, data: unknown) {
  const parsed = TownPageSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { editSummary, ...pageData } = parsed.data;

  // Get current version count
  const versionCount = await prisma.pageVersion.count({
    where: { pageId },
  });

  const page = await prisma.townPage.update({
    where: { id: pageId },
    data: pageData,
  });

  // Save version snapshot
  await prisma.pageVersion.create({
    data: {
      pageId,
      content: page.content,
      editSummary: editSummary ?? "Update",
      version: versionCount + 1,
      createdById: process.env.ADMIN_USER_IDS?.split(",")[0] ?? "",
    },
  });

  revalidatePath(`/towns/${townSlug}`);
  revalidatePath("/admin/towns");
  return { data: page };
}

// ─── Festival CRUD ────────────────────────────────────────────────────────────

export async function createFestival(townId: string, data: unknown) {
  const parsed = FestivalSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const festival = await prisma.festival.create({
    data: { ...parsed.data, townId },
  });
  revalidatePath("/admin/towns");
  return { data: festival };
}

// ─── Prominent Person CRUD ────────────────────────────────────────────────────

export async function createPerson(townId: string, data: unknown) {
  const parsed = ProminentPersonSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const person = await prisma.prominentPerson.create({
    data: { ...parsed.data, townId },
  });
  revalidatePath("/admin/towns");
  return { data: person };
}

// ─── Amenity & Need ───────────────────────────────────────────────────────────

export async function createAmenity(townId: string, data: unknown) {
  const parsed = AmenitySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const amenity = await prisma.amenity.create({
    data: { ...parsed.data, townId },
  });
  revalidatePath("/admin/towns");
  return { data: amenity };
}

export async function createNeed(townId: string, data: unknown) {
  const parsed = CommunityNeedSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };
  const need = await prisma.communityNeed.create({
    data: { ...parsed.data, townId },
  });
  revalidatePath("/admin/towns");
  return { data: need };
}

// ─── Neighbor relationships ───────────────────────────────────────────────────

export async function linkNeighbors(
  townAId: string,
  townBId: string,
  distanceKm?: number,
  direction?: string,
) {
  const neighbor = await prisma.townNeighbor.upsert({
    where: { townAId_townBId: { townAId, townBId } },
    create: { townAId, townBId, distanceKm, direction },
    update: { distanceKm, direction },
  });
  revalidatePath("/admin/towns");
  return { data: neighbor };
}

export async function linkSisterTown(
  townAId: string,
  townBId: string,
  description?: string,
  since?: number,
) {
  const sister = await prisma.sisterTown.upsert({
    where: { townAId_townBId: { townAId, townBId } },
    create: { townAId, townBId, description, since },
    update: { description, since },
  });
  revalidatePath("/admin/towns");
  return { data: sister };
}
