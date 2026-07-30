"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const SOCIALS = [
  { href: "https://github.com/Akhyarrrrr", Icon: FaGithub, label: "GitHub" },
  { href: "https://www.linkedin.com/in/akhyarrr/", Icon: FaLinkedin, label: "LinkedIn" },
  { href: "https://instagram.com/akhyaar._", Icon: FaInstagram, label: "Instagram" },
  { href: "mailto:ahyar12324@gmail.com", Icon: FaEnvelope, label: "Email" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  const reduceMotion = useReducedMotion();

  return (
    <footer className="w-full border-t border-white/8 bg-[#0B0F15]">
      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tight text-white">Y.</span>
          <div className="hidden h-5 w-px bg-white/15 md:block" />
          <span className="hidden text-sm text-white/60 md:inline">
            Akhyar's Portfolio
          </span>
        </div>

        <div className="flex gap-3">
          {SOCIALS.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              aria-label={label}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white/60 transition-all duration-200 hover:border-[#61DCA3]/40 hover:bg-[#61DCA3]/10 hover:text-[#61DCA3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61DCA3]/60"
            >
              <Icon />
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-white/60 md:text-right">
          Copyright {year} Akhyar. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
