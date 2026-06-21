"use client";

import { Fragment, useEffect, useRef } from "react";

const achievements = [
  "90+ Academic Journals Managed",
  "1,690+ Annual Submissions",
  "99.9% Platform Uptime",
  "6+ Projects Shipped",
  "Zero-Data-Loss Migration",
  "CI/CD & Dockerized Deploys",
  "AI-Powered Face Recognition",
  "Production-Ready Systems",
];

export default function Tape() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (reduced: boolean) => {
      track.style.animationPlayState = reduced ? "paused" : "running";
    };
    const handleMotionChange = (event: MediaQueryListEvent) => {
      apply(event.matches);
    };

    apply(mq.matches);
    mq.addEventListener("change", handleMotionChange);
    return () => mq.removeEventListener("change", handleMotionChange);
  }, []);

  return (
    <div className="py-16 lg:py-24 overflow-x-clip bg-[#0B0F15]">
      <div className="bg-gradient-to-r from-[#2B4539] via-[#61DCA3] to-[#2B4539] -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            ref={trackRef}
            className="flex flex-none gap-5 pr-5 py-6"
            style={{ animation: "move-left 30s linear infinite" }}
          >
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {achievements.map((achievement) => (
                  <div key={achievement} className="inline-flex items-center gap-5">
                    <span className="select-none text-lg font-extrabold uppercase tracking-[0.08em] text-[#0B0F15]">
                      {achievement}
                    </span>
                    <img
                      src="/assets/icons/star.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-6 -rotate-12"
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes move-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
