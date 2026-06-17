"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Background from "./Background";
import Footer from "./Footer";

const About = dynamic(() => import("./About"));
const Experience = dynamic(() => import("./Experience"));
const Tape = dynamic(() => import("./Tape"));
const Project = dynamic(() => import("./Project"));
const Skills = dynamic(() => import("./Skills"));
const Contact = dynamic(() => import("./Contact"));
const ScrollToTop = dynamic(() => import("./ScrollToTop"), { ssr: false });
const Chatbot = dynamic(() => import("./components/GroqChatbot/Chatbot"), {
  ssr: false,
});

function LazyMount({
  children,
  minHeight = 720,
}: {
  children: ReactNode;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={ref} style={!mounted ? { minHeight } : undefined}>
      {mounted ? children : null}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;
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
          <LazyMount minHeight={920}>
            <About />
          </LazyMount>
          <LazyMount minHeight={980}>
            <Experience />
          </LazyMount>
          <LazyMount minHeight={180}>
            <Tape />
          </LazyMount>
          <LazyMount minHeight={1180}>
            <Project />
          </LazyMount>
          <LazyMount minHeight={720}>
            <Skills />
          </LazyMount>
          <LazyMount minHeight={880}>
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
