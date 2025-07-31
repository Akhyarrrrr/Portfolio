"use client";

import React, { useEffect } from "react";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import Background from "./pages/Background";
import Project from "./pages/Project";
import Experience from "./pages/Experience";
import Tape from "./pages/Tape";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";

export default function Home() {
  // Smooth scroll to top on refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        history.replaceState(null, "", "/");
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-Poppins">
      {/* Background Animation */}
      <Background />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Experience Section */}
      <Experience />

      {/* Tape Component */}
      <Tape />

      {/* Project Section */}
      <Project />

      {/* Skills Section */}
      <Skills />

      {/* Contact Section */}
      <Contact />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
