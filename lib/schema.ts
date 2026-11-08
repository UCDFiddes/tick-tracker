import { z } from "zod";

export const SightingSchema = z.object({
	id: z.string(),
	date: z.string(),
	location: z.string(),
	species: z.string(),
	latinName: z.string(),
});

export const SightingsSchema = z.array(SightingSchema);

export type Sighting = z.infer<typeof SightingSchema>;
