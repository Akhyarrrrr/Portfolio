"use client";

import { Fragment } from "react";

const words = [
  "Full Stack Developer",
  "Creative Coder",
  "React & Express",
  "Mobile & Web",
  "Problem Solver",
  "Tailwind Enthusiast",
  "Modern UI/UX",
  "Tech Explorer",
  "Open Source Lover",
  "Build with Passion",
];

export default function Tape() {
  return (
    <div className="py-16 lg:py-24 overflow-x-clip bg-[#0B0F15]">
      <div className="bg-gradient-to-r from-[#2B4539] via-[#61DCA3] to-[#2B4539]  -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex flex-none gap-4 pr-4 py-6 move-left">
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {words.map((word) => (
                  <div key={word} className="inline-flex gap-4 items-center">
                    <span className="text-[#0B0F15] uppercase font-extrabold text-lg">
                      {word}
                    </span>
                    <img
                      src="/assets/icons/star.svg"
                      alt="icon"
                      className="size-6 text-white -rotate-12"
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* STYLE LOCAL */}
      <style jsx>{`
        .move-left {
          animation: move-left 30s linear infinite;
        }

        @keyframes move-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
