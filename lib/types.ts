export type Sighting = {
	id: string;
	date: string;
	location: string;
	species: string;
	latin_name: string;
};

export type Analytics = {
	total: number;
	byCity: { location: string; count: number }[];
	bySpecies: { species: string; count: number }[];
	byMonth: { month: string; count: number }[];
};

export type ReportInput = {
	date: string;
	location: string;
	species: string;
};
