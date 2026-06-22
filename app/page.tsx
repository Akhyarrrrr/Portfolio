import { getProjects, getExperiences } from "@/lib/firestoreServer";
import { personSchema } from "@/lib/schema-generator";
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
      <JsonLd data={personSchema()} />
      <HomeContent projects={projects} experiences={experiences} />
    </>
  );
}
