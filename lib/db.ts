import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "tickwatch.db");

fs.mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS sightings (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    species TEXT NOT NULL,
    latin_name TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'elanco'
  );

  CREATE INDEX IF NOT EXISTS idx_sightings_date
    ON sightings(date);

  CREATE INDEX IF NOT EXISTS idx_sightings_location
    ON sightings(location);

  CREATE INDEX IF NOT EXISTS idx_sightings_species
    ON sightings(species);
`);

export function insertSightings(
	sightings: {
		id: string;
		date: string;
		location: string;
		species: string;
		latinName: string;
	}[],
) {
	const insert = db.prepare(`
    INSERT OR IGNORE INTO sightings (
      id,
      date,
      location,
      species,
      latin_name,
      source
    ) VALUES (?, ?, ?, ?, ?, 'elanco')
  `);

	const insertMany = db.transaction((records) => {
		for (const sighting of records) {
			insert.run(
				sighting.id,
				sighting.date,
				sighting.location,
				sighting.species,
				sighting.latinName,
			);
		}
	});

	insertMany(sightings);
}
