"use client";

import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Background from "./Background";
import Project from "./Project";
import Experience from "./Experience";
import Tape from "./Tape";
import Skills from "./Skills";
import Contact from "./Contact";
import Footer from "./Footer";

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
