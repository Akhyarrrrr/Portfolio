export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#0B0F15] px-4 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Hero skeleton */}
        <div className="mb-10 h-64 animate-pulse rounded-2xl bg-white/5 sm:h-80 lg:h-96" />

        {/* Title skeleton */}
        <div className="mb-4 h-8 w-3/4 animate-pulse rounded-lg bg-white/5" />
        <div className="mb-8 h-4 w-1/2 animate-pulse rounded-lg bg-white/5" />

        {/* Content skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-white/5"
              style={{ width: `${85 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
