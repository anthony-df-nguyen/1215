import { config } from "dotenv";
config({ path: ".env.local" });

import { memories, type MemoryLink } from "./schema";

const SEED_USER = "seed@example.com";

const seedMemories: {
  title: string;
  description: string | null;
  memoryDate: string;
  datePrecision: "day" | "month" | "year";
  images: string[];
  links: MemoryLink[];
}[] = [
  {
    title: "Road trip to the coast",
    description: "Drove up Highway 1, stopped at every overlook we could find.",
    memoryDate: "2019-06-14",
    datePrecision: "day",
    images: ["https://picsum.photos/seed/coast-1/800/600"],
    links: [{ url: "https://maps.google.com/?q=highway+1", label: "Route" }],
  },
  {
    title: "Adopted our dog",
    description: "Picked her up from the shelter, she slept the whole car ride home.",
    memoryDate: "2020-03-01",
    datePrecision: "day",
    images: [
      "https://picsum.photos/seed/dog-1/800/600",
      "https://picsum.photos/seed/dog-2/800/600",
    ],
    links: [],
  },
  {
    title: "First apartment together",
    description: "Signed the lease and spent the weekend assembling IKEA furniture.",
    memoryDate: "2020-09-01",
    datePrecision: "month",
    images: [],
    links: [{ url: "https://example.com/apartment-listing" }],
  },
  {
    title: "Backpacking in the mountains",
    description: null,
    memoryDate: "2021-07-01",
    datePrecision: "month",
    images: ["https://picsum.photos/seed/mountains-1/800/600"],
    links: [],
  },
  {
    title: "Home cooked Thanksgiving",
    description: "First time hosting, only minor smoke alarm incident.",
    memoryDate: "2021-11-25",
    datePrecision: "day",
    images: [],
    links: [],
  },
  {
    title: "Trip to Japan",
    description: "Two weeks through Tokyo, Kyoto, and Osaka.",
    memoryDate: "2022-04-01",
    datePrecision: "month",
    images: [
      "https://picsum.photos/seed/japan-1/800/600",
      "https://picsum.photos/seed/japan-2/800/600",
      "https://picsum.photos/seed/japan-3/800/600",
    ],
    links: [{ url: "https://example.com/japan-itinerary", label: "Itinerary" }],
  },
  {
    title: "Bought our first house",
    description: "Closed on the house after a stressful month of paperwork.",
    memoryDate: "2022-08-19",
    datePrecision: "day",
    images: ["https://picsum.photos/seed/house-1/800/600"],
    links: [{ url: "https://example.com/house-listing", label: "Listing" }],
  },
  {
    title: "Started woodworking hobby",
    description: null,
    memoryDate: "2023-01-01",
    datePrecision: "year",
    images: [],
    links: [],
  },
  {
    title: "Ran our first half marathon",
    description: "Trained for four months, finished together at the same time.",
    memoryDate: "2023-05-06",
    datePrecision: "day",
    images: ["https://picsum.photos/seed/marathon-1/800/600"],
    links: [{ url: "https://example.com/race-results" }],
  },
  {
    title: "Camping under the meteor shower",
    description: "Stayed up until 3am watching shooting stars.",
    memoryDate: "2023-08-01",
    datePrecision: "month",
    images: [],
    links: [],
  },
  {
    title: "Holiday in New York",
    description: "Ice skating, the tree at Rockefeller Center, way too much walking.",
    memoryDate: "2023-12-23",
    datePrecision: "day",
    images: [
      "https://picsum.photos/seed/nyc-1/800/600",
      "https://picsum.photos/seed/nyc-2/800/600",
    ],
    links: [],
  },
  {
    title: "Garden renovation",
    description: "Ripped out the old lawn and put in raised beds.",
    memoryDate: "2024-03-01",
    datePrecision: "month",
    images: ["https://picsum.photos/seed/garden-1/800/600"],
    links: [],
  },
  {
    title: "Anniversary dinner",
    description: "Went back to the restaurant from our first date.",
    memoryDate: "2024-06-14",
    datePrecision: "day",
    images: [],
    links: [{ url: "https://example.com/restaurant", label: "Restaurant" }],
  },
  {
    title: "Learned to sail",
    description: null,
    memoryDate: "2024-01-01",
    datePrecision: "year",
    images: [],
    links: [],
  },
  {
    title: "Weekend in the desert",
    description: "Stargazing and way too much sun.",
    memoryDate: "2025-02-01",
    datePrecision: "month",
    images: ["https://picsum.photos/seed/desert-1/800/600"],
    links: [],
  },
  {
    title: "New Year's Eve at home",
    description: "Cozy night in, cooked a big dinner and watched fireworks from the roof.",
    memoryDate: "2025-12-31",
    datePrecision: "day",
    images: [],
    links: [],
  },
];

async function main() {
  const { db } = await import("./index");

  console.log(`Seeding ${seedMemories.length} memories...`);

  await db.insert(memories).values(
    seedMemories.map((m) => ({
      ...m,
      createdBy: SEED_USER,
    }))
  );

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
