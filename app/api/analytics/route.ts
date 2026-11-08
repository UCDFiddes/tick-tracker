import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// this may not be ideal for large datasets

export async function GET() {
	try {
		const total = db
			.prepare("SELECT COUNT(*) as count FROM sightings")
			.get() as { count: number };

		const byCity = db
			.prepare(`
      SELECT location, COUNT(*) as count
      FROM sightings
      GROUP BY location
      ORDER BY count DESC
    `)
			.all();

		const bySpecies = db
			.prepare(`
      SELECT species, COUNT(*) as count
      FROM sightings
      GROUP BY species
      ORDER BY count DESC
    `)
			.all();

		const byMonth = db
			.prepare(`
      SELECT strftime('%Y-%m', date) as month, COUNT(*) as count
      FROM sightings
      GROUP BY month
      ORDER BY month
    `)
			.all();

		return NextResponse.json({
			total: total.count,
			byCity,
			bySpecies,
			byMonth,
		});
	} catch (error) {
		console.error("Failed to retrieve analytics:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve analytics" },
			{ status: 500 },
		);
	}
}
