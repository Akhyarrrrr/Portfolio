import { getProjects } from "@/lib/firestoreServer";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://akhyar.dev";

// ponytail: sitemap BASE_URL should match layout.tsx SITE_URL. Both default to the same domain now.

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
