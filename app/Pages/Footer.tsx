"use client";
import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0F15] border-t border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand / Name */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white tracking-wide">
            Akhyar
          </span>
          <span className="text-white/40 text-sm hidden md:inline">
            | Portfolio
          </span>
        </div>
        {/* Socials */}
        <div className="flex gap-5">
          <a
            href="https://github.com/Akhyarrrrr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-[#61DCA3] transition text-2xl"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/akhyarrr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-[#61DCA3] transition text-2xl"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com/akhyaar._"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-[#61DCA3] transition text-2xl"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="mailto:ahyar12324@email.com"
            className="text-white/70 hover:text-[#61DCA3] transition text-2xl"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>
        {/* Copyright */}
        <div className="text-white/40 text-sm text-center md:text-right">
          © {new Date().getFullYear()} Akhyar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
