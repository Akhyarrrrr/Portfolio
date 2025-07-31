"use client";
import { useRouter } from "next/navigation";
import { FaProjectDiagram, FaUserTie } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const router = useRouter();
  const { signOut } = useAuth();

  const options = [
    {
      title: "Manage Projects",
      desc: "Add, edit, or delete your project portfolio.",
      icon: <FaProjectDiagram className="text-3xl text-white" />,
      href: "/dashboard/projects",
      color: "from-gray-700 to-gray-800",
      borderColor: "hover:border-[#61DCA3]",
    },
    {
      title: "Manage Experiences",
      desc: "Showcase your work experience and education.",
      icon: <FaUserTie className="text-3xl text-white" />,
      href: "/dashboard/experiences",
      color: "from-gray-700 to-gray-800",
      borderColor: "hover:border-[#61DCA3]",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] text-white p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold md:text-center text-left mt-6 md:mt-0">
            Welcome back, <span className="text-[#61DCA3]">Yar!</span>
          </h1>
          <button
            onClick={async () => {
              await signOut();
              router.replace("/login");
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-lg text-center mb-12"
        >
          What would you like to manage today?
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((opt, i) => (
            <motion.div
              key={opt.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4 + i * 0.1,
                duration: 0.5,
                type: "spring",
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => router.push(opt.href)}
              className={`cursor-pointer w-full bg-gradient-to-br ${opt.color} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between border-2 border-transparent ${opt.borderColor}`}
              style={{ minHeight: 240 }}
            >
              <div>
                <div className="bg-black/30 p-4 rounded-full w-max mb-4 shadow-md">
                  {opt.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {opt.title}
                </h2>
                <p className="text-gray-300">{opt.desc}</p>
              </div>
              <div className="text-right mt-4 font-semibold opacity-80 group-hover:opacity-100 text-[#61DCA3]">
                Go to manager &rarr;
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
