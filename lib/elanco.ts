import { type Sighting, SightingsSchema } from "./schema";

const API_URL = "https://dev-task.elancoapps.com";

export async function getElancoSightings(): Promise<Sighting[]> {
	const response = await fetch(`${API_URL}/data/tick-sightings`);
	if (!response.ok)
		throw new Error(
			`Elanco API returned ${response.status}: ${response.statusText}`,
		);

	const data: unknown = await response.json();
	return SightingsSchema.parse(data);
}
