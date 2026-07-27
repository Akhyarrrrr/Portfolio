import type { ProjectType } from "./firestoreCrud";

const SITE_URL = "https://akhyar.dev";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Akhyar Portfolio",
    url: SITE_URL,
    inLanguage: ["en", "id"],
    publisher: { "@type": "Person", name: "Akhyar" },
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
    name: "Akhyar",
    url: "https://akhyar.dev",
    jobTitle: "Full-Stack Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Banda Aceh",
      addressCountry: "ID",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universitas Syiah Kuala",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
      "Firebase",
      "Supabase",
      "Docker",
    ],
    sameAs: [
      "https://github.com/Akhyarrrrr",
      "https://linkedin.com/in/akhyarrr",
      "https://instagram.com/akhyaar._",
    ],
  };
}

export function projectSchema(project: ProjectType) {
  const title = project.title_en || project.title || "";
  const desc = project.desc_en || project.description || "";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description: desc,
    applicationCategory:
      project.category === "mobile" ? "MobileApplication" : "WebApplication",
    image: project.imageUrl,
    url: project.liveUrl || project.githubUrl,
    author: { "@type": "Person", name: "Akhyar" },
  };
}
