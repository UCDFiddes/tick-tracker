"use client";

import dynamic from "next/dynamic";
import type { Sighting } from "@/lib/types";

const SightingsMap = dynamic(() => import("./sightings-map"), {
	ssr: false,
	loading: () => <div className="h-164 animate-pulse rounded-xl bg-gray-100" />,
});

export default function MapLoader({ sightings }: { sightings: Sighting[] }) {
	return <SightingsMap sightings={sightings} />;
}
