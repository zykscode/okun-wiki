import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const towns = await db.town.findMany({
            where: { published: true },
            select: {
                id: true,
                name: true,
                slug: true,
                lga: true,
                coordinates: true,
                population: true,
                tagline: true,
            },
        });

        const formattedTowns = towns
            .filter((t) => t.coordinates)
            .map((t) => {
                const [lat, lng] = t.coordinates!.split(",").map(Number);
                return {
                    ...t,
                    coordinates: [lat, lng],
                };
            });

        return NextResponse.json(formattedTowns);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch towns" }, { status: 500 });
    }
}
