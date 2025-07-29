"use client";

import React from "react";
import Lanyard from "./components/Lanyard/Lanyard";
import AnimatedContent from "./components/AnimatedContent/AnimatedContent";
import BlurText from "./components/BlurText/BlurText";
import SplitText from "./components/SplitText/SplitText";
import Squares from "./components/Squares/Squares";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";

export default function Home() {
  return (
    <>
      <div className="min-h-screen overflow-x-hidden font-Poppins">
        {/* Background */}
        <div className="absolute top-0 right-0 left-0 bottom-0 w-full h-full">
          <Squares
            speed={0.2}
            squareSize={40}
            direction="diagonal"
            borderColor="#FFFFFF"
            hoverFillColor="#61DCA3"
          />
        </div>

        {/* Navbar */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full px-4">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 px-8 py-3 rounded-full flex items-center justify-between max-w-screen-lg mx-auto">
            {/* Left: Logo */}
            <span className="text-[#61DCA3] font-extrabold text-xl">Y.</span>

            {/* Right: Menu */}
            <div className="flex gap-6 text-white text-sm font-medium">
              <a href="#home" className="hover:text-[#61DCA3] transition">
                Home
              </a>
              <a href="#project" className="hover:text-[#61DCA3] transition">
                Project
              </a>
              <a href="#contact" className="hover:text-[#61DCA3] transition">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto max-w-screen-lg h-screen px-4">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Kiri */}
            <div className="col-span-6 flex items-center">
              <div className="flex items-center h-full">
                <div className="flex flex-col gap-6 ">
                  <AnimatedContent
                    distance={150}
                    direction="horizontal"
                    reverse={false}
                    config={{ tension: 80, friction: 20 }}
                    initialOpacity={0.2}
                    animateOpacity
                    scale={1.1}
                    threshold={0.2}
                  >
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl text-white font-semibold">
                        Welcome to My Portfolio...
                      </h1>
                    </div>
                  </AnimatedContent>

                  <div className="flex flex-col items-start">
                    <SplitText
                      text="Hey, I'm"
                      className="text-6xl font-semibold text-start"
                      delay={50}
                      animationFrom={{
                        opacity: 0,
                        transform: "translate3d(0,50px,0)",
                      }}
                      animationTo={{
                        opacity: 1,
                        transform: "translate3d(0,0,0)",
                      }}
                      threshold={0.2}
                      rootMargin="-50px"
                    />
                    <SplitText
                      text="Akhyar"
                      className="text-6xl font-semibold text-start text-[#61DCA3]"
                      delay={75}
                      animationFrom={{
                        opacity: 0,
                        transform: "translate3d(0,50px,0)",
                      }}
                      animationTo={{
                        opacity: 1,
                        transform: "translate3d(0,0,0)",
                      }}
                      threshold={0.2}
                      rootMargin="-50px"
                    />
                  </div>

                  <BlurText
                    text="Just finished my Informatics degree, and right now I'm really into building cool digital stuff from websites to mobile apps. I enjoy coding and love turning ideas into something real and useful. Got something in mind? Let's build it together!"
                    delay={75}
                    animateBy="words"
                    direction="top"
                    className="text-xl mb-8"
                  />

                  {/* CV */}
                  <div className="flex items-center gap-4 relative z-50">
                    {/* Button Download CV */}
                    <div className="flex items-center gap-4 relative z-50">
                      {/* Download CV Button */}
                      <a
                        href="/CV-Akhyar.pdf"
                        download
                        className="flex items-center gap-2 px-8 py-4 rounded-lg border border-[#61DCA3] text-[#61DCA3] 
                   hover:bg-[#61DCA3] hover:text-white transition duration-300 active:scale-95"
                      >
                        <span>Download CV</span>
                        <HiDownload className="w-5 h-5" />
                      </a>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-3">
                      {/* Instagram */}
                      <a
                        href="https://instagram.com/akhyaar._"
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                      >
                        <FaInstagram size={20} />
                      </a>

                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/in/akhyarrr/"
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                      >
                        <FaLinkedin size={20} />
                      </a>

                      {/* GitHub */}
                      <a
                        href="https://github.com/Akhyarrrrr"
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                      >
                        <FaGithub size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="col-span-6 mt-10 md:mt-0 pt-0 md:pt-6">
              <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
