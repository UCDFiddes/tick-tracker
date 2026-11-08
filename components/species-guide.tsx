const ticks = [
	{
		name: "Sheep/deer tick",
		latin: "Ixodes ricinus",
		description:
			"The UK's most widespread tick. Commonly found in woodland, grassland and areas with long vegetation.",
	},
	{
		name: "Hedgehog tick",
		latin: "Ixodes hexagonus",
		description:
			"Commonly associated with hedgehogs, but can also be found on dogs, cats and other mammals.",
	},
	{
		name: "Fox/badger tick",
		latin: "Ixodes canisuga",
		description: "Often found on foxes, badgers and domestic dogs.",
	},
	{
		name: "Ornate cow tick",
		latin: "Dermacentor reticulatus",
		description:
			"Recognisable by its patterned dorsal shield. Found in parts of Wales and south-west England.",
	},
	{
		name: "Red sheep tick",
		latin: "Haemaphysalis punctata",
		description:
			"Primarily associated with sheep, with records mainly in south-east England and parts of south Wales.",
	},
];

export default function SpeciesGuide() {
	return (
		<aside className="h-fit rounded-xl border border-neutral-700 bg-neutral-900 p-5">
			<h2 className="text-lg font-semibold">Tick identification guide</h2>

			<p className="mt-2 text-sm text-neutral-400">
				Not sure what type of tick you've found? Here are some commonly recorded
				UK species.
			</p>

			<div className="mt-5 space-y-5">
				{ticks.map((tick) => (
					<article key={tick.latin}>
						<h3 className="font-medium">{tick.name}</h3>
						<p className="text-xs italic text-neutral-500">{tick.latin}</p>
						<p className="mt-1 text-sm text-neutral-400">{tick.description}</p>
					</article>
				))}
			</div>

			<div className="mt-5 border-t border-neutral-700 pt-4">
				<h3 className="text-sm font-medium">Can't identify your tick?</h3>
				<p className="mt-1 text-sm text-neutral-400">
					Don't guess. Submit your sighting as an unidentified tick if you're
					unsure.
				</p>
			</div>

			<a
				href="https://www.gov.uk/guidance/tick-species-profiles"
				target="_blank"
				rel="noopener noreferrer"
				className="mt-4 inline-block text-sm text-amber-500 hover:underline"
			>
				View official UK tick species profiles ↗
			</a>
		</aside>
	);
}
