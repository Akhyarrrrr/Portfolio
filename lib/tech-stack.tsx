import type { ReactNode } from "react";
import {
  Database,
  CreditCard,
  Sparkles,
  TerminalSquare,
  type LucideProps,
} from "lucide-react";
import {
  BiLogoCPlusPlus,
  BiLogoJava,
  BiLogoUnity,
  BiLogoVisualStudio,
} from "react-icons/bi";
import { FaCss3Alt, FaGithub, FaGitAlt, FaHtml5, FaReact } from "react-icons/fa";
import {
  SiCheerio,
  SiClerk,
  SiCloudinary,
  SiDocker,
  SiDrizzle,
  SiExpo,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGnubash,
  SiGo,
  SiGraphql,
  SiJavascript,
  SiKotlin,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiRailway,
  SiRedis,
  SiRust,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { TbApi, TbBrandCSharp } from "react-icons/tb";

type TechDefinition = {
  key: string;
  label: string;
  aliases?: string[];
  icon: ReactNode;
};

type TechBadgeMeta = {
  key?: string;
  label: string;
  icon?: ReactNode;
};

const iconClassName = "h-4 w-4 text-current";

function renderLucideIcon(Icon: (props: LucideProps) => ReactNode) {
  return <Icon className={iconClassName} strokeWidth={2} />;
}

const techCatalog: TechDefinition[] = [
  { key: "javascript", label: "JavaScript", aliases: ["js"], icon: <SiJavascript className={`${iconClassName} text-yellow-400`} /> },
  { key: "typescript", label: "TypeScript", aliases: ["ts", "typescirpt"], icon: <SiTypescript className={`${iconClassName} text-blue-400`} /> },
  { key: "html5", label: "HTML5", aliases: ["html"], icon: <FaHtml5 className={`${iconClassName} text-orange-500`} /> },
  { key: "css3", label: "CSS3", aliases: ["css"], icon: <FaCss3Alt className={`${iconClassName} text-blue-500`} /> },
  { key: "react", label: "React", aliases: ["reactjs"], icon: <FaReact className={`${iconClassName} text-sky-400`} /> },
  { key: "nextjs", label: "Next.js", aliases: ["next", "next js"], icon: <SiNextdotjs className={`${iconClassName} text-white`} /> },
  { key: "tailwindcss", label: "Tailwind CSS", aliases: ["tailwind", "tailwindcss"], icon: <SiTailwindcss className={`${iconClassName} text-cyan-400`} /> },
  { key: "nodejs", label: "Node.js", aliases: ["node", "node js"], icon: <SiNodedotjs className={`${iconClassName} text-green-400`} /> },
  { key: "expressjs", label: "Express.js", aliases: ["express", "express js"], icon: <SiExpress className={`${iconClassName} text-white`} /> },
  { key: "nestjs", label: "NestJS", aliases: ["nest", "nest js"], icon: <SiNestjs className={`${iconClassName} text-rose-400`} /> },
  { key: "golang", label: "Go", aliases: ["go"], icon: <SiGo className={`${iconClassName} text-cyan-300`} /> },
  { key: "python", label: "Python", icon: <SiPython className={`${iconClassName} text-yellow-300`} /> },
  { key: "php", label: "PHP", icon: <SiPhp className={`${iconClassName} text-indigo-300`} /> },
  { key: "laravel", label: "Laravel", icon: <SiLaravel className={`${iconClassName} text-red-500`} /> },
  { key: "kotlin", label: "Kotlin", icon: <SiKotlin className={`${iconClassName} text-purple-400`} /> },
  { key: "java", label: "Java", icon: <BiLogoJava className={`${iconClassName} text-orange-400`} /> },
  { key: "csharp", label: "C#", aliases: ["c#"], icon: <TbBrandCSharp className={`${iconClassName} text-violet-300`} /> },
  { key: "cplusplus", label: "C++", aliases: ["c++"], icon: <BiLogoCPlusPlus className={`${iconClassName} text-sky-300`} /> },
  { key: "rust", label: "Rust", icon: <SiRust className={`${iconClassName} text-orange-300`} /> },
  { key: "postgresql", label: "PostgreSQL", aliases: ["postgres", "postgre", "postgre sql"], icon: <SiPostgresql className={`${iconClassName} text-sky-300`} /> },
  { key: "mysql", label: "MySQL", icon: <SiMysql className={`${iconClassName} text-blue-300`} /> },
  { key: "mongodb", label: "MongoDB", icon: <SiMongodb className={`${iconClassName} text-green-400`} /> },
  { key: "redis", label: "Redis", icon: <SiRedis className={`${iconClassName} text-rose-400`} /> },
  { key: "firebase", label: "Firebase", icon: <SiFirebase className={`${iconClassName} text-yellow-300`} /> },
  { key: "supabase", label: "Supabase", icon: <SiSupabase className={`${iconClassName} text-green-400`} /> },
  { key: "neon", label: "Neon Postgres", aliases: ["neon postgres", "neon database"], icon: renderLucideIcon(Database) },
  { key: "prisma", label: "Prisma", icon: <SiPrisma className={`${iconClassName} text-white`} /> },
  { key: "drizzle", label: "Drizzle ORM", aliases: ["drizzle orm"], icon: <SiDrizzle className={`${iconClassName} text-lime-300`} /> },
  { key: "graphql", label: "GraphQL", icon: <SiGraphql className={`${iconClassName} text-pink-400`} /> },
  { key: "restapi", label: "REST API", aliases: ["rest", "api"], icon: <TbApi className={`${iconClassName} text-cyan-300`} /> },
  { key: "docker", label: "Docker", icon: <SiDocker className={`${iconClassName} text-sky-400`} /> },
  { key: "linux", label: "Linux", icon: <SiLinux className={`${iconClassName} text-amber-200`} /> },
  { key: "vercel", label: "Vercel", icon: <SiVercel className={`${iconClassName} text-white`} /> },
  { key: "railway", label: "Railway", icon: <SiRailway className={`${iconClassName} text-white`} /> },
  { key: "cloudinary", label: "Cloudinary", icon: <SiCloudinary className={`${iconClassName} text-blue-300`} /> },
  { key: "clerk", label: "Clerk", icon: <SiClerk className={`${iconClassName} text-purple-300`} /> },
  { key: "groq", label: "Groq AI", aliases: ["groq ai"], icon: renderLucideIcon(Sparkles) },
  { key: "cheerio", label: "Cheerio", icon: <SiCheerio className={`${iconClassName} text-lime-300`} /> },
  { key: "expo", label: "Expo", icon: <SiExpo className={`${iconClassName} text-white`} /> },
  { key: "reactnative", label: "React Native", aliases: ["react native"], icon: <FaReact className={`${iconClassName} text-indigo-400`} /> },
  { key: "github", label: "GitHub", icon: <FaGithub className={`${iconClassName} text-white`} /> },
  { key: "git", label: "Git", icon: <FaGitAlt className={`${iconClassName} text-orange-400`} /> },
  { key: "figma", label: "Figma", icon: <SiFigma className={`${iconClassName} text-pink-400`} /> },
  { key: "unity", label: "Unity", icon: <BiLogoUnity className={`${iconClassName} text-white`} /> },
  { key: "visualstudio", label: "Visual Studio", aliases: ["visual studio code", "vscode"], icon: <BiLogoVisualStudio className={`${iconClassName} text-blue-400`} /> },
  { key: "midtrans", label: "Midtrans", icon: renderLucideIcon(CreditCard) },
  { key: "openai", label: "OpenAI", icon: renderLucideIcon(Sparkles) },
  { key: "terminal", label: "CLI", aliases: ["bash", "shell", "terminal", "gnu bash"], icon: <SiGnubash className={`${iconClassName} text-white`} /> },
];

const techMap = new Map<string, TechDefinition>();

function normalizeTechKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/c\+\+/g, "cplusplus")
    .replace(/c#/g, "csharp");
}

for (const tech of techCatalog) {
  const keys = [tech.key, tech.label, ...(tech.aliases ?? [])];

  for (const key of keys) {
    techMap.set(normalizeTechKey(key), tech);
  }
}

export const featuredSkills = [
  "Next.js",
  "Tailwind CSS",
  "TypeScript",
  "React",
  "Node.js",
  "Go",
  "Python",
  "PostgreSQL",
  "Drizzle ORM",
  "Clerk",
  "Neon Postgres",
  "Groq AI",
  "Cheerio",
  "Firebase",
  "Supabase",
  "Docker",
  "Vercel",
  "GitHub",
  "Figma",
  "Linux",
].map((skill) => getTechMeta(skill) ?? { label: skill });

export const techSuggestions = techCatalog.map((tech) => tech.label);

export function getTechMeta(value: string): TechBadgeMeta | undefined {
  const tech = techMap.get(normalizeTechKey(value));

  if (!tech) {
    return undefined;
  }

  return {
    key: tech.key,
    label: tech.label,
    icon: tech.icon,
  };
}

export function getTechDisplayLabel(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  return getTechMeta(normalized)?.label ?? normalized.replace(/[_-]+/g, " ");
}

export function normalizeTechValue(value: string) {
  return getTechDisplayLabel(value);
}

export function isSameTech(a: string, b: string) {
  return normalizeTechKey(a) === normalizeTechKey(b);
}

export function getTechInitials(value: string) {
  const label = getTechDisplayLabel(value);

  if (!label) {
    return "NA";
  }

  if (label === "C#" || label === "C++") {
    return label;
  }

  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getFallbackTechIcon(value: string) {
  const label = value.trim().toLowerCase();

  if (label.includes("api")) {
    return <TbApi className={`${iconClassName} text-cyan-300`} />;
  }

  if (label.includes("ai")) {
    return renderLucideIcon(Sparkles);
  }

  return renderLucideIcon(TerminalSquare);
}
