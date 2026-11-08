import { NextResponse } from "next/server";
import { insertSightings } from "@/lib/db";
import { getElancoSightings } from "@/lib/elanco";

export async function POST() {
	try {
		const sightings = await getElancoSightings();
		insertSightings(sightings);

		return NextResponse.json({
			success: true,
			fetched: sightings.length,
		});
	} catch (error) {
		console.error("Error synchronising sightings:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to synchronise sightings",
			},
			{ status: 500 },
		);
	}
}
