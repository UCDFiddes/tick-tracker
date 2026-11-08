"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import SpeciesGuide from "@/components/species-guide";
import type { ReportInput } from "@/lib/types";

export default function ReportPage() {
	const queryClient = useQueryClient();

	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");
	const [species, setSpecies] = useState("");

	const mutation = useMutation({
		mutationFn: async (report: ReportInput) => {
			const response = await fetch("/api/sightings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(report),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to submit sighting");
			}

			return result;
		},

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["sightings"] }),
				queryClient.invalidateQueries({ queryKey: ["analytics"] }),
			]);

			setDate("");
			setLocation("");
			setSpecies("");
		},
	});

	return (
		<main className="mx-auto max-w-7xl gap-3 px-4 py-10 grid grid-cols-2 w-full">
			<div className="space-y-6">
				<Link href="/" className="text-sm text-neutral-400 hover:text-white">
					Back to dashboard
				</Link>

				<div>
					<h2 className="text-xl font-semibold">Report a sighting</h2>
					<p className="text-sm text-neutral-400">
						Help us understand tick activity across the UK by reporting a
						sighting.
					</p>
				</div>

				<form
					onSubmit={(ev) => {
						ev.preventDefault();
						mutation.mutate({ date, location, species });
					}}
					className="space-y-4"
				>
					<div className="space-y-2">
						<label htmlFor="date" className="block text-sm font-medium">
							Date of sighting
						</label>
						<input
							id="date"
							type="date"
							required
							max={new Date().toISOString().slice(0, 10)}
							value={date}
							onChange={(event) => setDate(event.target.value)}
							className="w-full rounded-lg border border-neutral-600 p-3"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="location" className="block text-sm font-medium">
							Location
						</label>
						<input
							id="location"
							type="text"
							required
							minLength={2}
							maxLength={100}
							placeholder="e.g. London"
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							className="w-full rounded-lg border border-neutral-600 p-3"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="species" className="block text-sm font-medium">
							Tick species
						</label>
						<input
							id="species"
							type="text"
							required
							minLength={2}
							maxLength={100}
							placeholder="e.g. Sheep tick"
							value={species}
							onChange={(event) => setSpecies(event.target.value)}
							className="w-full rounded-lg border border-neutral-600 p-3"
						/>
					</div>

					{mutation.isError && (
						<p role="alert" className="text-sm text-red-400">
							{mutation.error.message}
						</p>
					)}

					{mutation.isSuccess && (
						<p role="status" className="text-sm text-green-400">
							Your sighting has been submitted successfully!
						</p>
					)}

					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full rounded-lg bg-neutral-950 px-4 py-3 font-medium text-white hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
					>
						{mutation.isPending ? "Submitting..." : "Submit sighting"}
					</button>
				</form>
			</div>
			<SpeciesGuide />
		</main>
	);
}
