"use client";

import React from "react";
import Navbar from "./components/Pages/Navbar";
import Hero from "./components/Pages/Hero";
import Background from "./components/Pages/Background";
import Project from "./components/Pages/Project";
import Experience from "./components/Pages/Experience";

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

        {/* Project Section */}
        <Project />

        {/* Contact Section */}
      </div>
    </>
  );
}
