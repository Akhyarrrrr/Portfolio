"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email === "ahyar12324@gmail.com") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== "ahyar12324@gmail.com") {
        await signOut(auth);
        alert("Hanya akun admin yang diizinkan!");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      alert("Gagal login! Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b0f15] relative overflow-hidden px-4">
      {/* Lottie with soft shadow glow */}
      <div className="relative flex flex-col items-center w-full z-10">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <div
            className="rounded-full blur-2xl opacity-40"
            style={{
              background:
                "radial-gradient(circle, #61dca380 30%, transparent 80%)",
              width: "620px",
              height: "620px",
            }}
          />
        </div>
        <div className="w-36 h-36 md:w-96 md:h-96 relative z-20 flex items-center justify-center animate-pop-in">
          <DotLottieReact
            src="https://lottie.host/3a3a6bfa-c42d-42be-aebe-fbd87507d3d6/LCJHZoKvgu.lottie"
            loop
            autoplay
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              minWidth: 0,
              minHeight: 0,
            }}
          />
        </div>
      </div>

      {/* Glass Card */}
      <div className="relative z-30 w-full max-w-sm mt-1">
        <div className="backdrop-blur-xl bg-[#181d23cc] border border-[#232537] shadow-2xl rounded-3xl px-8 py-10 flex flex-col gap-7 items-center animate-slide-fade-in">
          <h2 className="text-3xl md:text-4xl font-black text-[#61DCA3] text-center tracking-tight drop-shadow mb-2">
            Admin Login
          </h2>
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`flex items-center justify-center gap-3 w-full bg-[#61DCA3] text-[#0B0F15] py-3 px-6 rounded-xl font-bold shadow-xl text-lg focus:ring-4 focus:ring-[#61dca3]/30 outline-none
              transition-all duration-200 hover:scale-105 hover:bg-[#50b57e] active:scale-100 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            <FcGoogle className="text-2xl" />
            {loading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Loading...
              </span>
            ) : (
              <span>Login with Google</span>
            )}
          </button>
          <div className="text-gray-400 text-xs text-center mt-2 select-none">
            Hanya untuk admin: <b>ahyar12324@gmail.com</b>
          </div>
        </div>
      </div>

      {/* Extra Animations */}
      <style jsx global>{`
        @keyframes slide-fade-in {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-slide-fade-in {
          animation: slide-fade-in 1s cubic-bezier(0.23, 1.05, 0.32, 1) both;
        }
        @keyframes pop-in {
          from {
            opacity: 0;
            transform: scale(0.88);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pop-in {
          animation: pop-in 0.7s cubic-bezier(0.23, 1.05, 0.32, 1) both;
        }
      `}</style>
    </div>
  );
}
