import { getProjects, getExperiences } from "@/lib/content";
import { personSchema } from "@/lib/schema-generator";
import JsonLd from "@/app/components/schema/JsonLd";
import HomeContent from "./HomeContent";

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
