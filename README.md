# TickWatch

A UK tick sightings tracker that visualises recorded tick sightings, provides basic insights and allows users to submit new sightings. This uses a fake dataset provided by [Elanco](https://dev-task.elancoapps.com/).

## Features

- Interactive map displaying tick sightings across the UK.
- Filter sightings by location and date range.
- View recent sightings and basic statistics.
- Submit new tick sightings through a validated form.
- Educational guide covering common UK tick species.

## Technology Stack

- **Next.js** – Full-stack application and API routes.
- **TypeScript** – Type safety across the application.
- **SQLite** – Lightweight relational database for storing sightings.
- **React Query** – Fetching, caching and invalidating server data.
- **React Leaflet** – Interactive map visualisation.
- **Tailwind CSS** – Styling and responsive layouts.
- **Zod** – Data validation.

## Architecture and Design Decisions

I made this project using Next.js as it has a full-stack architecture. This allowed me to create API routes to handle data retrieval, submissions and aggregations.

I took the decision to use SQLite due to its lightweight design, ability to handle a project of this scale and it does not require a seperate database server. It contains all sightings recorded and can be synced with the external API provided using a POST endpoint. A `source` field in the database distinguishes between externally sourced sightings and community submissions. External records use their original IDs, with duplicate records ignored during synchronisation.

The application retrieves existing sightings from the provided Elanco API and validates the response before storing records in SQLite. The frontend retrieves sightings through the application's API routes. I made React Query manage fetching and client-side caching, with query parameters used to filter results by location and date.

Sightings are displayed on an interactive UK map, alongside recent reports and aggregated statistics. Since the source API only provides city names rather than precise coordinates, map markers represent approximate city-centre locations. Users can also submit sightings through a form. Submissions are validated using Zod and stored in the same database as externally sourced records.

## Running Locally

### Prerequisites

- Node.js
- pnpm (or your chosen package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/UCDFiddes/tick-tracker
   cd tickwatch
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

### Initial Data Synchronisation

After starting the application, visiting the home page should populate the local database. However if this fails for some reason you can populate it manually by sending a POST request to:

```text
http://localhost:3000/api/sync
```

This retrieves sightings from the Elanco API and stores them in SQLite. The synchronisation can safely be repeated without inserting duplicate records.

## Future Improvements

Given more development time, I would consider:

- Not hard-coding the different geographical coodinates. Maybe even consider storing exact locations for individual sightings.
- Add support for images in sighting submissions.
- Add more guides and support in identifying different species.
- Look into server-side rendering and more caching techniques.
- Add pagination and better data retrieval to be able to handle larger datasets.
- Add automated tests for API routes, validation and data processing.