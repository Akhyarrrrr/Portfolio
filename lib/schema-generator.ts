import type { ProjectType } from "./firestoreCrud";

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
