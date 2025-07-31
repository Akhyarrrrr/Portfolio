"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999] w-full px-4">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left: Logo */}
        <span className="text-[#61DCA3] font-extrabold text-xl">Y.</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-white text-sm font-medium">
          <a href="#hero" className="hover:text-[#61DCA3] transition">
            Home
          </a>
          <a href="#experience" className="hover:text-[#61DCA3] transition">
            Experience
          </a>
          <a href="#project" className="hover:text-[#61DCA3] transition">
            Project
          </a>
          <a href="#contact" className="hover:text-[#61DCA3] transition">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-[#61DCA3] text-xl md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl py-4 px-6 text-white text-sm font-medium flex flex-col items-center gap-4 transition-all">
          <a
            href="#hero"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            Home
          </a>
          <a
            href="#experience"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            Experience
          </a>
          <a
            href="#project"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            Project
          </a>
          <a
            href="#contact"
            onClick={closeMenu}
            className="hover:text-[#61DCA3] transition"
          >
            Contact
          </a>
        </div>
      )}
    </div>
  );
}
