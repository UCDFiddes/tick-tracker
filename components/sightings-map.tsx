"use client";

import "leaflet/dist/leaflet.css";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { CITY_COORDINATES } from "@/lib/coordinates";
import type { Sighting } from "@/lib/types";

export default function SightingsMap({ sightings }: { sightings: Sighting[] }) {
	const counts = new Map<string, number>();

	for (const sighting of sightings) {
		counts.set(sighting.location, (counts.get(sighting.location) ?? 0) + 1);
	}

	const maxCount = Math.max(...counts.values());
	const minCount = Math.min(...counts.values());
	const difference = maxCount - minCount;

	return (
		<MapContainer
			center={[54.5, -3]}
			zoom={5.5}
			scrollWheelZoom={false}
			className="h-164 w-full rounded-xl"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{Array.from(counts.entries()).map(([city, count]) => {
				const position = CITY_COORDINATES[city];
				if (!position) return null;

				const radius =
					difference === 0
						? 20
						: Math.min(20, ((count - minCount) / difference) * 20 + 10);
				const color =
					count >= 90
						? "#dc2626"
						: count >= 75
							? "#ea580c"
							: count >= 50
								? "#eab308"
								: "#22c55e";

				return (
					<CircleMarker
						key={city}
						center={position}
						radius={radius}
						pathOptions={{
							color,
							fillColor: color,
							fillOpacity: 0.65,
							weight: 2,
						}}
					>
						<Popup>
							<div className="space-y-2">
								<div>
									<strong>{city}</strong>
									<br />
									{count} sightings
								</div>

								<a
									href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Get directions
								</a>
							</div>
						</Popup>
					</CircleMarker>
				);
			})}
		</MapContainer>
	);
}
