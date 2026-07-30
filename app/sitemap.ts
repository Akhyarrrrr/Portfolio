import { getProjects } from "@/lib/content";

const BASE_URL = "https://akhyar.dev";

export default async function sitemap() {
  const projects = await getProjects();
  const projectEntries = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: new Date(),
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
