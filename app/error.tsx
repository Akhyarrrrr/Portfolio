"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0B0F15] px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-6">
        <div className="h-12 w-12 rounded-full border-2 border-red-500/30 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
      <p className="max-w-md text-sm text-white/40">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-[#61DCA3] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#4ecf96]"
      >
        Try again
      </button>
    </div>
  );
}
