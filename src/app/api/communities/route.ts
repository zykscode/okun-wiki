import { NextRequest, NextResponse } from "next/server"
import { db as prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const region = searchParams.get("region")

    // Build filter conditions
    const where: Prisma.CommunityWhereInput = {}

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
      ]
    }

    if (region) {
      where.region = region
    }

    const communities = await prisma.community.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        region: true,
        _count: {
          select: {
            members: true,
            updates: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    // Map updates to "articles" to match frontend expectations ported from okunpedia
    const mappedCommunities = communities.map(c => ({
      ...c,
      _count: {
        members: c._count.members,
        articles: c._count.updates
      }
    }))

    return NextResponse.json(mappedCommunities)
  } catch (error) {
    console.error("Error fetching communities:", error)
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, description, region, slug } = data

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Community name and slug are required" },
        { status: 400 }
      )
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        region,
      },
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error) {
    console.error("Error creating community:", error)
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    )
  }
}