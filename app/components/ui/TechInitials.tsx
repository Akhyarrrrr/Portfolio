/**
 * Auto-generates a consistent initials badge for any tech name.
 * Colors are deterministically hashed from the name so the same tech
 * always gets the same color across page loads.
 */
const PALETTE = [
  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "bg-lime-500/20 text-lime-300 border-lime-500/30",
  "bg-red-500/20 text-red-300 border-red-500/30",
  "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  "bg-green-500/20 text-green-300 border-green-500/30",
] as const;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  // Special cases: single-word names with known patterns
  if (name === "C#" || name === "C++") return name;
  if (name === "CLI") return "CL";

  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getTechColor(name: string) {
  return PALETTE[hashString(name) % PALETTE.length];
}

export function TechInitials({ name, className = "" }: { name: string; className?: string }) {
  const initials = getInitials(name);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border text-[10px] font-bold ${getTechColor(name)} ${className}`}
      title={name}
    >
      {initials}
    </span>
  );
}

export function TechBadge({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold ${getTechColor(name)} ${className}`}
      title={name}
    >
      <TechInitials name={name} className="h-5 w-5 rounded text-[9px]" />
      {name}
    </span>
  );
}
