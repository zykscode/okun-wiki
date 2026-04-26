"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// AMENITIES
export async function addAmenity(data: { townId: string; name: string; type: string; status: string; description?: string }) {
  await db.socialAmenity.create({ data });
  revalidatePath(`/admin/towns/${data.townId}/edit`);
  revalidatePath(`/towns`);
}

export async function deleteAmenity(id: string, townId: string) {
  await db.socialAmenity.delete({ where: { id } });
  revalidatePath(`/admin/towns/${townId}/edit`);
  revalidatePath(`/towns`);
}

// NEEDS
export async function addNeed(data: { townId: string; category: string; urgency: string; description: string }) {
  await db.townNeed.create({ data });
  revalidatePath(`/admin/towns/${data.townId}/edit`);
  revalidatePath(`/towns`);
}

export async function deleteNeed(id: string, townId: string) {
  await db.townNeed.delete({ where: { id } });
  revalidatePath(`/admin/towns/${townId}/edit`);
  revalidatePath(`/towns`);
}

// FAMILIES
export async function addFamily(data: { townId: string; name: string; history: string; headOfFamily?: string }) {
  await db.familyLineage.create({ data });
  revalidatePath(`/admin/towns/${data.townId}/edit`);
  revalidatePath(`/towns`);
}

export async function deleteFamily(id: string, townId: string) {
  await db.familyLineage.delete({ where: { id } });
  revalidatePath(`/admin/towns/${townId}/edit`);
  revalidatePath(`/towns`);
}
