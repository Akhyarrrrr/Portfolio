"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.85, y: 18 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          exit={{ opacity: 0, scale: 0.85, y: 18 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
            y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="flex h-12 w-12 items-center justify-center
                     rounded-2xl border border-[#61DCA3]/40 bg-[#61DCA3]/10
                     text-[#61DCA3]
                     shadow-[0_4px_20px_rgba(97,220,163,0.2)]
                     hover:bg-[#61DCA3]/20 hover:border-[#61DCA3]/70
                     hover:shadow-[0_4px_28px_rgba(97,220,163,0.35)]
                     active:scale-95 transition-all duration-200 cursor-pointer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
