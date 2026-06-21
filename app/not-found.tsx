import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0B0F15] px-4 text-center">
      <p className="text-8xl font-extrabold tracking-tight text-[#61DCA3]/20">
        404
      </p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="max-w-md text-sm text-white/40">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[#61DCA3] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#4ecf96]"
      >
        Back to home
      </Link>
    </div>
  );
}
