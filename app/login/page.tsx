"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Kalau sudah login dan emailnya cocok, langsung redirect
  useEffect(() => {
    if (user?.email === "ahyar12324@gmail.com") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Hanya izinkan email tertentu!
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== "ahyar12324@gmail.com") {
        // Auto logout kalau bukan email admin!
        await signOut(auth);
        alert("Hanya akun admin yang diizinkan!");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      alert("Gagal login! Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-[#13171f]/90 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-sm flex flex-col gap-5 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-[#61DCA3] text-center mb-2 tracking-tight">
          Admin Login
        </h2>
        <button
          onClick={handleLogin}
          className="bg-[#61DCA3] text-[#0B0F15] py-3 rounded-lg font-bold shadow hover:scale-105 transition-all"
        >
          Login with Google
        </button>
        <div className="text-gray-400 text-xs text-center mt-3">
          Hanya untuk admin: <b>ahyar12324@gmail.com</b>
        </div>
      </div>
      {/* Fade-in animasi */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease;
        }
      `}</style>
    </div>
  );
}
