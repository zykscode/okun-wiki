import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: communityId } = await params
        if (!communityId) {
            return NextResponse.json({ error: "Community ID requires" }, { status: 400 })
        }

        const updates = await db.communityUpdate.findMany({
            where: { communityId },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 20
        })

        return NextResponse.json(updates)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { id: communityId } = await params
        const { content } = await req.json()

        if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 })

        const newUpdate = await db.communityUpdate.create({
            data: {
                content,
                authorId: session.user.id,
                communityId
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            }
        })

        return NextResponse.json(newUpdate, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create update" }, { status: 500 })
    }
}
