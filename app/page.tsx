"use client";

import React from "react";
import Navbar from "./Pages/Navbar";
import Hero from "./Pages/Hero";
import Background from "./Pages/Background";
import Project from "./Pages/Project";
import Experience from "./Pages/Experience";
import Tape from "./Pages/Tape";
import Skills from "./Pages/Skills";
import Contact from "./Pages/Contact";
import Footer from "./Pages/Footer";

export default function Home() {
  return (
    <>
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
    </>
  );
}
