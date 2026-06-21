export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F15]"
      aria-label="Loading"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(97,220,163,0.15)_0%,transparent_70%)]" />
      </div>

      {/* Rotating ring */}
      <div className="absolute flex items-center justify-center">
        <div className="relative h-28 w-28 animate-spin" style={{ animationDuration: "8s" }}>
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
        </div>
      </div>

      {/* Logo */}
      <span className="relative text-7xl font-extrabold tracking-tight">
        <span className="relative inline-block">
          <span
            className="bg-gradient-to-b from-[#61DCA3] via-[#3dd68c] to-[#2a9a63] bg-clip-text text-transparent"
            style={{ textShadow: "0 0 60px rgba(97,220,163,0.35)" }}
          >
            Y.
          </span>
          <span className="absolute inset-0 animate-pulse rounded-full bg-[#61DCA3]/20 blur-2xl" style={{ filter: "blur(40px)" }} />
        </span>
      </span>

      {/* Subtitle */}
      <p className="mt-6 text-sm font-medium tracking-[0.2em] text-white/30 uppercase">
        Portfolio
      </p>

      {/* Shimmer loading bar */}
      <div className="absolute bottom-12 mx-auto h-0.5 w-48 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full w-full bg-gradient-to-r from-transparent via-[#61DCA3] to-transparent"
          style={{ animation: "shimmer 1.2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}
