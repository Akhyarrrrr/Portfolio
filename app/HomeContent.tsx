"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Background from "./components/layout/Background";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import SplashScreen from "./components/splash/SplashScreen";
import type { ProjectType, ExperienceType } from "@/lib/content";

// SSR enabled for all of these (default for next/dynamic) so their
// content — hero copy, project titles, experience entries — actually
// exists in the HTML Google/social crawlers receive. Still code-split
// into separate chunks via dynamic() for initial-JS savings; only
// Lanyard (nested inside Hero, WebGL/three.js) stays ssr:false since it
// cannot render server-side at all.
const Hero = dynamic(() => import("./components/sections/Hero"));
const About = dynamic(() => import("./components/sections/About"));
const Experience = dynamic(() => import("./components/sections/Experience"));
const Tape = dynamic(() => import("./components/sections/Tape"));
const Project = dynamic(() => import("./components/sections/Project"));
const Skills = dynamic(() => import("./components/sections/Skills"));
const Contact = dynamic(() => import("./components/sections/Contact"));
const ScrollToTop = dynamic(() => import("./components/layout/ScrollToTop"));
const Chatbot = dynamic(() => import("./components/GroqChatbot/Chatbot"));
const ProjectModal = dynamic(() => import("./components/projects/ProjectModal"));

type HomeContentProps = {
  projects: ProjectType[];
  experiences: ExperienceType[];
};

export default function HomeContent({ projects, experiences }: HomeContentProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Find selected project + related
  const selectedProject = useMemo(
    () => selectedSlug ? projects.find((p) => p.slug === selectedSlug) ?? null : null,
    [selectedSlug, projects],
  );
  const relatedProjects = useMemo(() => {
    if (!selectedProject) return [];
    const sameCategory = projects.filter(
      (p) => p.id !== selectedProject.id && p.category === selectedProject.category,
    );
    // Sort: projects with slug (have case study) first, then pinned, then rest
    sameCategory.sort((a, b) => {
      const aHasSlug = a.slug ? 1 : 0;
      const bHasSlug = b.slug ? 1 : 0;
      if (aHasSlug !== bHasSlug) return bHasSlug - aHasSlug;
      const aPinned = a.pinned ? 1 : 0;
      const bPinned = b.pinned ? 1 : 0;
      return bPinned - aPinned;
    });
    return sameCategory.slice(0, 3);
  }, [selectedProject, projects]);

  const handleSelectProject = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedSlug(null);
  }, []);

  // ponytail: browser-native replacement for a setTimeout(scrollTo(0), 50).
  // That timer fired 50ms after hydration — not after paint — with no guard
  // for "the user already scrolled", so on a cold load it landed after the
  // first flick and yanked the page back to the top. Opting out of the
  // browser's own scroll restoration is what that code actually wanted, and
  // it has no timer to race. Hash navigation stays native.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  return (
    // overflow-x-clip, not -hidden: on a non-root element `overflow-x: hidden`
    // forces `overflow-y` to compute to `auto`, making this div a nested
    // scroll container around the whole page (and silently breaking sticky
    // inside it). `clip` contains the same horizontal overflow without that.
    <div className="relative overflow-x-clip">
      <SplashScreen />
      <Background />
      <div className="relative z-10">
        <Navbar />
        <main id="main-content">
          <Suspense fallback={null}>
            <Hero />
          </Suspense>
          <Suspense fallback={null}>
            <About />
          </Suspense>
          <Suspense fallback={null}>
            <Experience experiences={experiences} />
          </Suspense>
          <Suspense fallback={null}>
            <Tape />
          </Suspense>
          <Suspense fallback={null}>
            <Project projects={projects} onSelectProject={handleSelectProject} />
          </Suspense>
          <Suspense fallback={null}>
            <Skills />
          </Suspense>
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
      <div className="fixed bottom-6 right-4 md:right-8 z-50 flex flex-col items-end gap-3">
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
      </div>

      {/* Project modal */}
      <Suspense fallback={null}>
        <ProjectModal
          project={selectedProject}
          relatedProjects={relatedProjects}
          onClose={handleCloseModal}
          onSelectProject={handleSelectProject}
        />
      </Suspense>
    </div>
  );
}
