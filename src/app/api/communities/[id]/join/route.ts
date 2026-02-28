import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db as prisma } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const communityId = params.id

    if (!communityId) {
      return NextResponse.json(
        { error: "Community ID is required" },
        { status: 400 }
      )
    }

    // Check if community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMembership = await prisma.userCommunity.findFirst({
      where: {
        userId: session.user.id,
        communityId: communityId,
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: "Already a member of this community" },
        { status: 409 }
      )
    }

    // Create membership
    await prisma.userCommunity.create({
      data: {
        userId: session.user.id,
        communityId: communityId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Successfully joined community"
    })
  } catch (error) {
    console.error("Error joining community:", error)
    return NextResponse.json(
      { error: "Failed to join community" },
      { status: 500 }
    )
  }
}