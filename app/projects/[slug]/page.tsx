import { getProjects, getProjectBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { personSchema, projectSchema } from "@/lib/schema-generator";
import JsonLd from "@/app/components/schema/JsonLd";
import ProjectDetailClient from "./ProjectDetailClient";

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
    openGraph: {
      title: `${title} | Akhyar`,
      description: desc,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
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

  return (
    <>
      <JsonLd data={personSchema()} />
      <JsonLd data={projectSchema(project)} />
      <ProjectDetailClient project={project} relatedProjects={related} />
    </>
  );
}
