import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: communityId } = await params;
    const { role } = await req.json();

    // For MVP: simply creating a mentorship request (PENDING).
    // Future enhancements: match mentors with mentees or store available mentors/mentees in members list.
    const mentorship = await db.mentorship.create({
      data: {
        communityId,
        mentorId: role === "MENTOR" ? session.user.id : undefined,
        menteeId: role === "MENTEE" ? session.user.id : undefined,
        status: "PENDING",
      },
    });

    return NextResponse.json(mentorship, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create mentorship request" }, { status: 500 });
  }
}
