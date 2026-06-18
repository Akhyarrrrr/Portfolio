"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import LazyMount from "./components/common/LazyMount";
import Background from "./components/layout/Background";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";

const About = dynamic(() => import("./components/sections/About"));
const Experience = dynamic(() => import("./components/sections/Experience"));
const Tape = dynamic(() => import("./components/sections/Tape"));
const Project = dynamic(() => import("./components/sections/Project"));
const Skills = dynamic(() => import("./components/sections/Skills"));
const Contact = dynamic(() => import("./components/sections/Contact"));
const ScrollToTop = dynamic(() => import("./components/layout/ScrollToTop"), {
  ssr: false,
});
const Chatbot = dynamic(() => import("./components/GroqChatbot/Chatbot"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      history.replaceState(null, "", "/");
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    /*
     * Root wrapper: relative + overflow-x-hidden.
     * Background grid is absolute inside this, so it fills the entire page height.
     * NO bg color here — bg is set on <body> in globals.css so Background grid
     * renders on top of it correctly.
     */
    <div className="relative overflow-x-hidden">
      {/* Animated squares grid — absolute, spans full page height */}
      <Background />

      {/* Page content — z-10 sits above the grid */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <LazyMount id="about" minHeight={920}>
            <About />
          </LazyMount>
          <LazyMount id="experience" minHeight={980}>
            <Experience />
          </LazyMount>
          <LazyMount minHeight={180}>
            <Tape />
          </LazyMount>
          <LazyMount id="project" minHeight={1180}>
            <Project />
          </LazyMount>
          <LazyMount id="skills" minHeight={720}>
            <Skills />
          </LazyMount>
          <LazyMount id="contact" minHeight={880}>
            <Contact />
          </LazyMount>
        </main>
        <Footer />
      </div>

      {/* Floating utilities — fixed, chatbot on top, scroll-to-top below */}
      <div className="fixed bottom-6 right-4 md:right-8 z-50 flex flex-col items-end gap-3">
        <Chatbot />
        <ScrollToTop />
      </div>
    </div>
  );
}
