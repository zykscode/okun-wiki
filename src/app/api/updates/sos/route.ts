import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const updates = await db.communityUpdate.findMany({
            where: { isSOS: true },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                },
                community: {
                    select: { id: true, name: true, slug: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        })

        return NextResponse.json(updates)
    } catch (error) {
        console.error("Failed to fetch global SOS updates", error)
        return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 })
    }
}
