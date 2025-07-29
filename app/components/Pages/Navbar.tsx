export default function Navbar() {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[999] w-full px-4">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 px-8 py-3 rounded-full flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left: Logo */}
        <span className="text-[#61DCA3] font-extrabold text-xl">Y.</span>

        {/* Right: Menu */}
        <div className="flex gap-6 text-white text-sm font-medium">
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
      </div>
    </div>
  );
}
