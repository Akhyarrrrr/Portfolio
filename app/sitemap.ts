import { getProjects } from "@/lib/content";

const BASE_URL = "https://akhyar.dev";

// project.year is a display string (e.g. "2026", "2021 - 2025") rather than
// a real timestamp, but it's a truthful signal of when the work actually
// happened — unlike `new Date()`, which claimed every project changed at
// the moment of the last build regardless of whether anything did.
function lastModifiedFromYear(year: string | undefined): Date {
  const match = year?.match(/\d{4}/);
  if (!match) return new Date("2024-01-01");
  return new Date(`${match[0]}-01-01`);
}

export default async function sitemap() {
  const projects = await getProjects();
  const projectEntries = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: lastModifiedFromYear(p.year),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...projectEntries,
  ];
}
