"use client";
import { useRouter } from "next/navigation";
import { FaProjectDiagram, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const router = useRouter();

  const options = [
    {
      title: "Manage Projects",
      desc: "Add, edit, or delete your project portfolio in one place.",
      icon: <FaProjectDiagram className="text-4xl text-[#61DCA3]" />,
      href: "/dashboard/projects",
      color: "from-[#43e97b] to-[#38f9d7]",
    },
    {
      title: "Manage Experiences",
      desc: "Showcase your work experience and education easily.",
      icon: <FaUserTie className="text-4xl text-[#61DCA3]" />,
      href: "/dashboard/experiences",
      color: "from-[#6a11cb] to-[#2575fc]",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0b0f15] px-3 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4"
      >
        Welcome to Admin Dashboard
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-gray-400 text-lg text-center mb-8 max-w-2xl"
      >
        Select what you want to manage below.
      </motion.p>

      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-8">
        {options.map((opt, i) => (
          <motion.div
            key={opt.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2 + i * 0.15,
              duration: 0.5,
              type: "spring",
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 #61dca380" }}
            onClick={() => router.push(opt.href)}
            className={`
              cursor-pointer w-full md:w-1/2 max-w-md bg-gradient-to-br ${opt.color}
              rounded-2xl shadow-xl transition-all duration-300 flex flex-col items-center gap-4 py-10 px-7
              border-2 border-[#232537] hover:border-[#61DCA3] hover:shadow-2xl
              group relative
            `}
            style={{ minHeight: 210 }}
          >
            <div className="absolute top-5 right-5 opacity-20 group-hover:opacity-40 text-[60px] pointer-events-none">
              {opt.icon}
            </div>
            <div className="flex flex-col items-center gap-3 z-10">
              <span className="bg-[#181a21]/90 p-4 rounded-full border-4 border-[#61DCA3] shadow-lg">
                {opt.icon}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                {opt.title}
              </h2>
              <p className="text-base md:text-lg text-gray-100 text-center">
                {opt.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
