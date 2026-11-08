import { randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		let query = "SELECT * FROM sightings WHERE 1 = 1";
		const params: string[] = [];

		const city = searchParams.get("city");
		if (city) {
			query += " AND location = ?";
			params.push(city);
		}

		const species = searchParams.get("species");
		if (species) {
			query += " AND species = ?";
			params.push(species);
		}

		const from = searchParams.get("from");
		if (from) {
			query += " AND date >= ?";
			params.push(from);
		}

		const to = searchParams.get("to");
		if (to) {
			query += " AND date <= ?";
			params.push(to);
		}

		query += " ORDER BY date DESC";

		const sightings = db.prepare(query).all(...params);
		return NextResponse.json(sightings);
	} catch (error) {
		console.error("Failed to retrieve sightings:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve sightings" },
			{ status: 500 },
		);
	}
}

const ReportSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
	location: z.string().trim().min(2).max(100),
	species: z.string().trim().min(2).max(100),
});

export async function POST(request: NextRequest) {
	try {
		const body: unknown = await request.json();
		const result = ReportSchema.safeParse(body);
		if (!result.success)
			return NextResponse.json(
				{
					error: "Invalid submission",
					details: result.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);

		const { date, location, species } = result.data;
		const id = randomUUID();

		db.prepare(`
      INSERT INTO sightings (
        id, date, location, species, latin_name, source
      )
      VALUES (?, ?, ?, ?, ?, 'community')
    `).run(id, `${date}T12:00:00`, location, species, "");

		return NextResponse.json({ success: true, id }, { status: 201 });
	} catch (error) {
		console.error("Failed to submit sighting:", error);
		return NextResponse.json(
			{ error: "Failed to submit sighting" },
			{ status: 500 },
		);
	}
}
