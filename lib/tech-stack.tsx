import type { ReactNode } from "react";
import { skillGroups } from "@/content/profile";
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
import { FaCss3Alt, FaGithub, FaGitAlt, FaHtml5, FaReact } from "react-icons/fa";
import {
  SiAlpinedotjs,
  SiAndroidstudio,
  SiCheerio,
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
  SiGooglecloud,
  SiJavascript,
  SiKotlin,
  SiLaravel,
  SiLinux,
  SiLivewire,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiRailway,
  SiSupabase,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVercel,
  SiWordpress,
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
  { key: "keras", label: "TensorFlow / Keras", icon: <SiTensorflow className={icn} /> },
  { key: "sklearn", label: "scikit-learn", icon: L(BrainCircuit) },
  { key: "numpy", label: "NumPy", icon: L(Cpu) },
  { key: "pandas", label: "pandas", icon: L(Database) },
  { key: "cicd", label: "CI/CD", icon: <SiGithubactions className={icn} /> },
  { key: "ai-assisted", label: "AI-assisted development", icon: L(BrainCircuit) },
  { key: "mayar", label: "Mayar", icon: L(CreditCard) },
  { key: "coolify", label: "Coolify", icon: L(Cloud) },
  { key: "betterauth", label: "Better Auth", icon: L(Database) },
  { key: "rls", label: "Row Level Security", icon: L(Database) },
  { key: "javascript", label: "JavaScript", aliases: ["js"], icon: <SiJavascript className={`${icn} text-yellow-400`} /> },
  { key: "typescript", label: "TypeScript", aliases: ["ts", "typescirpt"], icon: <SiTypescript className={`${icn} text-blue-400`} /> },
  { key: "html5", label: "HTML5", aliases: ["html"], icon: <FaHtml5 className={`${icn} text-orange-500`} /> },
  { key: "css3", label: "CSS3", aliases: ["css"], icon: <FaCss3Alt className={`${icn} text-blue-500`} /> },
  { key: "react", label: "React", aliases: ["reactjs"], icon: <FaReact className={`${icn} text-sky-400`} /> },
  { key: "nextjs", label: "Next.js", aliases: ["next", "next js"], icon: <SiNextdotjs className={`${icn} text-white`} /> },
  { key: "tailwindcss", label: "Tailwind CSS", aliases: ["tailwind", "tailwindcss", "tailwind css 4"], icon: <SiTailwindcss className={`${icn} text-cyan-400`} /> },
  { key: "nodejs", label: "Node.js", aliases: ["node", "node js"], icon: <SiNodedotjs className={`${icn} text-green-400`} /> },
  { key: "expressjs", label: "Express.js", aliases: ["express", "express js"], icon: <SiExpress className={`${icn} text-white`} /> },
  { key: "python", label: "Python", icon: <SiPython className={`${icn} text-yellow-300`} /> },
  { key: "php", label: "PHP", icon: <SiPhp className={`${icn} text-indigo-300`} /> },
  { key: "laravel", label: "Laravel", icon: <SiLaravel className={`${icn} text-red-500`} /> },
  { key: "kotlin", label: "Kotlin", icon: <SiKotlin className={`${icn} text-purple-400`} /> },
  { key: "sql", label: "SQL", icon: L(Database) },
  { key: "csharp", label: "C#", aliases: ["c#"], icon: <TbBrandCSharp className={`${icn} text-violet-300`} /> },
  { key: "postgresql", label: "PostgreSQL", aliases: ["postgres", "postgre", "postgre sql"], icon: <SiPostgresql className={`${icn} text-sky-300`} /> },
  { key: "mysql", label: "MySQL", icon: <SiMysql className={`${icn} text-blue-300`} /> },
  { key: "firebase", label: "Firebase", icon: <SiFirebase className={`${icn} text-yellow-300`} /> },
  { key: "supabase", label: "Supabase", icon: <SiSupabase className={`${icn} text-green-400`} /> },
  { key: "neon", label: "Neon Postgres", aliases: ["neon postgres", "neon database"], icon: L(Database) },
  { key: "drizzle", label: "Drizzle ORM", aliases: ["drizzle orm"], icon: <SiDrizzle className={`${icn} text-lime-300`} /> },
  { key: "restapi", label: "REST API", aliases: ["rest", "api"], icon: <TbApi className={`${icn} text-cyan-300`} /> },
  { key: "wordpress", label: "WordPress", aliases: ["wp"], icon: <SiWordpress className={`${icn} text-sky-400`} /> },
  { key: "docker", label: "Docker", icon: <SiDocker className={`${icn} text-sky-400`} /> },
  { key: "linux", label: "Linux", icon: <SiLinux className={`${icn} text-amber-200`} /> },
  { key: "vercel", label: "Vercel", icon: <SiVercel className={`${icn} text-white`} /> },
  { key: "railway", label: "Railway", icon: <SiRailway className={`${icn} text-white`} /> },
  { key: "cloudinary", label: "Cloudinary", icon: <SiCloudinary className={`${icn} text-blue-300`} /> },
  { key: "groq", label: "Groq AI", aliases: ["groq ai"], icon: L(Sparkles) },
  { key: "cheerio", label: "Cheerio", icon: <SiCheerio className={`${icn} text-lime-300`} /> },
  { key: "expo", label: "Expo", icon: <SiExpo className={`${icn} text-white`} /> },
  { key: "reactnative", label: "React Native", aliases: ["react native"], icon: <FaReact className={`${icn} text-indigo-400`} /> },
  { key: "github", label: "GitHub", icon: <FaGithub className={`${icn} text-white`} /> },
  { key: "git", label: "Git", icon: <FaGitAlt className={`${icn} text-orange-400`} /> },
  { key: "figma", label: "Figma", icon: <SiFigma className={`${icn} text-pink-400`} /> },
  { key: "midtrans", label: "Midtrans", icon: L(CreditCard) },
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
  { key: "gcp", label: "GCP", aliases: ["google cloud", "google cloud platform"], icon: <SiGooglecloud className={`${icn} text-blue-300`} /> },
  { key: "aws", label: "AWS EC2", aliases: ["aws", "amazon web services", "amazon"], icon: L(Cloud) },
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

export function getTechsByCategory() {
  return Object.entries(skillGroups).map(([category, labels]) => ({
    category,
    techs: labels.map((l) => getTechMeta(l)).filter((t): t is NonNullable<typeof t> => t != null),
  }));
}

export function getTechMeta(value: string): TechBadgeMeta | undefined {
  return techMap.get(normalizeTechKey(value));
}

export function getTechDisplayLabel(value: string) {
  const n = value.trim();
  if (!n) return "";
  return getTechMeta(n)?.label ?? n.replace(/[_-]+/g, " ");
}

export function getFallbackTechIcon() {
  return L(TerminalSquare);
}
