import type { ProjectType } from "./content";
import { profile } from "@/content/profile";

const SITE_URL = profile.siteUrl;

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Akhyar Portfolio",
    url: SITE_URL,
    inLanguage: ["en", "id"],
    publisher: { "@type": "Person", name: profile.name },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.alternateName,
    url: profile.siteUrl,
    jobTitle: profile.jobTitle,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Banda Aceh",
      addressCountry: "ID",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universitas Syiah Kuala",
    },
    knowsAbout: profile.skills,
    sameAs: Object.values(profile.socials),
  };
}

export function projectSchema(project: ProjectType) {
  const title = project.title_en || project.title || "";
  const desc = project.desc_en || project.description || "";

  const type = project.schemaType ?? "SoftwareApplication";
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description: desc,
    image: `${SITE_URL}${project.imageUrl}`,
    url: project.liveUrl || project.githubUrl,
    author: { "@type": "Person", name: profile.name, url: profile.siteUrl },
  };
  if (type === "SoftwareApplication") {
    schema.applicationCategory =
      project.category === "mobile" ? "MobileApplication" : "WebApplication";
  }
  return schema;
}
