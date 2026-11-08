"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import MapLoader from "@/components/map-loader";
import type { Analytics, Sighting } from "@/lib/types";

export default function Page() {
	const [location, setLocation] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	const {
		data: sightings,
		isLoading: isSightingsLoading,
		isError: isSightingsError,
	} = useQuery({
		queryKey: ["sightings", location, from, to],
		queryFn: () => {
			const params = new URLSearchParams();

			if (location) params.set("city", location);
			if (from) params.set("from", from);
			if (to) params.set("to", `${to}T23:59:59`);

			return fetch(`/api/sightings?${params.toString()}`).then(
				(res) => res.json() as Promise<Sighting[]>,
			);
		},
	});
	const {
		data: analytics,
		isLoading: isAnalyticsLoading,
		isError: isAnalyticsError,
	} = useQuery({
		queryKey: ["analytics"],
		queryFn: () =>
			fetch("/api/analytics").then((res) => res.json() as Promise<Analytics>),
	});

	useEffect(() => {
		if (analytics && analytics.total === 0) {
			try {
				fetch("/api/sync", { method: "POST" }).then(() =>
					window.location.reload(),
				);
			} catch (error) {
				console.error("Error syncing sightings:", error);
			}
		}
	}, [analytics]);

	if (isSightingsLoading || isAnalyticsLoading) {
		return <main className="p-8">Loading dashboard...</main>;
	}

	if (isSightingsError || isAnalyticsError || !sightings || !analytics) {
		return <main className="p-8 text-red-600">Something went wrong.</main>;
	}

	const locations = analytics.byCity.map((item) => item.location).sort();
	const mostReportedCity = [...analytics.byCity].sort(
		(a, b) => b.count - a.count,
	)[0];
	const mostReportedSpecies = [...analytics.bySpecies].sort(
		(a, b) => b.count - a.count,
	)[0];
	const totalSightings = analytics.total;

	return (
		<main className="mx-auto max-w-7xl space-y-4 px-3 py-10 w-full grid grid-cols-3 gap-3">
			<section className="col-span-full space-y-4 flex justify-between">
				<div>
					<h2 className="text-xl font-semibold">Filters</h2>
					<p className="text-sm text-neutral-400">
						Narrow down sightings by location and date.
					</p>
				</div>

				<div className="flex flex-wrap items-end gap-3">
					<div className="flex flex-col gap-1">
						<label htmlFor="location" className="text-sm text-neutral-400">
							Location
						</label>
						<select
							id="location"
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							className="rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2"
						>
							<option value="">All locations</option>
							{locations.map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="from" className="text-sm text-neutral-400">
							From
						</label>
						<input
							id="from"
							type="date"
							value={from}
							max={to || undefined}
							onChange={(event) => setFrom(event.target.value)}
							className="rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label htmlFor="to" className="text-sm text-neutral-400">
							To
						</label>
						<input
							id="to"
							type="date"
							value={to}
							min={from || undefined}
							onChange={(event) => setTo(event.target.value)}
							className="rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2"
						/>
					</div>

					<button
						type="button"
						onClick={() => {
							setLocation("");
							setFrom("");
							setTo("");
						}}
						className="rounded-lg border border-neutral-600 px-4 py-2.5 cursor-pointer text-sm hover:bg-neutral-700"
					>
						Clear filters
					</button>
				</div>
			</section>

			<section className="space-y-3 col-span-2">
				<div>
					<h2 className="text-xl font-semibold">Sightings map</h2>
					<p className="text-sm text-neutral-400">
						Markers show approximate city-centre locations. Showing{" "}
						{sightings.length.toLocaleString()} sightings
					</p>
				</div>

				<MapLoader sightings={sightings} />
			</section>

			<div className="space-y-3">
				<section className="space-y-3">
					<div>
						<h2 className="text-xl font-semibold">Recent sightings</h2>
						<p className="text-sm text-neutral-400">
							The most recent sightings on the tracker.
						</p>
					</div>

					<div className="divide-y rounded-xl overflow-hidden border-neutral-600 border">
						{sightings.slice(0, 5).map((sighting) => (
							<div
								key={sighting.id}
								className="flex justify-between gap-2 px-4 py-3 flex-row bg-neutral-800 border-neutral-600"
							>
								<div>
									<p className="font-medium">{sighting.species}</p>
									<p className="text-sm text-neutral-400">
										{sighting.latin_name}
									</p>
								</div>

								<div className="text-sm text-neutral-400 text-right">
									<p>{sighting.location}</p>
									<p>{new Date(sighting.date).toLocaleDateString("en-GB")}</p>
								</div>
							</div>
						))}
						{sightings.length === 0 && (
							<div className="px-4 py-3 text-sm text-neutral-400">
								No sightings found.
							</div>
						)}
					</div>
				</section>

				<section className="space-y-3">
					<div>
						<h2 className="text-xl font-semibold">Statistics</h2>
						<p className="text-sm text-neutral-400">
							Overview of recorded sightings.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
							<p className="text-sm text-neutral-400">Total sightings</p>
							<p className="mt-1 text-2xl font-semibold">
								{totalSightings.toLocaleString()}
							</p>
						</div>

						<div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
							<p className="text-sm text-neutral-400">Top location</p>
							<p className="mt-1 text-lg font-semibold">
								{mostReportedCity?.location ?? "—"}
							</p>
							<p className="text-xs text-neutral-400">
								{mostReportedCity?.count ?? 0} sightings
							</p>
						</div>

						<div className="col-span-2 rounded-xl border border-neutral-700 bg-neutral-800 p-4">
							<p className="text-sm text-neutral-400">Most reported species</p>
							<p className="mt-1 text-lg font-semibold">
								{mostReportedSpecies?.species ?? "—"}
							</p>
							<p className="text-xs text-neutral-400">
								{mostReportedSpecies?.count ?? 0} sightings
							</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
