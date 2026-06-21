"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  // Always start visible for SSR — avoids hydration mismatch.
  // useLayoutEffect below runs before paint and hides it if needed.
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    // Client-side only: decide whether to actually show the splash
    if (sessionStorage.getItem("splashShown")) {
      setVisible(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    // First visit — show splash, then auto-hide
    sessionStorage.setItem("splashShown", "1");
    // ponytail: sessionStorage write above guards against Strict Mode
    // double-mount — the second invocation sees the key and hides immediately,
    // both before paint, so user never sees a flash.
    timerRef.current = setTimeout(() => setVisible(false), 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Listen for reduced-motion changes while splash is visible
  useEffect(() => {
    if (!visible) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setVisible(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F15]"
          aria-hidden
        >
          {/* Radial glow behind logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(97,220,163,0.15)_0%,transparent_70%)]"
            />
          </div>

          {/* Rotating ring */}
          <div className="absolute flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="relative h-28 w-28"
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * 360;
                return (
                  <div
                    key={i}
                    className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-[#61DCA3]/40"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-0.25rem)`,
                      opacity: 0.3 + (i % 3 === 0 ? 0.4 : 0),
                    }}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Logo */}
          <motion.span
            initial={{ scale: 0.5, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative text-7xl font-extrabold tracking-tight"
          >
            <span className="relative inline-block">
              <span
                className="bg-gradient-to-b from-[#61DCA3] via-[#3dd68c] to-[#2a9a63] bg-clip-text text-transparent"
                style={{ textShadow: "0 0 60px rgba(97,220,163,0.35)" }}
              >
                Y.
              </span>
              {/* Pulsing glow ring */}
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#61DCA3]/20 blur-2xl"
                style={{ filter: "blur(40px)" }}
              />
            </span>
          </motion.span>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-sm font-medium tracking-[0.2em] text-white/30 uppercase"
          >
            Portfolio
          </motion.p>

          {/* Shimmer loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-12 mx-auto h-0.5 w-48 overflow-hidden rounded-full bg-white/5"
          >
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-[#61DCA3] to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
