import { getProjects, getProjectBySlug } from "@/lib/firestoreServer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { personSchema, projectSchema, breadcrumbSchema } from "@/lib/schema-generator";
import JsonLd from "@/app/components/schema/JsonLd";
import ProjectDetailClient from "./ProjectDetailClient";

const SITE_URL = "https://akhyar.dev";

export const revalidate = 86400; // ISR: regenerate at most every 24h (fallback)

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title = project.title_en || project.title || "";
  const desc = project.desc_en || project.description || "";

  return {
    title: `${title} | Akhyar Portfolio`,
    description: desc,
    // Without this, the page silently inherits the root layout's
    // `alternates: { canonical: "/" }` — every project page was reporting
    // the homepage as its canonical URL, telling Google all 15 project
    // pages were duplicates of "/" instead of distinct, indexable pages.
    alternates: {
      canonical: `${SITE_URL}/projects/${slug}`,
      languages: {
        en: `${SITE_URL}/projects/${slug}`,
        id: `${SITE_URL}/projects/${slug}`,
        "x-default": `${SITE_URL}/projects/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Akhyar`,
      description: desc,
      // No manual `images` — app/projects/[slug]/opengraph-image.tsx
      // generates a branded card (title + tech stack) per project.
      // Setting images here would silently override that file-based
      // generation instead of merging with it.
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const sameCategory = allProjects.filter(
    (p) => p.id !== project.id && p.category === project.category,
  );
  // Prioritize: projects with slug (case study) first, then pinned
  sameCategory.sort((a, b) => {
    const aSlug = a.slug ? 1 : 0;
    const bSlug = b.slug ? 1 : 0;
    if (aSlug !== bSlug) return bSlug - aSlug;
    const aPin = a.pinned ? 1 : 0;
    const bPin = b.pinned ? 1 : 0;
    return bPin - aPin;
  });
  const related = sameCategory.slice(0, 3);

  const title = project.title_en || project.title || "";

  return (
    <>
      <JsonLd id="person-schema" data={personSchema()} />
      <JsonLd id="project-schema" data={projectSchema(project)} />
      <JsonLd
        id="breadcrumb-schema"
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Projects", url: `${SITE_URL}/#project` },
          { name: title, url: `${SITE_URL}/projects/${slug}` },
        ])}
      />
      <ProjectDetailClient project={project} relatedProjects={related} />
    </>
  );
}
