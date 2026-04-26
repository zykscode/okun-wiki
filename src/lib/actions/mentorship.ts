"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function acceptMentorship(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const mentorship = await db.mentorship.findUnique({ where: { id } })
  if (!mentorship || mentorship.status !== "PENDING") {
    throw new Error("Invalid request")
  }

  // If the request was from a mentee looking for a mentor
  if (mentorship.menteeId && !mentorship.mentorId) {
    await db.mentorship.update({
      where: { id },
      data: {
        mentorId: session.user.id,
        status: "ACTIVE"
      }
    })
  } 
  // If the request was from a mentor looking for a mentee
  else if (mentorship.mentorId && !mentorship.menteeId) {
    await db.mentorship.update({
      where: { id },
      data: {
        menteeId: session.user.id,
        status: "ACTIVE"
      }
    })
  }

  revalidatePath('/profile')
}

export async function completeMentorship(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.mentorship.update({
    where: { id, OR: [{ mentorId: session.user.id }, { menteeId: session.user.id }] },
    data: { status: "COMPLETED" }
  })

  revalidatePath('/profile')
}

export async function cancelMentorship(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.mentorship.delete({
    where: { id, OR: [{ mentorId: session.user.id }, { menteeId: session.user.id }] }
  })

  revalidatePath('/profile')
}
