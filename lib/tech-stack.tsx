import type { ReactNode } from "react";
import {
  BarChart3,
  BrainCircuit,
  Cloud,
  Cpu,
  Database,
  CreditCard,
  FileText,
  GripHorizontal,
  Pencil,
  ScanFace,
  Sparkles,
  TerminalSquare,
  type LucideProps,
} from "lucide-react";
import { BiLogoCPlusPlus, BiLogoJava, BiLogoUnity, BiLogoVisualStudio } from "react-icons/bi";
import { FaCss3Alt, FaGithub, FaGitAlt, FaHtml5, FaReact } from "react-icons/fa";
import {
  SiAdonisjs,
  SiAlpinedotjs,
  SiAndroidstudio,
  SiCheerio,
  SiClerk,
  SiCloudinary,
  SiDocker,
  SiDrizzle,
  SiExpo,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGithubactions,
  SiGnubash,
  SiGo,
  SiGooglecloud,
  SiGraphql,
  SiJavascript,
  SiKotlin,
  SiLaravel,
  SiLinux,
  SiLivewire,
  SiMariadb,
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
  SiTensorflow,
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

const icn = "h-4 w-4 text-current";

function L(Icon: (props: LucideProps) => ReactNode) {
  return <Icon className={icn} strokeWidth={2} />;
}

const techCatalog: TechDefinition[] = [
  { key: "javascript", label: "JavaScript", aliases: ["js"], icon: <SiJavascript className={`${icn} text-yellow-400`} /> },
  { key: "typescript", label: "TypeScript", aliases: ["ts", "typescirpt"], icon: <SiTypescript className={`${icn} text-blue-400`} /> },
  { key: "html5", label: "HTML5", aliases: ["html"], icon: <FaHtml5 className={`${icn} text-orange-500`} /> },
  { key: "css3", label: "CSS3", aliases: ["css"], icon: <FaCss3Alt className={`${icn} text-blue-500`} /> },
  { key: "react", label: "React", aliases: ["reactjs"], icon: <FaReact className={`${icn} text-sky-400`} /> },
  { key: "nextjs", label: "Next.js", aliases: ["next", "next js"], icon: <SiNextdotjs className={`${icn} text-white`} /> },
  { key: "tailwindcss", label: "Tailwind CSS", aliases: ["tailwind", "tailwindcss"], icon: <SiTailwindcss className={`${icn} text-cyan-400`} /> },
  { key: "nodejs", label: "Node.js", aliases: ["node", "node js"], icon: <SiNodedotjs className={`${icn} text-green-400`} /> },
  { key: "expressjs", label: "Express.js", aliases: ["express", "express js"], icon: <SiExpress className={`${icn} text-white`} /> },
  { key: "nestjs", label: "NestJS", aliases: ["nest", "nest js"], icon: <SiNestjs className={`${icn} text-rose-400`} /> },
  { key: "golang", label: "Go", aliases: ["go"], icon: <SiGo className={`${icn} text-cyan-300`} /> },
  { key: "python", label: "Python", icon: <SiPython className={`${icn} text-yellow-300`} /> },
  { key: "php", label: "PHP", icon: <SiPhp className={`${icn} text-indigo-300`} /> },
  { key: "laravel", label: "Laravel", icon: <SiLaravel className={`${icn} text-red-500`} /> },
  { key: "kotlin", label: "Kotlin", icon: <SiKotlin className={`${icn} text-purple-400`} /> },
  { key: "java", label: "Java", icon: <BiLogoJava className={`${icn} text-orange-400`} /> },
  { key: "csharp", label: "C#", aliases: ["c#"], icon: <TbBrandCSharp className={`${icn} text-violet-300`} /> },
  { key: "cplusplus", label: "C++", aliases: ["c++"], icon: <BiLogoCPlusPlus className={`${icn} text-sky-300`} /> },
  { key: "rust", label: "Rust", icon: <SiRust className={`${icn} text-orange-300`} /> },
  { key: "postgresql", label: "PostgreSQL", aliases: ["postgres", "postgre", "postgre sql"], icon: <SiPostgresql className={`${icn} text-sky-300`} /> },
  { key: "mysql", label: "MySQL", icon: <SiMysql className={`${icn} text-blue-300`} /> },
  { key: "mongodb", label: "MongoDB", icon: <SiMongodb className={`${icn} text-green-400`} /> },
  { key: "redis", label: "Redis", icon: <SiRedis className={`${icn} text-rose-400`} /> },
  { key: "firebase", label: "Firebase", icon: <SiFirebase className={`${icn} text-yellow-300`} /> },
  { key: "supabase", label: "Supabase", icon: <SiSupabase className={`${icn} text-green-400`} /> },
  { key: "neon", label: "Neon Postgres", aliases: ["neon postgres", "neon database"], icon: L(Database) },
  { key: "prisma", label: "Prisma", icon: <SiPrisma className={`${icn} text-white`} /> },
  { key: "drizzle", label: "Drizzle ORM", aliases: ["drizzle orm"], icon: <SiDrizzle className={`${icn} text-lime-300`} /> },
  { key: "graphql", label: "GraphQL", icon: <SiGraphql className={`${icn} text-pink-400`} /> },
  { key: "restapi", label: "REST API", aliases: ["rest", "api"], icon: <TbApi className={`${icn} text-cyan-300`} /> },
  { key: "docker", label: "Docker", icon: <SiDocker className={`${icn} text-sky-400`} /> },
  { key: "linux", label: "Linux", icon: <SiLinux className={`${icn} text-amber-200`} /> },
  { key: "vercel", label: "Vercel", icon: <SiVercel className={`${icn} text-white`} /> },
  { key: "railway", label: "Railway", icon: <SiRailway className={`${icn} text-white`} /> },
  { key: "cloudinary", label: "Cloudinary", icon: <SiCloudinary className={`${icn} text-blue-300`} /> },
  { key: "clerk", label: "Clerk", icon: <SiClerk className={`${icn} text-purple-300`} /> },
  { key: "groq", label: "Groq AI", aliases: ["groq ai"], icon: L(Sparkles) },
  { key: "cheerio", label: "Cheerio", icon: <SiCheerio className={`${icn} text-lime-300`} /> },
  { key: "expo", label: "Expo", icon: <SiExpo className={`${icn} text-white`} /> },
  { key: "reactnative", label: "React Native", aliases: ["react native"], icon: <FaReact className={`${icn} text-indigo-400`} /> },
  { key: "github", label: "GitHub", icon: <FaGithub className={`${icn} text-white`} /> },
  { key: "git", label: "Git", icon: <FaGitAlt className={`${icn} text-orange-400`} /> },
  { key: "figma", label: "Figma", icon: <SiFigma className={`${icn} text-pink-400`} /> },
  { key: "unity", label: "Unity", icon: <BiLogoUnity className={`${icn} text-white`} /> },
  { key: "visualstudio", label: "Visual Studio", aliases: ["visual studio code", "vscode"], icon: <BiLogoVisualStudio className={`${icn} text-blue-400`} /> },
  { key: "midtrans", label: "Midtrans", icon: L(CreditCard) },
  { key: "openai", label: "OpenAI", icon: L(Sparkles) },
  { key: "terminal", label: "CLI", aliases: ["bash", "shell", "terminal", "gnu bash"], icon: <SiGnubash className={`${icn} text-white`} /> },
  { key: "framermotion", label: "Framer Motion", aliases: ["framer", "framer motion"], icon: <SiFramer className={`${icn} text-white`} /> },
  { key: "tensorflow", label: "TensorFlow", aliases: ["tensorflow.js", "tensorflow js", "tfjs", "tensor flow"], icon: <SiTensorflow className={`${icn} text-orange-400`} /> },
  { key: "faceapi", label: "face-api.js", aliases: ["face api", "face api js", "faceapi.js", "faceapijs"], icon: L(ScanFace) },
  { key: "recharts", label: "Recharts", aliases: ["recharts.js"], icon: L(BarChart3) },
  { key: "jspdf", label: "jsPDF", aliases: ["jspdf.js", "js pdf"], icon: L(FileText) },
  { key: "pgvector", label: "pgvector", aliases: ["pg vector"], icon: L(BrainCircuit) },
  { key: "dndkit", label: "dnd-kit", aliases: ["dnd kit", "dndkit"], icon: L(GripHorizontal) },
  { key: "tiptap", label: "Tiptap", icon: L(Pencil) },
  { key: "androidstudio", label: "Android Studio", aliases: ["android studio"], icon: <SiAndroidstudio className={`${icn} text-green-400`} /> },
  { key: "webworkers", label: "Web Workers", aliases: ["web workers", "web worker"], icon: L(Cpu) },
  { key: "githubactions", label: "GitHub Actions", aliases: ["github actions", "gh actions"], icon: <SiGithubactions className={`${icn} text-blue-400`} /> },
  { key: "adonisjs", label: "AdonisJS", aliases: ["adonis", "adonis js"], icon: <SiAdonisjs className={`${icn} text-violet-400`} /> },
  { key: "gcp", label: "Google Cloud", aliases: ["gcp", "google cloud platform"], icon: <SiGooglecloud className={`${icn} text-blue-300`} /> },
  { key: "aws", label: "AWS", aliases: ["amazon web services", "amazon"], icon: L(Cloud) },
  { key: "mariadb", label: "MariaDB", aliases: ["maria db"], icon: <SiMariadb className={`${icn} text-amber-400`} /> },
  { key: "alpinejs", label: "Alpine.js", aliases: ["alpine", "alpine js", "alpine.js"], icon: <SiAlpinedotjs className={`${icn} text-sky-500`} /> },
  { key: "livewire", label: "Livewire", aliases: ["livewire laravel"], icon: <SiLivewire className={`${icn} text-pink-400`} /> },
];

// ── Lookup ─────────────────────────────────────────────────────

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
  for (const key of [tech.key, tech.label, ...(tech.aliases ?? [])]) {
    techMap.set(normalizeTechKey(key), tech);
  }
}

export const featuredSkills = [
  "Next.js", "Tailwind CSS", "TypeScript", "React", "Node.js", "Go", "Python",
  "PostgreSQL", "Drizzle ORM", "Firebase", "Supabase", "Docker", "Vercel", "GitHub", "Figma", "Linux",
].map((s) => getTechMeta(s) ?? { label: s });

export const techCategories = {
  Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5", "CSS3"],
  // Prisma and Drizzle ORM moved here from Database — they're ORMs (a
  // backend data-access layer), not databases themselves.
  Backend: ["Node.js", "Express.js", "NestJS", "Go", "Python", "PHP", "Laravel", "GraphQL", "REST API", "Prisma", "Drizzle ORM"],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "Supabase"],
  "DevOps & Tools": ["Docker", "Linux", "Git", "GitHub", "Vercel", "Railway", "Cloudinary", "Figma"],
  Mobile: ["React Native", "Expo", "Kotlin", "Java"],
} as const;

export type TechCategory = keyof typeof techCategories;

export function getTechsByCategory() {
  return Object.entries(techCategories).map(([category, labels]) => ({
    category: category as TechCategory,
    techs: labels.map((l) => getTechMeta(l)).filter((t): t is NonNullable<typeof t> => t != null),
  }));
}

export const techSuggestions = techCatalog.map((t) => t.label);

export function getTechMeta(value: string): TechBadgeMeta | undefined {
  return techMap.get(normalizeTechKey(value));
}

export function getTechDisplayLabel(value: string) {
  const n = value.trim();
  if (!n) return "";
  return getTechMeta(n)?.label ?? n.replace(/[_-]+/g, " ");
}

export function normalizeTechValue(value: string) {
  return getTechDisplayLabel(value);
}

export function isSameTech(a: string, b: string) {
  return normalizeTechKey(a) === normalizeTechKey(b);
}

export function getFallbackTechIcon(_value: string) {
  return L(TerminalSquare);
}
