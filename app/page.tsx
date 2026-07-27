import { getProjects, getExperiences } from "@/lib/firestoreServer";
import { personSchema, websiteSchema } from "@/lib/schema-generator";
import JsonLd from "@/app/components/schema/JsonLd";
import HomeContent from "./HomeContent";

export const revalidate = 3600; // ISR: regenerate at most every hour (fallback)

export default async function HomePage() {
  const [projects, experiences] = await Promise.all([
    getProjects(),
    getExperiences(),
  ]);

  return (
    <>
      <JsonLd id="person-schema" data={personSchema()} />
      <JsonLd id="website-schema" data={websiteSchema()} />
      <HomeContent projects={projects} experiences={experiences} />
    </>
  );
}
